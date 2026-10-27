// A pure research evaluator. It neither charges cards nor reads seller accounts.
// Eligibility decisions never establish an observed transaction count: unknown is null, not zero.
const MODES=new Set(['direct_to_you','collected_by_itch']);
const PROVIDERS=new Set(['paypal','stripe']);
function yesNoUnknown(v){return v===true||v===false||v===null;}
export function evaluateItchBuyerCheckout(input){
 if(!input||typeof input!=='object'||!MODES.has(input.mode)||!PROVIDERS.has(input.provider))throw new TypeError('Known payment mode and provider required');
 const unknowns=[];
 if(input.mode==='direct_to_you'){
  if(!yesNoUnknown(input.seller_connected_provider))throw new TypeError('Provider connection must be true, false or null');
  if(input.seller_connected_provider===false)return {status:'not_configured',conditional_checkout_possible:false,reason:'Direct merchant has not connected the processor',known_successful_transactions:null,verified_buyers:null,paid_game_revenue:null};
  if(input.seller_connected_provider===null)unknowns.push('seller_provider_connection');
 }
 if(!yesNoUnknown(input.buyer_region_supported))throw new TypeError('Buyer region support must be true, false or null');
 if(!yesNoUnknown(input.seller_content_permitted))throw new TypeError('Applicable content restrictions must be true, false or null');
 if(input.buyer_region_supported===false||input.seller_content_permitted===false)return {status:'blocked_by_known_rule',conditional_checkout_possible:false,reason:'At least one supplied eligibility gate fails',known_successful_transactions:null,verified_buyers:null,paid_game_revenue:null};
 if(input.buyer_region_supported===null)unknowns.push('buyer_region_issuer_or_currency');
 if(input.seller_content_permitted===null)unknowns.push('content_acceptability');
 if(unknowns.length)return {status:'unknown',conditional_checkout_possible:null,unknowns,known_successful_transactions:null,verified_buyers:null,paid_game_revenue:null};
 return {status:'conditionally_configured',conditional_checkout_possible:true,reason:'Processor/region/content prerequisites are asserted, but no live payment has been observed',known_successful_transactions:null,verified_buyers:null,paid_game_revenue:null};
}
