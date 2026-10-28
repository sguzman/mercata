// Research-only deterministic eligibility logic. All records and tests are synthetic.
function isoDay(value){
 if(typeof value!=='string'||!/^(?:\d{4})-(?:\d{2})-(?:\d{2})$/.test(value))return false;
 const parsed=new Date(value+'T00:00:00Z');
 return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
}
export function classifyPaidRelease(record,window){
 if(!record||!Number.isSafeInteger(record.appid)||record.appid<1)throw new TypeError('A valid positive AppID is required');
 if(!window||!isoDay(window.start)||!isoDay(window.endExclusive)||window.start>=window.endExclusive)throw new TypeError('Window must have ISO start and later exclusive end');
 const type=record.app_type;
 if(type===null||type===undefined||type==='unknown')return {status:'unresolved',reason:'app_type_unknown'};
 if(type!=='game')return {status:'excluded',reason:'not_base_game'};
 const paid=record.paid_on_first_public_release;
 if(paid===false)return {status:'excluded',reason:'not_paid_on_initial_release'};
 if(paid!==true)return {status:'unresolved',reason:'initial_paid_status_unknown'};
 const date=record.first_public_paid_release_date;
 if(date===null||date===undefined)return {status:'unresolved',reason:'first_paid_release_date_unknown'};
 if(!isoDay(date))return {status:'unresolved',reason:'first_paid_release_date_invalid'};
 if(date<window.start||date>=window.endExclusive)return {status:'excluded',reason:'outside_cohort_window'};
 return {status:'eligible',reason:'first_public_paid_release_in_window'};
}
export function summarizePaidReleaseCandidates(records,window){
 if(!Array.isArray(records))throw new TypeError('Candidate records must be an array');
 const seen=new Set();
 const entries=records.map(record=>{
  if(!record||!Number.isSafeInteger(record.appid)||record.appid<1)throw new TypeError('Candidate AppID must be a positive integer');
  if(seen.has(record.appid))throw new Error('Duplicate AppID: '+record.appid);
  seen.add(record.appid);
  return {appid:record.appid,...classifyPaidRelease(record,window)};
 });
 const counts={eligible:0,excluded:0,unresolved:0};
 for(const entry of entries)counts[entry.status]++;
 return {
  unit:'base_game_appid',window,
  candidate_count:records.length,counts,entries,
  eligible_observed_lower_bound_within_supplied_candidates:counts.eligible,
  total_eligible_original_paid_steam_games:null,
  exact_zero_sale_games:null,
  paid_orders:null,
  unique_buyers:null,
  publisher_count:null,
  method:'eligibility_classifier_only_no_live_ingestion',
  is_population_complete:false,
  caveat:'This cannot infer global cohort totals, zero paid sales, publisher earnings or completeness from supplied candidates.'
 };
}
