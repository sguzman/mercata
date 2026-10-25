// Source-only live monetization arithmetic; never guesses viewer spend or eligibility.
export function evaluateLiveCommerceNet(model,params){
 if(!params||params.kind!=='eligible_net_commerce')throw Error('Require explicit eligible Commerce *net* receipts');
 const amount=params.amount;
 if(!Number.isFinite(amount)||amount<0||!Number.isSafeInteger(Math.round(amount*100))||
   Math.abs(amount*100-Math.round(amount*100))>1e-6)throw Error('Valid two-decimal net amount required');
 if(!/^[A-Z]{3}$/.test(params.currency||''))throw Error('Report currency explicitly');
 const item=model.commerce_products.find(x=>x.id===params.product);
 if(!item)throw Error('Unknown Commerce product');
 const share=Math.round(Math.round(amount*100)*item.creator_share)/100;
 return {product:item.id,currency:params.currency,illustrative_creator_share:share,
   applied_to:item.share_denominator,kind:'conditional_module_calculation',
   actual_creator_cash_received:null,verified_creator_profit:null};
}
export function evaluateEarnedRubies(model,params){
 if(!params||!Number.isSafeInteger(params.rubies)||params.rubies<0)
  throw Error('Require recorded whole earned Ruby units');
 const value=params.rubies*model.gifts.usd_per_ruby;
 if(!Number.isSafeInteger(params.rubies)||!Number.isFinite(value))
  throw Error('Invalid Ruby value');
 return {rubies:params.rubies,usd_revenue_value:Math.round(value*100)/100,
  unit:'USD_from_confirmed_earned_rubies_not_jewel_purchases',
  module:model.gifts.module,actual_bank_cash_received:null,verified_creator_profit:null};
}
export function redeemedJewelsToRubies(model,redeemed){
 if(!Number.isSafeInteger(redeemed)||redeemed<0||redeemed%model.gifts.jewels_redeemed_per_ruby!==0)
  throw Error('Require even whole Jewels explicitly redeemed for actual gifts');
 return {rubies:redeemed/model.gifts.jewels_redeemed_per_ruby,
  status:'conditional_redeemed_gifts_only',purchase_conversion_rate:null};
}
export function checkLiveFanFundingConditions(model,feature,input){
 if(!['super_chat_and_stickers','live_gifts'].includes(feature))
  return {could_be_eligible:false,reason:'unsupported_product'};
 if(!input?.yppApproved||!input?.moduleAccepted||!input?.countryEligible)
  return {could_be_eligible:false,reason:'account_or_geography_unconfirmed'};
 for(const reason of model.per_stream_exclusions) {
  if(input[reason.id])return {could_be_eligible:false,reason:reason.id};
 }
 if(feature==='live_gifts'&&!['eligible_horizontal_live','eligible_vertical_live'].includes(input.surface))
  return {could_be_eligible:false,reason:'unsupported_gifts_surface'};
 if(feature==='super_chat_and_stickers'&&!['eligible_horizontal_live','eligible_vertical_live','eligible_premiere_super_chat'].includes(input.surface))
  return {could_be_eligible:false,reason:'unsupported_supers_surface'};
 return {could_be_eligible:true,actual_channel_approval_checked:false,verified_payout:null};
}
