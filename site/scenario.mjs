// Pure scenario arithmetic for explicitly entered numbers; no default earning assumptions.
// The computed result is not an empirical income estimate.
export function evaluateIncomeScenario(value) {
  if(!value || !/^[A-Z]{3}$/.test(value.currency||''))throw Error('Provide an ISO 4217 currency code.');
  const fields=['watch_views','watch_ad_only_rpm','shorts_engaged_views','shorts_ad_only_rpm','net_other_receipts','cash_costs','labor_hours'];
  for(const name of fields){
    if(value[name]===undefined || value[name]===null || value[name]==='')throw Error('Missing input: '+name);
    if(!Number.isFinite(value[name]) || value[name]<0)throw Error('Invalid nonnegative input: '+name);
  }
  for(const count of ['watch_views','shorts_engaged_views']){
    if(!Number.isSafeInteger(value[count]))throw Error('Views must be whole, safely representable numbers: '+count);
  }
  if(value.labor_hours<=0)throw Error('Total labor hours must be greater than zero.');
  const watch_ad_receipts=value.watch_views*value.watch_ad_only_rpm/1000;
  const shorts_ad_receipts=value.shorts_engaged_views*value.shorts_ad_only_rpm/1000;
  const net_receipts=watch_ad_receipts+shorts_ad_receipts+value.net_other_receipts;
  const cash_profit_before_tax=net_receipts-value.cash_costs;
  const cash_profit_per_hour=cash_profit_before_tax/value.labor_hours;
  if(![watch_ad_receipts,shorts_ad_receipts,net_receipts,cash_profit_before_tax,cash_profit_per_hour].every(Number.isFinite))
    throw Error('Scenario arithmetic overflow.');
  return {currency:value.currency,watch_ad_receipts,shorts_ad_receipts,net_receipts,cash_profit_before_tax,cash_profit_per_hour,kind:'hypothetical_user_inputs',actual_earnings:null};
}
