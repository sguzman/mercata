// Cohort and review-history arithmetic only. Never infer sales, income, or causal update uplift.
const safeNonnegative=x=>Number.isSafeInteger(x)&&x>=0;
export function auditSyntheticQuietLaunchCohort(x){
 const allowed=["fixture_id","current_paid_indie_listings","under10_reviews","reviews10to99",
  "quiet_later_bigger_year","first_bigger_y2","first_bigger_y3","first_bigger_y4to6",
  "at_risk_y2","at_risk_y3","still_listed_2026","includes_historically_delisted"];
 if(!x||typeof x!=="object"||Array.isArray(x)||
  Object.keys(x).some(k=>!allowed.includes(k))||
  typeof x.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError("Only synthetic cohort counts and declared scope flags accepted");
 for(const key of allowed.filter(k=>!["fixture_id","still_listed_2026","includes_historically_delisted"].includes(k)))
  if(!safeNonnegative(x[key]))throw new TypeError("Invalid synthetic count "+key);
 if(x.still_listed_2026!==true||x.includes_historically_delisted!==false)
  throw new TypeError("Survivor-only sampling scope required");
 const n=x.current_paid_indie_listings,quiet=x.reviews10to99,
  remaining=n-x.under10_reviews-quiet;
 if(remaining<0||quiet>n)throw new RangeError("Review groups exceed catalog");
 if(x.quiet_later_bigger_year>quiet||
  x.first_bigger_y2+x.first_bigger_y3+x.first_bigger_y4to6!==x.quiet_later_bigger_year)
  throw new RangeError("First larger-review-year counts do not partition");
 if(x.at_risk_y2!==quiet||
  x.at_risk_y3!==quiet-x.first_bigger_y2||
  x.first_bigger_y2>x.at_risk_y2||x.first_bigger_y3>x.at_risk_y3)
  throw new RangeError("At-risk denominators inconsistent with first improvements");
 return {original_paid_release_frame_complete:false,current_survivor_sample_count:n,
  quiet_review_group_count:quiet,remaining_highreview_listings:remaining,
  fraction_ever_more_annual_reviews_in_survivors:quiet?x.quiet_later_bigger_year/quiet:null,
  first_bigger_year2_hazard:quiet?x.first_bigger_y2/x.at_risk_y2:null,
  first_bigger_year3_hazard:x.at_risk_y3?x.first_bigger_y3/x.at_risk_y3:null,
  combined_year4_to6_first_improvements:x.first_bigger_y4to6,
  verified_paid_units:null,actual_earnings_median:null,
  zero_paid_sale_fraction:null,causal_update_effect:null,
  representative_original_paid_release_recovery_rate:null};
}
