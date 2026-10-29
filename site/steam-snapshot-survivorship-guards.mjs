// Pure snapshot-reconciliation instrument. Never accepts real Steam AppIDs or merchant records.
const isoDay=value=>{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const d=new Date(value+'T00:00:00Z');
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;
};
const fixture=value=>typeof value==='string'&&/^fixture-[a-z0-9-]+$/.test(value);
const modes=new Set(['early_access','advance_access','full_release']);
const types=new Set(['game','demo','dlc','software','soundtrack']);
const scalar=value=>value===null||value===undefined?'unknown':String(value);
export function reconcileSyntheticSteamSnapshots(snapshots,window){
 if(!Array.isArray(snapshots)||!snapshots.length)throw new TypeError('Nonempty synthetic snapshot array required');
 if(!window||!isoDay(window.start)||!isoDay(window.endExclusive)||window.start>=window.endExclusive)
  throw new TypeError('Invalid date window');
 const ids=new Set(),games=new Map(),current=[],frames=new Set();
 for(const snap of snapshots){
  if(!snap||!fixture(snap.snapshot_id)||ids.has(snap.snapshot_id))throw new TypeError('Unique synthetic snapshot ID required');
  ids.add(snap.snapshot_id);
  if(!isoDay(snap.captured_at)||!['current_store_list','first_release_attestation'].includes(snap.kind)||!Array.isArray(snap.records))
   throw new TypeError('Invalid date, kind or records');
  if(snap.kind==='current_store_list'){
   if(!fixture(snap.frame_id)||typeof snap.complete_pagination!=='boolean')throw new TypeError('Catalog scope and pagination completeness required');
   frames.add(snap.frame_id);current.push(snap);
  } else if(snap.complete_pagination!==undefined||snap.frame_id!==undefined)throw new TypeError('Attestation is not a catalog census');
  const local=new Set();
  for(const r of snap.records){
   if(!r||!fixture(r.fixture_id)||local.has(r.fixture_id))throw new TypeError('Unique synthetic game identifier required per snapshot');
   local.add(r.fixture_id);
   if(!games.has(r.fixture_id))games.set(r.fixture_id,{id:r.fixture_id,seen_in_catalog:new Set(),assertions:[],last_modified_observations:[]});
   const g=games.get(r.fixture_id);
   if(snap.kind==='current_store_list'){
    if(r.initial_paid_status!==undefined||r.first_paid_playable_date!==undefined||r.release_mode!==undefined)
     throw new TypeError('Current catalog metadata cannot independently attest first release');
    if(r.last_modified!==undefined){
     if(!isoDay(r.last_modified))throw new TypeError('Invalid last-modified metadata date');
     g.last_modified_observations.push(r.last_modified);
    }
    g.seen_in_catalog.add(snap.snapshot_id);
   } else {
    if(!types.has(r.app_type)&&r.app_type!==null)throw new TypeError('Attestation app type required');
    if(r.initial_paid_status!==true&&r.initial_paid_status!==false&&r.initial_paid_status!==null)
     throw new TypeError('Attestation must explicitly record true, false or null paid status');
    if(r.first_paid_playable_date!==null&&!isoDay(r.first_paid_playable_date))throw new TypeError('Attestation date must be ISO or null');
    if(r.release_mode!==null&&!modes.has(r.release_mode))throw new TypeError('Invalid first release mode');
    if(r.first_paid_playable_date!==null&&r.first_paid_playable_date>snap.captured_at)
     throw new RangeError('Attested first release cannot postdate evidence capture');
    g.assertions.push({app_type:r.app_type,paid:r.initial_paid_status,date:r.first_paid_playable_date,mode:r.release_mode});
   }
  }
 }
 // Catalog comparisons are only meaningful when the declared type/filter/geography match.
 if(frames.size>1)throw new RangeError('Incompatible current catalog filters or geographies');
 current.sort((a,b)=>a.captured_at.localeCompare(b.captured_at)||a.snapshot_id.localeCompare(b.snapshot_id));
 const last=current.at(-1),complete=last?.complete_pagination===true;
 const latestIds=new Set(last?.records.map(r=>r.fixture_id)||[]);
 const previousIds=new Set(current.slice(0,-1).flatMap(s=>s.records.map(r=>r.fixture_id)));
 const entries=[...games.values()].map(g=>{
  const assertions=g.assertions,signatures=new Set(assertions.map(x=>[scalar(x.app_type),scalar(x.paid),scalar(x.date),scalar(x.mode)].join('|')));
  let status='unresolved',reason='no_verified_initial_offer_evidence';
  if(signatures.size>1)reason='conflicting_initial_offer_attestations';
  else if(assertions.length){
   const a=assertions[0];
   if(a.app_type===null)reason='initial_app_type_unknown';
   else if(a.app_type!=='game'){status='excluded';reason='not_base_game'}
   else if(a.paid===false){status='excluded';reason='initially_free'}
   else if(a.paid!==true)reason='initial_paid_status_unknown';
   else if(a.date===null)reason='initial_paid_playable_date_unknown';
   else if(a.mode===null)reason='initial_release_mode_unknown';
   else if(a.date<window.start||a.date>=window.endExclusive){status='excluded';reason='outside_first_paid_cohort_window'}
   else{status='eligible';reason='attested_initial_paid_playable_release_in_window'}
  }
  return {fixture_id:g.id,status,reason,attestation_count:assertions.length,
   observed_in_any_current_store_snapshot:g.seen_in_catalog.size>0,
   absent_from_latest_complete_catalog:complete&&previousIds.has(g.id)&&!latestIds.has(g.id),
   confirmed_retired:null,paid_units:null,publisher_profit:null};
 }).sort((a,b)=>a.fixture_id.localeCompare(b.fixture_id));
 const counts={eligible:0,excluded:0,unresolved:0};
 for(const e of entries)counts[e.status]++;
 const absent=complete?entries.filter(e=>e.absent_from_latest_complete_catalog).length:null;
 return {kind:'synthetic_historical_offer_and_catalog_reconciliation_not_steam_census',
  snapshot_count:snapshots.length,captured_candidate_count:entries.length,entries,counts,
  latest_catalog_complete_pagination_claim:complete,
  latest_catalog_capture_date:last?.captured_at??null,
  previously_listed_absent_from_latest_complete_catalog:absent,
  absent_means_confirmed_retirement:false,
  observed_eligible_lower_bound_within_supplied_fixtures:counts.eligible,
  total_market_eligible_paid_games:null,market_zero_paid_order_fraction:null,
  market_paid_order_median:null,market_publisher_profit:null,
  catalog_filters_are_user_declared_not_externally_verified:true,
  limitation:'Only invented fixtures; absence from a catalog does not establish retirement, launch-price status, zero sales, or population completeness.'};
}
