// Research-only guardrails. All test metrics are synthetic; no account or merchant data.
export function auditRankingDesign(x){
 if(!x||typeof x!=='object')throw new TypeError('Design required');
 const required=['unit','time_window','visibility_surface','outcome','comparison','privacy_protocol'];
 const missing=required.filter(k=>!x[k]||typeof x[k]!=='string');
 return {study_ready_for_authorized_measurement:missing.length===0,missing,causal_ranking_effect:null,verified_sales:null};
}
export function interpretSeriesAggregates(x){
 if(!x||typeof x!=='object')throw new TypeError('Count object required');
 const keys=['followers','licenses_A','licenses_B','bundle_checkouts'];
 for(const k of keys)if(!Number.isSafeInteger(x[k])||x[k]<0)throw new TypeError('Invalid count: '+k);
 return {observed_counts:Object.fromEntries(keys.map(k=>[k,x[k]])),same_person_paid_repeat_fraction:null,verified_prior_game_payers:null,individually_paid_later_game_orders:null};
}
export function compareDeckGroups(a,b){
 if(!a||!b)throw new TypeError('Two groups needed');
 const keys=['release_month','genre','price_band','locales','outcome_horizon_days','evidence_kind'];
 const mismatches=keys.filter(k=>a[k]==null||b[k]==null||JSON.stringify(a[k])!==JSON.stringify(b[k]));
 return {metadata_comparable:mismatches.length===0,mismatches,causal_badge_sales_effect:null};
}
