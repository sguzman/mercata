// Synthetic Steam gift-state arithmetic only; never a Steam partner checkout report.
const STATES=new Set(['direct_paid_retained','direct_paid_refunded','gift_paid_pending','gift_paid_accepted','gift_paid_declined_refunded','gift_paid_expired_refunded','gift_paid_redeemed_refunded','external_key_activated','free_license_activated','wallet_gift_card_funded']);
const PURCHASE=new Set(['direct_paid_retained','direct_paid_refunded','gift_paid_pending','gift_paid_accepted','gift_paid_declined_refunded','gift_paid_expired_refunded','gift_paid_redeemed_refunded']);
const REFUNDED=new Set(['direct_paid_refunded','gift_paid_declined_refunded','gift_paid_expired_refunded','gift_paid_redeemed_refunded']);
export function auditSyntheticSteamGiftEvents(rows){
 if(!Array.isArray(rows))throw new TypeError('Expected synthetic gift events');
 const seen=new Set(),counts=Object.fromEntries([...STATES].map(x=>[x,0]));
 for(const row of rows){
  if(!row||typeof row!=='object'||typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))throw new TypeError('Only synthetic fixture IDs allowed');
  if(seen.has(row.fixture_id))throw new RangeError('Duplicate synthetic purchase or activation fixture');
  seen.add(row.fixture_id);
  if(typeof row.latest_state!=='string'||!STATES.has(row.latest_state))throw new TypeError('Unsupported gift lifecycle state');
  counts[row.latest_state]++;
 }
 const total=(group)=>[...group].reduce((n,s)=>n+counts[s],0);
 const checkout=total(PURCHASE),refunded=total(REFUNDED);
 return {kind:'hypothetical_distinct_game_checkout_and_activation_event_count_not_actual_steam_revenue',
  synthetic_distinct_event_records:rows.length,latest_state_counts:counts,
  historical_paid_game_checkout_events_in_fixture:checkout,
  currently_reported_refunded_game_checkout_events:refunded,
  not_yet_refunded_game_checkout_events:checkout-refunded,
  pending_gift_checkout_events:counts.gift_paid_pending,
  accepted_unreversed_gift_license_events:counts.gift_paid_accepted,
  accepted_reversed_gift_events:counts.gift_paid_redeemed_refunded,
  direct_retained_license_events:counts.direct_paid_retained,
  external_key_activations_not_store_checkouts:counts.external_key_activated,
  free_licenses_not_store_checkouts:counts.free_license_activated,
  wallet_funding_not_game_checkouts:counts.wallet_gift_card_funded,
  gift_acceptance_creates_another_paid_order:false,
  pending_implies_final_net_retained_sale:false,
  unique_real_customers:null,actual_game_units_sold:null,actual_gift_refund_rate:null,
  actual_merchant_revenue_usd:null,actual_developer_profit_usd:null,
  limitation:'Events are invented distinct synthetic fixtures; do not infer final remittances, distinct people, package allocations, or observed Steam sales.'};
}
