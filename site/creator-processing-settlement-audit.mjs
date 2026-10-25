export function inspectCreatorSettlement(model,req){
 if(!req||typeof req!=='object')return {valid:false,reason:'missing_settlement_event'};
 const item=model.channels.find(x=>x.id===req.channel);
 if(!item)return {valid:false,reason:'unregistered_payment_contract'};
 if(!['eligible_net','transaction_pending','transaction_locked','bank_received'].includes(req.stage))
  return {valid:false,reason:'unsupported_stage'};
 if(req.applyCommerceSeventyPercent && item.contract_module!=='Commerce Product Module')
  return {valid:false,reason:'commerce_share_does_not_apply_to_shopping'};
 if(req.deductSecondCardProcessorFee && item.credit_card_processor_cost_payer==='youtube')
  return {valid:false,reason:'card_transaction_cost_already_paid_by_youtube'};
 if(item.contract_module==='merchant_center_affiliate_shopify'&&req.stage==='transaction_pending'){
  return {valid:true,source_frame:item.contract_module,is_creator_bank_receipt:false,can_reverse:true,
    creator_cash_received:null,actual_processing_fee:null};
 }
 if(req.stage==='bank_received'){
  return {valid:true,source_frame:item.contract_module,is_creator_bank_receipt:true,can_reverse:null,
    creator_cash_received:null,actual_processing_fee:null,requires_actual_bank_record:true};
 }
 return {valid:true,source_frame:item.contract_module,is_creator_bank_receipt:false,can_reverse:req.stage==='transaction_pending',
  creator_cash_received:null,actual_processing_fee:null};
}
export function validateAffiliatePendingDays(model,days){
 return Number.isInteger(days)&&days>=model.affiliate_shopify.min_pending_days&&days<=model.affiliate_shopify.max_pending_days;
}
export function inferActualCreatorNetFromMerchantReport(model,metric){
 return {allowed:false,reason:'pending_or_approved_merchant_metrics_not_bank_cash_or_after_cost_income',
  actual_creator_net_income:null,actual_creator_profit:null};
}
