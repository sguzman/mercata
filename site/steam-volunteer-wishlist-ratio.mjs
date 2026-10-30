// Audit a voluntary developer survey, not a representative Steam sales predictor.
const ratio=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const rSquared=x=>ratio(x)&&x<=1;
const rankCorrelation=x=>typeof x==='number'&&Number.isFinite(x)&&x>=-1&&x<=1;
const keys=(x,a)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>a.includes(k));
export function auditWishlistVolunteerEraStudy(r){
 if(!keys(r,['sample','unit_ratio_benchmarks_from_summary','in_sample_associations_primary']))
  throw new TypeError('Invalid volunteer wishlist study input');
 const s=r.sample,v=r.unit_ratio_benchmarks_from_summary,a=r.in_sample_associations_primary;
 if(!keys(s,['total_games','cohort_2020_2022','cohort_2023_2025',
  'game_level_raw_transactions_available_in_mercata','full_12month_followup_for_each_game_verified',
  'sample_nonresponse_probability_known'])||
 !keys(v,['earlier','later','unit','not_matched_wishlister_purchase_probability',
  'no_population_forecast_interval','values_transcribed_from_secondary_recapping_source',
  'original_source_numeric_values_in_charts'])||
 !keys(a,['target','fitting_method','era_2020_2022','era_2023_2025','pooled_eras',
  'out_of_sample_validation_observed','causal_attribution_of_era_gap']))
  throw new TypeError('Unexpected subframe fields');
 const ns=[s.total_games,s.cohort_2020_2022,s.cohort_2023_2025];
 if(ns.some(x=>!Number.isSafeInteger(x)||x<1)||
  s.cohort_2020_2022+s.cohort_2023_2025!==s.total_games)
  throw new RangeError('Voluntary sample sizes do not reconcile');
 for(const era of [v.earlier,v.later]){
  if(!keys(era,['month1','month6','month12'])||
   [era.month1,era.month6,era.month12].some(x=>!ratio(x))||
   era.month1>era.month6||era.month6>era.month12)
   throw new RangeError('Invalid cumulative units-per-wishlist ratios');
 }
 for(const era of [a.era_2020_2022,a.era_2023_2025]){
  if(!keys(era,['total_wishlists_r_squared','last_30day_adds_r_squared','spearman_total_wishlists'])||
    !rSquared(era.total_wishlists_r_squared)||
    !rSquared(era.last_30day_adds_r_squared)||
    !rankCorrelation(era.spearman_total_wishlists))
   throw new RangeError('Invalid era associations');
 }
 if(!keys(a.pooled_eras,['total_r_squared','adds_30day_r_squared',
  'adds_7day_r_squared','total_plus_adds30_r_squared'])||
  Object.values(a.pooled_eras).some(x=>!rSquared(x)))
  throw new RangeError('Invalid pooled association values');
 if(s.game_level_raw_transactions_available_in_mercata!==false||
  s.full_12month_followup_for_each_game_verified!==false||
  s.sample_nonresponse_probability_known!==false||
  v.unit!=='total_game_units_sold_divided_by_outstanding_launch_wishlists'||
  v.not_matched_wishlister_purchase_probability!==true||
  v.no_population_forecast_interval!==true||
  v.values_transcribed_from_secondary_recapping_source!==true||
  v.original_source_numeric_values_in_charts!==true||
  a.fitting_method!=='log_log_for_r_squared'||
  a.target!=='first_month_game_units'||
  a.out_of_sample_validation_observed!==false||
  a.causal_attribution_of_era_gap!==null)
  throw new RangeError('No representative frame, verified buyer joins or external forecast validation provided');
 return {
  total_developer_volunteer_games:s.total_games,
  earlier_cohort_games:s.cohort_2020_2022,
  later_cohort_games:s.cohort_2023_2025,
  month_one_units_per_launch_wishlist_median_ratio_later_to_earlier:v.later.month1/v.earlier.month1,
  last_30_day_wishlist_velocity_outperforms_total_in_later_era:
   a.era_2023_2025.last_30day_adds_r_squared>a.era_2023_2025.total_wishlists_r_squared,
  combined_pool_in_sample_r_squared_gain:a.pooled_eras.total_plus_adds30_r_squared-a.pooled_eras.total_r_squared,
  matched_wishlister_purchase_fraction:null,
  representative_2026_paid_release_prediction:null,
  verified_out_of_sample_forecast_advantage:null,
  actual_publisher_net_income:null,
  caveat:'Volunteer total paid-units-per-launch-wishlist rates are not probabilities of an individual wishlister purchasing; correlations are in-sample and publication data do not certify a population-wide change.'
 };
}
