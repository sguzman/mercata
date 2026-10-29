// Audit one public developer channel report; do not infer controlled causal sales or unique audiences.
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const keys=['time_basis','launch_wishlists_approx','first_month_units_reported','first_month_gross_usd_reported',
 'refund_rate_reported_percent_approx','median_playtime_minutes_reported','reviews_reported',
 'festival_impressions_approx','festival_store_visits_approx','contacted_video_creators','creator_keys_activated',
 'creator_videos','combined_creator_views_approx','active_bundle_count_at_post_approx',
 'author_bundle_sales_share_percent_approx','bundle_share_same_first_month_window_verified',
 'verified_unique_impression_reach','independently_verified_partner_sales','observed_incremental_campaign_orders'];
export function auditSyntheticSteamDeveloperChannelReport(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Only author-published aggregate reporting fields permitted');
 if(x.time_basis!=='first_month_units_and_gross')throw new TypeError('First month sales observation window required');
 for(const k of keys.slice(1,4).concat(keys.slice(5,14)))
  if(!nat(x[k]))throw new TypeError('Nonnegative integer channel aggregate required: '+k);
 for(const k of ['refund_rate_reported_percent_approx','author_bundle_sales_share_percent_approx'])
  if(typeof x[k]!=='number'||!Number.isFinite(x[k])||x[k]<0||x[k]>100)
   throw new TypeError('Finite percentage from public source required: '+k);
 if(x.festival_store_visits_approx>x.festival_impressions_approx||
    x.creator_keys_activated>x.contacted_video_creators||x.creator_videos>x.contacted_video_creators)
  throw new RangeError('Contradictory author channel aggregates');
 for(const k of keys.slice(15))
  if(x[k]!==false)throw new TypeError('No same-month bundle, unique reach, authenticated ledger or causal order proof');
 return {kind:'one_developer_marketing_channel_report_not_paid_conversion_attribution',
  first_month_units_reported:x.first_month_units_reported,first_month_gross_usd_reported:x.first_month_gross_usd_reported,
  festival_impressions_approx:x.festival_impressions_approx,festival_visits_approx:x.festival_store_visits_approx,
  event_visit_to_impression_arithmetic_ratio:x.festival_store_visits_approx/x.festival_impressions_approx,
  author_contacted_creators:x.contacted_video_creators,author_activated_review_keys:x.creator_keys_activated,
  author_published_creator_videos:x.creator_videos,author_reported_bundle_percent:x.author_bundle_sales_share_percent_approx,
  creator_keys_are_paid_game_orders:false,creator_video_views_are_unique_customers:false,
  bundle_snapshot_is_first_month_conversion:false,festival_visits_are_incremental_buyers:false,
  matched_wishlist_purchase_rate:null,exact_bundle_orders_first_month:null,
  causal_creator_paid_orders:null,verified_festival_purchase_rate:null,
  actual_bank_receipt_usd:null,developer_after_cost_profit:null,platform_representative_roi:null,
  note:'Different stages and time bases. Exposure ratio is descriptive only; no unique views, stable bundle denominator, purchase join or counterfactual.';
}
