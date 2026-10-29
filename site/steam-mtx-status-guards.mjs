// Pure synthetic-only latest-state accounting; not a live Steam API client.
// No buyer IDs, real transaction references, payout or sensitive data.
const ALL=['Init','Approved','Succeeded','Failed','Refunded','PartialRefund','Chargedback','RefundedSuspectedFraud','RefundedFriendlyFraud'];
const REVERSED=new Set(['Refunded','PartialRefund','Chargedback','RefundedSuspectedFraud','RefundedFriendlyFraud']);
export function summarizeSyntheticMtxLatestStatuses(rows){
 if(!Array.isArray(rows))throw new TypeError('Expected synthetic status rows');
 const seen=new Set(),counts=Object.fromEntries(ALL.map(s=>[s,0]));
 for(const row of rows){
  if(!row||typeof row!=='object'||typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))throw new TypeError('Only synthetic fixture IDs permitted');
  if(seen.has(row.fixture_id))throw new RangeError('Duplicate fixture status ID');
  seen.add(row.fixture_id);
  if(!Object.hasOwn(counts,row.latest_status))throw new TypeError('Unknown in-game transaction status');
  counts[row.latest_status]++;
 }
 const reversed=ALL.filter(s=>REVERSED.has(s)).reduce((total,s)=>total+counts[s],0);
 return {scope:'synthetic_in_game_order_latest_state_only',statuses:counts,
  total_status_records:rows.length,currently_succeeded:counts.Succeeded,
  approved_but_not_final:counts.Approved,initiated_not_approved:counts.Init,
  current_reversed_or_partial:reversed,
  partial_refunds_requiring_item_status:counts.PartialRefund,
  failed_orders:counts.Failed,
  merchant_net_revenue_usd:null,real_steam_base_game_orders:null,
  actual_chargeback_rate:null,partner_bank_payment_held:null,customer_identity_data_available:false,
  explanation:'Latest in-game status rows are not unique paid base-game orders, actual revenue or publisher bank settlement.'
 };
}
