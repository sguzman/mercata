// Explicitly hypothetical cash and economic break-even sensitivity model.
// This is NOT Valve reporting, a contract, or a projection of publisher income.
const RATE=10000;
const assertMoney=(v,k)=>{if(!Number.isSafeInteger(v)||v<0)throw new TypeError(k+' must be nonnegative integer cents')};
const assertRate=(v,k)=>{if(!Number.isInteger(v)||v<0||v>RATE)throw new TypeError(k+' must be basis points 0–10000')};
export function evaluateHypotheticalSteamGame(a){
 if(!a||typeof a!=='object'||Array.isArray(a))throw new TypeError('Scenario object required');
 for(const key of ['checkoutPriceCents','fixedCashCents','steamDirectFeeCents','otherCashCents','laborRateCents'])assertMoney(a[key],key);
 for(const key of ['refundRateBps','salesTaxShareBps','platformShareBps','publisherRecoupShareBps'])assertRate(a[key],key);
 if(!Number.isSafeInteger(a.grossPaidOrders)||a.grossPaidOrders<0)throw new TypeError('grossPaidOrders must be a nonnegative integer');
 if(!Number.isSafeInteger(a.laborHours)||a.laborHours<0)throw new TypeError('laborHours must be a nonnegative integer');
 const cashFixedCents=a.fixedCashCents+a.steamDirectFeeCents+a.otherCashCents;
 const imputedLaborCents=a.laborHours*a.laborRateCents;
 if(!Number.isSafeInteger(cashFixedCents)||!Number.isSafeInteger(imputedLaborCents)||!Number.isSafeInteger(cashFixedCents+imputedLaborCents))throw new RangeError('Unsafe aggregate cents');
 const expectedRetainedPerPaidOrderCents=a.checkoutPriceCents*
  (1-a.refundRateBps/RATE)*(1-a.salesTaxShareBps/RATE)*
  (1-a.platformShareBps/RATE)*(1-a.publisherRecoupShareBps/RATE);
 const payout=expectedRetainedPerPaidOrderCents*a.grossPaidOrders;
 if(!Number.isFinite(payout)||!Number.isSafeInteger(Math.round(payout)))throw new RangeError('Unsafe payout');
 const cashBreakEven=expectedRetainedPerPaidOrderCents>0?Math.ceil((cashFixedCents-1e-8)/expectedRetainedPerPaidOrderCents):null;
 const economicBreakEven=expectedRetainedPerPaidOrderCents>0?Math.ceil((cashFixedCents+imputedLaborCents-1e-8)/expectedRetainedPerPaidOrderCents):null;
 return Object.freeze({
  declared_scenario:'hypothetical_assumption_only',
  gross_paid_order_count_assumed:a.grossPaidOrders,
  expected_developer_proceeds_before_fixed_costs_cents:Math.round(payout),
  fixed_cash_cents:cashFixedCents,
  imputed_labor_cents:imputedLaborCents,
  modeled_cash_surplus_cents:Math.round(payout)-cashFixedCents,
  modeled_economic_surplus_cents:Math.round(payout)-cashFixedCents-imputedLaborCents,
  break_even_gross_paid_orders_cash:cashBreakEven,
  break_even_gross_paid_orders_including_labor:economicBreakEven,
  actual_merchant_sales:null,actual_bank_payout:null,actual_income_tax:null,
  actual_developer_profit:null,population_success_probability:null,
  caveats:['Expected refunds are an assumption; not observed return orders','Tax and platform/publisher rates are assumptions, not signed contracts','No merchant FX/bank/withholding/variable nonmodeled cost included','Labor is imputed opportunity cost, not a verified paid expense']
 });
}
