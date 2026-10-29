// Auditing publicly described single-game week-one economics; no real merchant records.
const nonneg=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticLaunchWeek({grossUsdCents,reportedUnits,reportedReturnedUnits,reportedReviews,launchWishlistLowerBound,weekWishlistStock,claimedWishlistConversionPct,estimatedFutureBankUsdCents,developmentMonths}={}){
 for(const [k,v] of Object.entries({grossUsdCents,reportedUnits,reportedReturnedUnits,reportedReviews,launchWishlistLowerBound,weekWishlistStock,estimatedFutureBankUsdCents}))
  if(!nonneg(v))throw new TypeError(k+' requires safe nonnegative integer');
 if(!Number.isFinite(developmentMonths)||developmentMonths<=0)throw new TypeError('Development period must be positive');
 if(typeof claimedWishlistConversionPct!=='number'||!Number.isFinite(claimedWishlistConversionPct)||claimedWishlistConversionPct<0||claimedWishlistConversionPct>100)throw new TypeError('Invalid author-reported conversion percent');
 if(reportedUnits===0&&reportedReturnedUnits>0)throw new RangeError('Refund count requires some recorded units');
 if(reportedReturnedUnits>reportedUnits)throw new RangeError('Returns exceed reported unit count under same-unit assumption');
 if(weekWishlistStock<launchWishlistLowerBound)throw new RangeError('Week wishlist stock below launch lower bound');
 const approxGrossPerReportedUnit=reportedUnits?grossUsdCents/100/reportedUnits:null;
 const returnFractionConditional=reportedUnits?reportedReturnedUnits/reportedUnits:null;
 const estimatedShare= grossUsdCents?estimatedFutureBankUsdCents/grossUsdCents:null;
 return {kind:'individual_public_self_report_arithmetic_not_payout_authentication',
  gross_usd_reported:grossUsdCents/100,units_reported:reportedUnits,returned_units_reported:reportedReturnedUnits,
  approximate_gross_per_reported_unit_usd:approxGrossPerReportedUnit,
  conditional_returns_over_reported_units:returnFractionConditional,
  reported_reviews:reportedReviews,launch_wishlist_lower_bound:launchWishlistLowerBound,
  later_wishlist_stock:weekWishlistStock,author_claimed_conversion_rate_pct:claimedWishlistConversionPct,
  estimated_future_bank_usd:estimatedFutureBankUsdCents/100,
  projected_bank_share_of_reported_gross_conditional:estimatedShare,
  months_of_work_reported:developmentMonths,
  observed_bank_deposit_usd:null,authenticated_merchant_paid_units:null,
  comparable_actual_launch_wishlist_conversion:null,
  review_based_paid_unit_estimator_validated:false,
  actual_after_cost_profit_usd:null,creator_hourly_wage_usd:null,
  population_median_gross_or_net:null,
  caveat:'Sales, returns and wishlist populations are author-reported and may use different units. Projected future bank receipts are not a verified payout; 7-day gross is not profit.'};
}
export function compareReportedLaunchWeeks(cases){
 if(!Array.isArray(cases)||cases.length<2)throw new TypeError('Two or more public case summaries required');
 const ids=new Set();
 return {case_count:cases.length,cases:cases.map(c=>{
   if(!c||typeof c.source_id!=='string'||!/^[a-z0-9-]+$/.test(c.source_id)||ids.has(c.source_id)||!nonneg(c.first_week_gross_cents)||!nonneg(c.first_week_paid_units)||c.first_week_paid_units===0)
    throw new TypeError('Unique source and safe positive first-week units required');
   ids.add(c.source_id);
   if(!['author_steamworks_summary','author_prose_self_report'].includes(c.evidence_class))throw new TypeError('Provenance class required');
   return {source_id:c.source_id,first_week_gross_usd:c.first_week_gross_cents/100,first_week_units:c.first_week_paid_units,evidence_class:c.evidence_class};
  }),representative_first_week_median:null,first_game_vs_second_game_effect:null,
  source_population_complete:false,statistical_comparability_established:false,
  caveat:'Volunteer case reports cannot be pooled into a first-week population median, nor can launch-week gross be compared to estimated after-tax bank receipts.'};
}
