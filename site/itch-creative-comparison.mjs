// Pure, offline audit for two seller-owned impression snapshots; no data collection or account access.
function intCount(n){return Number.isSafeInteger(n)&&n>=0;}
function isoDay(x){return typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x+'T00:00:00Z'));}
function rate(n,d){return d===0?null:n/d;}
export function auditItchCreativeComparison(input){
 const issues=[];
 if(!input||typeof input!=='object'||!input.a||!input.b||!input.design)throw new TypeError('Two variants and a design are required');
 const {a,b,design}=input;
 const required=['impressions','attributed_click_events'];
 for(const [label,r] of [['a',a],['b',b]]) {
  for(const key of required)if(!intCount(r[key]))issues.push(label+'.'+key+' must be a nonnegative integer');
  if(!isoDay(r.start)||!isoDay(r.end)||r.end<r.start)issues.push(label+' requires valid ordered ISO day dates');
  if(!r.surface||!r.population)issues.push(label+' must specify surface and measured audience population');
  if(intCount(r.impressions)&&intCount(r.attributed_click_events)&&r.attributed_click_events>r.impressions)issues.push(label+' click events exceed impression events; check metric definitions');
 }
 if(!issues.length){
  if(a.start!==b.start||a.end!==b.end)issues.push('Different time windows cannot be pooled as the same cohort');
  if(a.surface!==b.surface)issues.push('Different discovery surfaces');
  if(a.population!==b.population)issues.push('Different audience/device populations');
 }
 if(!['listing_title','cover_image','screenshots','description_copy'].includes(design.changed_feature))issues.push('Unknown or multiple simultaneous creative features');
 if(design.did_recreate_listing===true)issues.push('Do not recreate a listing to restore Most Recent exposure');
 if(design.truthful_assets_confirmed!==true)issues.push('Truthful actual-game imagery and classifications not confirmed');
 if(design.current_metrics_verified!==true)issues.push('2018 impression window requires current owner-analytics verification before use');
 if(design.concurrent_distribution_shifts!==false)issues.push('Uncontrolled channel/ranking changes remain possible');
 const causalEligible=issues.length===0&&design.allocation==='randomized_user_level'&&design.concurrent_variants===true;
 const descriptiveEligible=issues.length===0;
 return {
  comparable_descriptive:descriptiveEligible,
  causal_attribution_eligible:causalEligible,
  issues,
  click_through:{
   a:descriptiveEligible?rate(a.attributed_click_events,a.impressions):null,
   b:descriptiveEligible?rate(b.attributed_click_events,b.impressions):null,
   b_minus_a:descriptiveEligible&&a.impressions>0&&b.impressions>0?rate(b.attributed_click_events,b.impressions)-rate(a.attributed_click_events,a.impressions):null
  },
  paid_orders:null, unique_paying_buyers:null, net_profit:null, seller_population_income_effect:null,
  note:causalEligible?'Eligibility gate only: experimental validity, sufficient sample and true randomization still require independent verification.': 'Descriptive contrast only. Clicks do not establish customer payments or causal creative impact.'
 };
}
