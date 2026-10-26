// One explicit sponsorship contract, in one currency; cash movements are not profit.
const amountFields=[
 'agreed_gross_fee','invoiced_gross_fee','cash_received',
 'tax_withheld_at_source','agent_fee_deducted_before_receipt','other_deductions_before_receipt',
 'negotiation_cash_paid','production_cash_paid','fulfillment_cash_paid',
 'admin_cash_paid','tax_paid_directly'
];
const hourFields=['negotiation_hours','production_hours','fulfillment_hours','admin_hours'];
const toCents=(value,name)=>{
 if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw Error('Missing or invalid money: '+name);
 const cents=Math.round(value*100);
 if(!Number.isSafeInteger(cents)||Math.abs(value*100-cents)>1e-6)
  throw Error('Money requires two-decimal precision: '+name);
 return cents;
};
export function reconcileSponsorContract(record){
 if(!record||typeof record!=='object'||!/^[A-Z]{3}$/.test(record.currency||''))
  throw Error('Single explicit ISO reporting currency required');
 if(record.currency_conversions_applied===true)throw Error('Mixed-currency conversion outside worksheet scope');
 const v=Object.fromEntries(amountFields.map(k=>[k,toCents(record[k],k)]));
 const h=Object.fromEntries(hourFields.map(k=>{
  const n=record[k];
  if(typeof n!=='number'||!Number.isFinite(n)||n<0)throw Error('Missing or invalid labor hours: '+k);
  return [k,n];
 }));
 if(v.invoiced_gross_fee>v.agreed_gross_fee)
  throw Error('Invoice exceeds unamended contracted gross fee');
 const payerDeductions=v.tax_withheld_at_source+v.agent_fee_deducted_before_receipt+v.other_deductions_before_receipt;
 const accounted=v.cash_received+payerDeductions;
 if(!Number.isSafeInteger(accounted)||accounted>v.invoiced_gross_fee)
  throw Error('Received cash and source deductions exceed invoice');
 const outlays=v.negotiation_cash_paid+v.production_cash_paid+v.fulfillment_cash_paid+v.admin_cash_paid;
 const directOutlays=outlays+v.tax_paid_directly;
 const cashMovement=v.cash_received-directOutlays;
 if(![payerDeductions,outlays,directOutlays,cashMovement].every(Number.isSafeInteger))
  throw Error('Contract cash accounting overflow');
 const hours=Object.values(h).reduce((sum,n)=>sum+n,0);
 if(!Number.isFinite(hours))throw Error('Labor hours overflow');
 const usd=c=>c/100;
 return {
  currency:record.currency,kind:'single_contract_cash_reconciliation_not_profit',
  agreed_gross_fee:usd(v.agreed_gross_fee),
  invoiced_gross_fee:usd(v.invoiced_gross_fee),
  not_yet_invoiced_gross_fee:usd(v.agreed_gross_fee-v.invoiced_gross_fee),
  actual_cash_received:usd(v.cash_received),
  documented_source_deductions:usd(payerDeductions),
  source_tax_withheld_not_cash:usd(v.tax_withheld_at_source),
  outstanding_invoiced_balance:usd(v.invoiced_gross_fee-accounted),
  negotiation_cash_paid:usd(v.negotiation_cash_paid),
  production_cash_paid:usd(v.production_cash_paid),
  fulfillment_cash_paid:usd(v.fulfillment_cash_paid),
  admin_cash_paid:usd(v.admin_cash_paid),
  tax_paid_directly:usd(v.tax_paid_directly),
  paid_nontax_costs:usd(outlays),
  net_cash_movement:usd(cashMovement),
  recorded_work_hours:hours,
  cash_movement_per_work_hour:hours>0?usd(cashMovement)/hours:null,
  recognized_accounting_revenue:null,net_accounting_profit:null,
  ultimate_tax_liability:null,representative_youtube_sponsorship_income:null
 };
}
