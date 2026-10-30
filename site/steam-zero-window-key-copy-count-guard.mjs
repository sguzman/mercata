// Synthetic selected-game cash and zero-interval guard. No real AppIDs, accounts, player IDs or currency inputs.
const allowed=new Set(['fixture_id','cumulative_steam_copies','returned_steam_copies','separate_key_copies','zero_interval_orders','later_interval_orders','reported_players_including_tests']);
export function auditSyntheticZeroWindowCopies(row){
 if(!row||Array.isArray(row)||typeof row!=='object'||Object.keys(row).some(k=>!allowed.has(k))||
  typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
  !['cumulative_steam_copies','returned_steam_copies','separate_key_copies','zero_interval_orders','later_interval_orders','reported_players_including_tests'].every(k=>Number.isSafeInteger(row[k])&&row[k]>=0)||
  row.returned_steam_copies>row.cumulative_steam_copies||
  row.zero_interval_orders+row.later_interval_orders>row.cumulative_steam_copies)
 throw new TypeError('Expected bounded synthetic cumulative copies, keys and dated interval orders');
 return Object.freeze({
  reported_steam_copies:row.cumulative_steam_copies,
  conditional_retained_steam_copy_count:row.cumulative_steam_copies-row.returned_steam_copies,
  total_steam_plus_key_distributions:row.cumulative_steam_copies+row.separate_key_copies,
  observed_zero_order_interval:row.zero_interval_orders===0,
  reported_cumulative_positive_orders:row.cumulative_steam_copies>0,
  player_to_paid_customer_conversion:null,key_distributions_actually_paid:null,
  verified_merchant_paid_order_count:null,verified_bank_cash:null,
  legal_partner_after_cost_profit:null,market_zero_paid_sale_fraction:null
 });
}
