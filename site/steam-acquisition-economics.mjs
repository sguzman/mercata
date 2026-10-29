// Synthetic scenario arithmetic only. No marketing accounts, merchant statements or user events loaded.
// Cents are safe nonnegative integers. Results never assert a publisher's real profit or causal ad return.
const nonnegative=(n,k)=>{if(!Number.isSafeInteger(n)||n<0)throw new TypeError(k+' must be a nonnegative safe integer');return n;};
const safe=(n)=>{if(!Number.isSafeInteger(n))throw new RangeError('Integer-cent arithmetic overflow');return n;};
export function evaluateHypotheticalAcquisition({
 assumed_incremental_paid_orders, assumed_net_partner_receipt_per_order_cents,
 variable_support_per_order_cents, other_variable_cost_per_order_cents,
 ad_spend_cents, fixed_creative_cost_cents, required_profit_reserve_cents
}={}){
 const values={assumed_incremental_paid_orders,assumed_net_partner_receipt_per_order_cents,variable_support_per_order_cents,other_variable_cost_per_order_cents,ad_spend_cents,fixed_creative_cost_cents,required_profit_reserve_cents};
 for(const [name,value] of Object.entries(values))nonnegative(value,name);
 const margin=safe(assumed_net_partner_receipt_per_order_cents-variable_support_per_order_cents-other_variable_cost_per_order_cents);
 const contribution=safe(assumed_incremental_paid_orders*margin);
 const spend=safe(ad_spend_cents+fixed_creative_cost_cents);
 const postCampaign=safe(contribution-spend);
 const headroom=safe(contribution-fixed_creative_cost_cents-required_profit_reserve_cents);
 const required=safe(spend+required_profit_reserve_cents);
 const requiredOrders=margin>0?Math.ceil(required/margin):(required===0?0:null);
 return {
  kind:'hypothetical_scenario_not_observed_steam_economics',
  assumed_incremental_paid_orders,unit_contribution_cents:margin,
  total_incremental_contribution_cents:contribution,total_campaign_cost_cents:spend,
  simulated_after_campaign_contribution_cents:postCampaign,
  max_ad_spend_cents_under_profit_reserve:headroom>=0?headroom:0,
  campaign_meets_assumed_profit_reserve:postCampaign>=required_profit_reserve_cents,
  minimum_incremental_orders_required:requiredOrders,
  positive_margin_required_for_viable_paid_acquisition:margin>0,
  observed_incremental_orders:null,observed_paid_orders:null,observed_partner_profit:null,
  observed_customer_acquisition_cost:null,causal_return_on_ad_spend:null
 };
}
export function describeUtmSpendPerAttributedEvent({spend_cents,utm_attributed_purchase_events}={}){
 nonnegative(spend_cents,'spend_cents');
 nonnegative(utm_attributed_purchase_events,'utm_attributed_purchase_events');
 return {
  kind:'descriptive_utm_attribution_not_incremental_cac',
  spend_per_attributed_event_cents:utm_attributed_purchase_events===0?null:spend_cents/utm_attributed_purchase_events,
  true_cost_per_incremental_paid_customer_cents:null,
  verified_unique_paid_buyers:null,actual_refund_adjusted_net_orders:null,causal_return_on_ad_spend:null
 };
}
