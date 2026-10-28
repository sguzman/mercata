// Pure arithmetic for invented review counts; NOT Valve's live scoring or ranking algorithm.
const valid=n=>Number.isSafeInteger(n)&&n>=0;
export function scorePeriodExclusion({steamPositive,steamNegative,excludedPeriodPositive,excludedPeriodNegative}){
 const counts=[steamPositive,steamNegative,excludedPeriodPositive,excludedPeriodNegative];
 if(!counts.every(valid)||excludedPeriodPositive>steamPositive||excludedPeriodNegative>steamNegative)throw new TypeError('Invalid review subset counts');
 const original=steamPositive+steamNegative,post=original-excludedPeriodPositive-excludedPeriodNegative;
 const originalShare=original>0?steamPositive/original:null;
 const filteredPos=steamPositive-excludedPeriodPositive;
 const filteredShare=post>0?filteredPos/post:null;
 return {steam_origin_review_records:original,records_in_synthetic_excluded_period:excludedPeriodPositive+excludedPeriodNegative,
  remaining_eligible_review_records:post,raw_positive_fraction:originalShare,
  hypothetical_filtered_positive_fraction:filteredShare,
  filter_changes_score_denominator:post!==original,
  raw_40pct_boundary_reached:originalShare===null?null:originalShare>=0.4,
  hypothetical_filtered_40pct_boundary_reached:filteredShare===null?null:filteredShare>=0.4,
  valve_rating_category:null,observed_steam_visibility:null,actual_purchases:null,publisher_profit:null,
  caveat:'Assumed review counts and period classification, not Valve score or causal effect.'};
}
