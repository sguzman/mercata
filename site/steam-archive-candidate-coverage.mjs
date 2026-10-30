// Synthetic historical-archive candidate coverage audit. No real AppIDs are read.
// Archived prices and removal labels are not a first-paid playable launch census.
const keys=(o,fields)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>fields.includes(k));
const fixture=s=>typeof s==='string'&&/^fixture-[a-z0-9-]+$/.test(s);
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const roles=['price_history','app_metadata','curated_removed_list','release_attestation','current_store_catalog'];
const events=['catalog_seen','positive_price_observed','playable_presence_observed',
 'curated_status_label','first_paid_release_attestation'];
const removal=['delisted','removed','unreleased','unpublished'];
const modes=['early_access','advance_access','full_release'];
const types=['game','demo','dlc','software','soundtrack'];
const signature=x=>[x.app_type,x.initial_paid_status,x.first_paid_playable_date,x.release_mode].join('|');
export function auditSyntheticSteamArchiveCandidateCoverage(input={}){
 if(!keys(input,['fixture_id','window','sources','observations'])||
  !fixture(input.fixture_id)||!keys(input.window,['start','endExclusive'])||
  !iso(input.window.start)||!iso(input.window.endExclusive)||
  input.window.start>=input.window.endExclusive||
  !Array.isArray(input.sources)||!input.sources.length||input.sources.length>12||
  !Array.isArray(input.observations)||input.observations.length>128)
  throw new TypeError('Bounded synthetic historical archive audit required');
 const sourceMap=new Map();
 for(const s of input.sources){
  if(!keys(s,['source_id','role','tracking_started_on','scope','observed_source_completeness'])||
   !fixture(s.source_id)||sourceMap.has(s.source_id)||!roles.includes(s.role)||
   !iso(s.tracking_started_on)||typeof s.scope!=='string'||
   !['selected','observed_catalog','unknown'].includes(s.scope)||
   ![true,false,null].includes(s.observed_source_completeness))
   throw new TypeError('Invalid or duplicate archive source coverage declaration');
  sourceMap.set(s.source_id,s);
 }
 const entries=new Map(),observationsSeen=new Set();
 for(const o of input.observations){
  if(!keys(o,['observation_id','source_id','fixture_game_id','kind','observed_on',
   'captured_on','provenance','status_label','app_type','initial_paid_status',
   'first_paid_playable_date','release_mode'])||
   !fixture(o.observation_id)||observationsSeen.has(o.observation_id)||
   !sourceMap.has(o.source_id)||!fixture(o.fixture_game_id)||!events.includes(o.kind)||
   !iso(o.observed_on)||!iso(o.captured_on)||o.observed_on>o.captured_on||
   !['provider_observed','imported_historical'].includes(o.provenance))
   throw new TypeError('Invalid or duplicate fictional historical observation');
  observationsSeen.add(o.observation_id);
  const source=sourceMap.get(o.source_id);
  if(o.provenance==='provider_observed'&&o.observed_on<source.tracking_started_on)
   throw new RangeError('Provider-observed evidence predates declared tracking start');
  if(o.kind==='first_paid_release_attestation'){
   if(source.role!=='release_attestation'||
    !types.includes(o.app_type)||![true,false,null].includes(o.initial_paid_status)||
    o.first_paid_playable_date!==null&&!iso(o.first_paid_playable_date)||
    o.first_paid_playable_date!==null&&o.first_paid_playable_date>o.observed_on||
    ![...modes,null].includes(o.release_mode)||o.status_label!==undefined)
    throw new TypeError('Invalid independent first paid release attestation');
  }else if(o.kind==='curated_status_label'){
   if(source.role!=='curated_removed_list'||!removal.includes(o.status_label)||
    ['app_type','initial_paid_status','first_paid_playable_date','release_mode']
     .some(k=>o[k]!==undefined))
    throw new TypeError('Curated removal status is not a first-paid release claim');
  }else{
   if(o.status_label!==undefined||
    ['app_type','initial_paid_status','first_paid_playable_date','release_mode']
     .some(k=>o[k]!==undefined)||
    (o.kind==='positive_price_observed'&&source.role!=='price_history')||
    (o.kind==='catalog_seen'&&!['current_store_catalog','app_metadata'].includes(source.role))||
    (o.kind==='playable_presence_observed'&&source.role!=='app_metadata'))
    throw new TypeError('Archive price or presence cannot assert a first release');
  }
  if(!entries.has(o.fixture_game_id))
   entries.set(o.fixture_game_id,{fixture_game_id:o.fixture_game_id,
    att:[],sources:new Set(),flags:new Set(),curated:new Set(),curatedObservations:[],earliest:null,imported:false});
  const e=entries.get(o.fixture_game_id);
  e.sources.add(o.source_id);
  e.flags.add(o.kind);
  if(e.earliest===null||o.observed_on<e.earliest)e.earliest=o.observed_on;
  if(o.provenance==='imported_historical')e.imported=true;
  if(o.kind==='curated_status_label'){
   e.curated.add(o.status_label);
   e.curatedObservations.push({status_label:o.status_label,observed_on:o.observed_on});
  }
  if(o.kind==='first_paid_release_attestation')e.att.push(o);
 }
 const counts={candidate_game_ids_observed:entries.size,first_paid_cohort_eligible:0,
  clearly_outside_paid_cohort_or_initially_free:0,
  unresolved_first_paid_eligibility:0,conflicting_archive_labels:0,
  curated_only_candidates:0,has_positive_price_observation:0,
  has_imported_historical_observation:0};
 const rows=[...entries.values()].sort((a,b)=>a.fixture_game_id.localeCompare(b.fixture_game_id)).map(e=>{
  const att=new Set(e.att.map(signature));
  const statement=e.att[0];
  let outcome='unresolved',reason='no_independent_initial_paid_playable_attestation';
  if(att.size>1)reason='conflicting_first_paid_release_attestations';
  else if(statement){
   if(statement.app_type!=='game'||statement.initial_paid_status===false){
    outcome='excluded';reason='not_initially_paid_base_game';
   }else if(statement.initial_paid_status!==true||statement.first_paid_playable_date===null||
     statement.release_mode===null)reason='initial_paid_launch_evidence_incomplete';
   else if(statement.first_paid_playable_date<input.window.start||
     statement.first_paid_playable_date>=input.window.endExclusive){
    outcome='excluded';reason='first_paid_launch_outside_window';
   }else{outcome='eligible';reason='independently_attested_initial_paid_playable_date_in_window'}
  }
  // An earlier "unreleased" snapshot can be true before the later paid launch.
  // Same-day labels cannot be chronologically ordered with day-level dates.
  const contradictory=outcome==='eligible'&&e.curatedObservations.some(o=>
   (o.status_label==='unreleased'||o.status_label==='unpublished')&&
   o.observed_on>=statement.first_paid_playable_date);
  if(contradictory){outcome='unresolved';reason='unreconciled_curated_unreleased_label_conflict';
   counts.conflicting_archive_labels++;}
  counts[outcome==='eligible'?'first_paid_cohort_eligible':
   outcome==='excluded'?'clearly_outside_paid_cohort_or_initially_free':
   'unresolved_first_paid_eligibility']++;
  if(e.flags.has('positive_price_observed'))counts.has_positive_price_observation++;
  if(e.imported)counts.has_imported_historical_observation++;
  if(e.flags.size===1&&e.flags.has('curated_status_label'))counts.curated_only_candidates++;
  return Object.freeze({fixture_game_id:e.fixture_game_id,
   first_paid_cohort_status:outcome,reason,
   distinct_archive_sources:e.sources.size,
   earliest_archived_event_date:e.earliest,
   has_price_observation:e.flags.has('positive_price_observed'),
   has_playable_presence_observation:e.flags.has('playable_presence_observed'),
   curated_status_labels:[...e.curated].sort(),
   has_imported_historical_record:e.imported,
   verified_paid_checkout_units:null,
   actual_retirement_confirmed:false});
 });
 return Object.freeze({
  kind:'synthetic_historical_archive_candidate_union_not_full_steam_census',
  fixture_id:input.fixture_id,cohort_window:input.window,
  sources_declared:sourceMap.size,counts,entries:rows,
  earliest_observed_price_is_initial_paid_launch:false,
  curated_delisted_label_is_proof_of_prior_paid_sale:false,
  curated_unreleased_is_verified_zero_sales:false,
  historical_archive_coverage_complete_for_steam:null,
  true_historical_first_paid_cohort_size:null,
  missing_paid_games_count:null,
  actual_zero_paid_sale_fraction:null,
  publisher_income_distribution:null,
  actual_live_archive_rows_imported:false,
  note:'Source archives have selected or unknown historical coverage. A prelaunch unreleased/unpublished label does not conflict with a later attested paid launch; same-day or later labels are unresolved. Positive price or playable presence only establishes a dated observed state, not original paid launch. Curated removal/unreleased tags cannot prove paid-sale eligibility, completed purchases, or zero demand. No independently complete historical population follows even if every supplied synthetic source declares complete pagination.'
 });
}
