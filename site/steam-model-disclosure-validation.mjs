// Public disclosure-based sales estimator scorecard checks only, not a market sample.
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const object=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const bands=['under_1000','1000_9999','10000_49999','50000_99999','100000_999999','1000000_plus'];
export function auditSteamModelDisclosurePanel(input){
 if(!object(input,['recent_disclosed_sales_validation','review_matched_disclosed_sales_validation',
  'sales_per_review_calibration','other_forecasts']))throw new TypeError('Unexpected model-disclosure panel');
 const r=input.recent_disclosed_sales_validation,
  m=input.review_matched_disclosed_sales_validation,c=input.sales_per_review_calibration,
  f=input.other_forecasts;
 if(!object(r,['cutoff','lookback_days','compared_games','within_50_percent_count',
  'within_30_percent_count','typical_estimated_units_to_disclosed_units_ratio',
  'financial_ledger_independently_authenticated','representative_paid_release_population'])||
  !object(m,['sample_size','within_50_percent_count','typical_estimated_to_disclosed_units_ratio',
  'matched_to_disclosure_time','independently_authenticated_merchant_sales'])||
  !object(c,['disclosed_game_count','bins','complete_zero_review_sampling_frame',
  'account_for_games_with_no_reported_sales'])||
  !object(f,['peak_players_week1_is_not_paid_sales','zero_concurrent_players_does_not_prove_zero_paid_orders',
  'same_provider_is_not_independent_model_validation']))
  throw new TypeError('Unexpected or missing source cohort field');
 const n=[r.lookback_days,r.compared_games,r.within_50_percent_count,r.within_30_percent_count,
  m.sample_size,m.within_50_percent_count,c.disclosed_game_count];
 if(n.some(v=>!integer(v))||r.compared_games===0||m.sample_size===0||c.disclosed_game_count===0||
  r.within_30_percent_count>r.within_50_percent_count||
  r.within_50_percent_count>r.compared_games||m.within_50_percent_count>m.sample_size)
  throw new RangeError('Inconsistent disclosure validation denominators');
 if(typeof r.cutoff!=='string'||!/^\\d{4}-\\d{2}-\\d{2}$/.test(r.cutoff)||
  !finite(r.typical_estimated_units_to_disclosed_units_ratio)||
  !finite(m.typical_estimated_to_disclosed_units_ratio)||
  r.financial_ledger_independently_authenticated!==false||
  r.representative_paid_release_population!==false||
  m.matched_to_disclosure_time!==true||
  m.independently_authenticated_merchant_sales!==false||
  c.complete_zero_review_sampling_frame!==false||
  c.account_for_games_with_no_reported_sales!==false||
  f.peak_players_week1_is_not_paid_sales!==true||
  f.zero_concurrent_players_does_not_prove_zero_paid_orders!==true||
  f.same_provider_is_not_independent_model_validation!==true)
  throw new RangeError('Invalid time anchor or unsupported sales/financial evidence');
 if(!Array.isArray(c.bins)||c.bins.length!==bands.length||
  c.bins.some((b,i)=>!object(b,['sales_class','games','typical_sales_per_review','inner_half_low','inner_half_high'])||
  b.sales_class!==bands[i]||!integer(b.games)||b.games===0||
  !finite(b.typical_sales_per_review)||!finite(b.inner_half_low)||!finite(b.inner_half_high)||
  b.inner_half_low>b.typical_sales_per_review||b.typical_sales_per_review>b.inner_half_high))
  throw new RangeError('Invalid size-stratified sales/review calibration');
 if(c.bins.reduce((a,b)=>a+b.games,0)!==c.disclosed_game_count)
  throw new RangeError('Disclosure sales-band counts do not reconcile');
 return {
  recent_panel_count:r.compared_games,
  recent_within_50_percent_disclosed_sales_share:r.within_50_percent_count/r.compared_games,
  recent_within_30_percent_disclosed_sales_share:r.within_30_percent_count/r.compared_games,
  review_matched_sample_count:m.sample_size,
  review_matched_within_50_percent_share:m.within_50_percent_count/m.sample_size,
  sales_review_calibration_game_count:c.disclosed_game_count,
  under_1000_disclosed_games:c.bins[0].games,
  low_sales_band_share_of_disclosures:c.bins[0].games/c.disclosed_game_count,
  low_band_typical_sales_per_review:c.bins[0].typical_sales_per_review,
  low_vs_next_band_ratio:c.bins[0].typical_sales_per_review/c.bins[1].typical_sales_per_review,
  panels_have_unreconciled_overlaps:true,
  zero_paid_sales_fraction:null,
  actual_publisher_median_net_income:null,
  representative_model_accuracy:null,
  unique_nonreviewed_games_observed:null,
  caveat:'Published operator scorecard with distinct samples selected on disclosed sales, not a representative population, zero-order study, bank payout, or independent model validation.'
 };
}
