// Synthetic-only metric semantics. Never assert unique customers, profit or causal marketing impact.
export function summarizeTaggedVisits(input){
 if(!input||typeof input!=='object')throw new TypeError('Missing metrics');
 const keys=['total_visits','trusted_visits','tracked_visits','wishlist_events','purchase_events','activation_events'];
 for(const key of keys)if(!Number.isSafeInteger(input[key])||input[key]<0)throw new TypeError('Invalid count: '+key);
 if(input.trusted_visits>input.total_visits||input.tracked_visits>input.total_visits)throw new RangeError('Visit subsets cannot exceed total visits');
 const denom=input.tracked_visits;
 return {
  unit:'repeated_UTM_tagged_visits',total_visits:input.total_visits,trusted_visits:input.trusted_visits,tracked_visits:denom,
  wishlist_events:input.wishlist_events,purchase_events:input.purchase_events,activation_events:input.activation_events,
  attributed_purchase_events_per_tracked_visit:denom>0?input.purchase_events/denom:null,
  attributed_wishlist_events_per_tracked_visit:denom>0?input.wishlist_events/denom:null,
  attributed_activation_events_per_tracked_visit:denom>0?input.activation_events/denom:null,
  unique_customer_purchase_probability:null,verified_steam_checkout_orders:null,refund_adjusted_net_purchases:null,
  marketing_causal_sales_lift:null,net_profit:null,paid_ad_return_on_spend:null,
  explanation:'Ratios are descriptive reported event-count-per-repeat-visit denominators; conversion within 72h is association, not causal lift.'
 };
}
