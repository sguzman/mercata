// Strictly synthetic, same-USD-cents country cash waterfall. No live finance API, currency conversion or private records.
const n=(x,name)=>{if(!Number.isSafeInteger(x)||x<0)throw new TypeError(name+' must be a nonnegative safe integer');return x;};
export function auditSyntheticSteamCountryCash({reportingMonth,rows}={}){
 if(typeof reportingMonth!=='string'|| !/^\d{4}-(0[1-9]|1[0-2])$/.test(reportingMonth))throw new TypeError('Valid reportingMonth YYYY-MM required');
 if(!Array.isArray(rows)||rows.length>250)throw new TypeError('Finite country summary rows required');
 const seen=new Set();const totals={gross_cents:0,refunds_and_chargebacks_cents:0,tax_adjustments_cents:0,
  net_after_applicable_adjustments_cents:0,partner_contract_share_cents:0,withholding_cents:0,payable_before_bank_fees_cents:0};
 const countries=rows.map(row=>{
  if(!row||typeof row.storeCountry!=='string'|| !/^[A-Z]{2}$/.test(row.storeCountry)||seen.has(row.storeCountry))throw new TypeError('Unique two-letter store country code required');
  seen.add(row.storeCountry);
  if(row.reportingMonth!==reportingMonth)throw new RangeError('Mixed reporting months are not comparable');
  for(const k of ['grossCents','refundAndChargebackCents','taxAdjustmentCents','partnerShareBps','withholdingCents'])n(row[k],k);
  if(row.partnerShareBps>10000)throw new RangeError('Share basis points cannot exceed 10000');
  if(row.refundAndChargebackCents+row.taxAdjustmentCents>row.grossCents)throw new RangeError('Adjustments exceed same-country gross');
  const net=row.grossCents-row.refundAndChargebackCents-row.taxAdjustmentCents;
  const share=Math.round(net*row.partnerShareBps/10000);
  if(!Number.isSafeInteger(share)||row.withholdingCents>share)throw new RangeError('Withholding exceeds synthetic partner share or unsafe rounding');
  const payable=share-row.withholdingCents;
  const values={gross_cents:row.grossCents,refunds_and_chargebacks_cents:row.refundAndChargebackCents,tax_adjustments_cents:row.taxAdjustmentCents,
   net_after_applicable_adjustments_cents:net,partner_contract_share_cents:share,withholding_cents:row.withholdingCents,payable_before_bank_fees_cents:payable};
  for(const k of Object.keys(totals)){totals[k]+=values[k];if(!Number.isSafeInteger(totals[k]))throw new RangeError('Unsafe integer total');}
  return {store_country_code:row.storeCountry,...values};
 });
 return {kind:'hypothetical_same_currency_country_cash_bridge_not_actual_payment',reporting_month:reportingMonth,currency:'USD_cents_only',countries,totals,
  store_country_is_buyer_physical_location:false,real_bank_deposits_verified:false,real_country_sales_data:null,
  unique_paid_buyers:null,partner_after_labor_profit:null,geographic_purchase_market_share:null,
  caveat:'All rows are invented and share rate is an input, not the Steam contract. Local pricing, exchange, monthly country reports and actual withheld amounts require authorized partner data.'};
}
