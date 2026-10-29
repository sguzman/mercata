// Case-study arithmetic on approximate public self-reported counts, not audited Steam data.
// This intentionally does not infer profit, causal advertising return or true wishlist conversions.
const nonneg=(x,label)=>{if(!Number.isSafeInteger(x)||x<0)throw new TypeError(label+' must be a nonnegative safe integer');return x;};
export function auditFirstGameFunnelCase(r={}){
 const keys=['first_day_gross_copies','first_week_gross_copies','first_month_gross_copies','first_day_gross_usd','first_week_gross_usd','first_month_gross_usd','later_copies_excluding_returns','later_returned_copies','reddit_ad_spend_usd_approx','reddit_ad_clicks_approx','reddit_ad_attributed_wishlists_approx'];
 for(const key of keys)nonneg(r[key],key);
 if(r.first_day_gross_copies>r.first_week_gross_copies||r.first_week_gross_copies>r.first_month_gross_copies)throw new RangeError('Reported cumulative copy windows out of order');
 if(r.first_day_gross_usd>r.first_week_gross_usd||r.first_week_gross_usd>r.first_month_gross_usd)throw new RangeError('Reported cumulative gross USD windows out of order');
 const total=r.later_copies_excluding_returns+r.later_returned_copies;
 if(!Number.isSafeInteger(total))throw new RangeError('Unsafe sum of copies and returns');
 return {
  day_copy_share_of_first_week:r.first_week_gross_copies? r.first_day_gross_copies/r.first_week_gross_copies:null,
  week_copy_share_of_first_month:r.first_month_gross_copies? r.first_week_gross_copies/r.first_month_gross_copies:null,
  week_gross_share_of_first_month:r.first_month_gross_usd? r.first_week_gross_usd/r.first_month_gross_usd:null,
  stated_later_total_units_assuming_disjoint_retained_and_returned:total,
  reported_returned_share_conditional_on_disjoint_unit_interpretation:total?r.later_returned_copies/total:null,
  spend_per_reported_reddit_wishlist_usd:r.reddit_ad_attributed_wishlists_approx?r.reddit_ad_spend_usd_approx/r.reddit_ad_attributed_wishlists_approx:null,
  reported_reddit_click_to_wishlist_fraction:r.reddit_ad_clicks_approx?r.reddit_ad_attributed_wishlists_approx/r.reddit_ad_clicks_approx:null,
  matched_wishlist_conversion_rate:null,
  actual_incremental_paid_orders_from_ads:null,
  actual_net_cash_from_first_month:null,
  publisher_after_cost_profit:null,
  limitation:'Counts are author-reported approximate observations with unknown reporting joins; marketing associations and broad launch shares do not establish causality, payout or publisher income.'
 };
}
