// Strictly hypothetical Steam publisher remittance arithmetic. Never a real bank statement.
export function hypotheticalSteamRemittance(x){
 if(!x||typeof x!=='object')throw new TypeError('Scenario is required');
 for(const key of ['gross_usd','sales_tax_usd','returns_usd','chargebacks_usd','bank_fee_usd']){
  if(typeof x[key]!=='number'||!Number.isFinite(x[key])||x[key]<0)throw new TypeError('Invalid amount: '+key);
 }
 for(const key of ['assumed_partner_share','assumed_withholding_rate']){
  if(typeof x[key]!=='number'||!Number.isFinite(x[key])||x[key]<0||x[key]>1)throw new TypeError('Invalid rate: '+key);
 }
 const adjusted=x.gross_usd-x.sales_tax_usd-x.returns_usd-x.chargebacks_usd;
 if(adjusted<0)throw new RangeError('Adjustments cannot exceed gross');
 const share=adjusted*x.assumed_partner_share;
 const withheld=share*x.assumed_withholding_rate;
 const afterBank=share-withheld-x.bank_fee_usd;
 if(afterBank<0)throw new RangeError('Bank fees exceed the hypothetical remittance');
 return {kind:'synthetic_only',adjusted_net_usd:adjusted,assumed_partner_revenue_share_usd:share,assumed_withholding_usd:withheld,hypothetical_usd_after_bank_fees:afterBank,additional_card_processing_fee_usd:null,actual_fx_rate:null,actual_bank_deposit_usd:null,developer_profit_usd:null};
}
