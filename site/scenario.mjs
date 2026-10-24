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

/**
 * Per-attempted-order merchant break-even arithmetic. Every input is owner-provided.
 * Assumes the payment fee is charged on a gross attempted order and not refunded.
 * Returns no actual outcomes or platform estimates.
 */
export function evaluateBreakEvenScenario(value) {
  if (!value || !/^[A-Z]{3}$/.test(value.currency||'')) throw Error('A currency code is required.');
  const keys=['gross_order_price','refund_probability','processor_rate','processor_fixed_fee','refund_extra_cost','variable_nonpayment_cost','fixed_cash_cost','creator_hours','target_hourly_compensation'];
  for(const key of keys){
    if(!Number.isFinite(value[key])||value[key]<0)throw Error('Provide nonnegative '+key);
  }
  if(value.refund_probability>1||value.processor_rate>1)throw Error('Rates must be fractions from zero to one');
  const expected_collected=value.gross_order_price*(1-value.refund_probability);
  const payment_fees=value.gross_order_price*value.processor_rate+value.processor_fixed_fee;
  const expected_refund_cost=value.refund_probability*value.refund_extra_cost;
  const contribution=expected_collected-payment_fees-expected_refund_cost-value.variable_nonpayment_cost;
  const cash_target=value.fixed_cash_cost;
  const labor_target=value.creator_hours*value.target_hourly_compensation;
  const total_target=cash_target+labor_target;
  if(![expected_collected,payment_fees,expected_refund_cost,contribution,labor_target,total_target].every(Number.isFinite))
    throw Error('Scenario arithmetic overflow');
  const needed=target=>{
    if(target===0)return 0;
    if(contribution<=0)return null;
    const raw=Math.ceil(target/contribution);
    return Number.isSafeInteger(raw)?raw:null;
  };
  return {currency:value.currency,kind:'hypothetical_order_unit_economics',
    expected_collected,expected_payment_fees:payment_fees,expected_extra_refund_cost:expected_refund_cost,
    contribution_per_attempted_order:contribution,
    cash_break_even_orders:needed(cash_target),labor_compensated_break_even_orders:needed(total_target),
    tax_liability_estimate:null,actual_creator_earnings:null,conversion_probability:null};
}
