// Public third-party review-based model audit. Snapshot values are not Steam financial data.
const natural=value=>Number.isSafeInteger(value)&&value>=0;
const fields=['reported_released_game_listings','priced_with_at_least_one_review',
 'paid_with_zero_reviews','free_games','missing_published_price',
 'expensive_listings_excluded_by_report','expensive_exclusion_disjointness_attested',
 'originally_paid_release_cohort_verified','delisted_status_and_release_age_reconciled',
 'excludes_non_game_software','excludes_adult_only','excludes_unreleased'];
export function auditSteamReviewRevenueCoverage(catalog){
 if(!catalog||typeof catalog!=='object'||Array.isArray(catalog)||
    Object.keys(catalog).some(key=>!fields.includes(key)))
  throw new TypeError('Only the public review-estimator catalogue fields are permitted');
 const quantities=fields.slice(0,6);
 if(quantities.some(key=>!natural(catalog[key])))throw new TypeError('Nonnegative safe catalogue counts required');
 const total=catalog.reported_released_game_listings;
 const measured=catalog.priced_with_at_least_one_review;
 const unreviewed=catalog.paid_with_zero_reviews;
 const free=catalog.free_games;
 const noPrice=catalog.missing_published_price;
 const sum=measured+unreviewed+free+noPrice;
 if(!Number.isSafeInteger(sum)||sum!==total||total===0)
  throw new RangeError('Reported public catalogue classes do not reconcile');
 if(catalog.expensive_exclusion_disjointness_attested!==false||
    catalog.originally_paid_release_cohort_verified!==false||
    catalog.delisted_status_and_release_age_reconciled!==false||
    catalog.excludes_non_game_software!==true||catalog.excludes_adult_only!==true||
    catalog.excludes_unreleased!==true)
  throw new RangeError('Unsupported complete-release or expensive-exclusion assertion');
 return {
  report_catalog_count:total,
  model_measured_priced_reviewed_games:measured,
  priced_reviewless_paid_games:unreviewed,
  known_priced_games_in_report:measured+unreviewed,
  priced_reviewless_share_in_known_priced:(measured+unreviewed)?unreviewed/(measured+unreviewed):null,
  modeled_games_share_of_report:measured/total,
  missing_price_or_free_games:free+noPrice,
  expensive_exclusion_overlap_unresolved:true,
  zero_review_games_may_have_paid_sales:true,
  actual_zero_paid_sale_count:null,
  original_paid_release_frame_complete:false,
  actual_publisher_takehome_median:null,
  report_headline_median_population_verified:false,
  limitation:'A public live review-model snapshot is not a Steam checkout ledger or a complete originally paid release frame.'
 };
}
