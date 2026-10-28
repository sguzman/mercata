// Historical cohort and merchant-income guardrails only; no inferred transaction data.
export function validateSteamAnnualThresholds(x){
 if(!x||typeof x!=='object')throw new TypeError('Annual threshold record required');
 for(const key of ['over100k','over500k','dailyDealBuyers']){
  if(!Number.isSafeInteger(x[key])||x[key]<0)throw new TypeError('Invalid '+key);
 }
 if(x.over500k>x.over100k)throw new RangeError('Revenue thresholds out of order');
 return {annual_all_age_games_over100k:x.over100k,annual_all_age_games_over500k:x.over500k,
 daily_deal_buyers:x.dailyDealBuyers,first_paid_release_success_rate:null,total_steam_annual_buyers:null,
 median_publisher_net_income:null,actual_developer_profit:null};
}
export function describeAggregateSteamRevenueShare(value){
 if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>1)throw new TypeError('Invalid share');
 return {all_nonvalve_aggregate_revenue_share:value,typical_indie_contract_share:null,actual_after_tax_payee_receipts:null,actual_developer_profit:null};
}
