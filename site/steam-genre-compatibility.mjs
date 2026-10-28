// Static research compatibility check for provider-defined modeled genre outcomes.
// This helper never turns review-derived gross estimates into actual sales, profit or causal advantage.
const KEYS=['population','paid_status','age_window_months','outcome_horizon_months','price_basis','tax_refund_treatment','tag_policy','sampling','estimator'];
export function checkGenreComparability(a,b){
 if(!a||!b||typeof a!=='object'||typeof b!=='object')throw new TypeError('Two method definitions required');
 const mismatches=[];
 for(const key of KEYS){
  if(a[key]===null||a[key]===undefined||b[key]===null||b[key]===undefined)mismatches.push({field:key,reason:'missing'});
  else if(JSON.stringify(a[key])!==JSON.stringify(b[key]))mismatches.push({field:key,reason:'different'});
 }
 return {same_statistical_target:mismatches.length===0,mismatches,validated_market_income:false,causal_genre_roi:null};
}
export function taggedCountsDoNotDeduplicate(values){
 if(!Array.isArray(values)||values.some(x=>!Number.isSafeInteger(x)||x<0))throw new TypeError('Nonnegative tag counts required');
 return {sum_of_tag_assignments:values.reduce((a,b)=>a+b,0),distinct_appids:null,can_assume_mutual_exclusivity:false};
}
