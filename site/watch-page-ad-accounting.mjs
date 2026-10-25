// Pure accounting-boundary validator. Hypothetical inputs are not actual creator earnings.
const money=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function classifyWatchPageMetric(model,id){
 const m=model.authorized_reporting_metrics.find(x=>x.id===id);
 if(!m)return {known:false,source:null};
 return {known:true,unit:m.unit,economics:m.economics,actual_value:m.known_value};
}
export function evaluateWatchPageEligibleNet(model,input){
 if(!input||typeof input!=='object')throw Error('Missing explicit accounting basis');
 if(input.input_basis!=='eligible_net_ad_revenues_watch_page_module')
  throw Error('Cannot use advertiser gross, CPM or public views as the eligible-net share base');
 if(!/^[A-Z]{3}$/.test(input.currency||'')||typeof input.period!=='string'||!/^[0-9]{4}-[0-9]{2}$/.test(input.period))
  throw Error('Require currency and explicit YYYY-MM observation period');
 if(input.watch_page_module_accepted!==true||input.eligible_public_video!==true)
  throw Error('Watch-page module and content eligibility must be established for this hypothetical');
 if(!money(input.eligible_net_ad_revenues))throw Error('Missing or invalid eligible net value');
 const v=model.platform_share_of_eligible_net_watch_page_ads*input.eligible_net_ad_revenues;
 if(!Number.isFinite(v))throw Error('Overflow');
 return {kind:'hypothetical_contract_share_not_empirical',currency:input.currency,period:input.period,
   eligible_net_basis:input.eligible_net_ad_revenues,creator_contractual_share:v,
   actual_creator_payout:null,actual_creator_profit:null,bank_cash_received:null};
}
export function assessLongFormAdOpportunity(model,{duration_seconds,monetized,watch_page_module_accepted,eligible_public_video,mode}={}){
 if(!Number.isFinite(duration_seconds)||duration_seconds<0)return {eligible:false,reason:'invalid_duration'};
 if(!monetized||!watch_page_module_accepted||!eligible_public_video)
  return {eligible:false,reason:'missing_channel_or_video_monetization_gate'};
 if(duration_seconds<model.midroll_eligibility.minimum_video_duration_seconds)
  return {eligible:false,reason:'below_eight_minute_midroll_gate'};
 if(!model.midroll_eligibility.slot_types.includes(mode))
  return {eligible:false,reason:'unknown_slot_mode'};
 return {eligible:true,ad_will_serve:null,verified_ad_impressions:null,verified_creator_cash:null};
}
export function reportAdMetrics(model,input){
 if(!input||typeof input!=='object')throw Error('Missing authorized reporting frame');
 if(input.owner_authorized!==true)throw Error('Owner-authorized metrics required');
 if(!/^[A-Z]{3}$/.test(input.currency||'')||!/^\d{4}-\d{2}$/.test(input.period||''))
  throw Error('Specify reporting currency and period');
 const values=['grossRevenue','estimatedAdRevenue','estimatedRevenue','estimatedRedPartnerRevenue','adImpressions','monetizedPlaybacks','cpm','playbackBasedCpm'];
 const provided={};
 for(const k of values)if(input[k]!==null&&input[k]!==undefined){
  if(!money(input[k]))throw Error('Invalid value for '+k);
  if(['adImpressions','monetizedPlaybacks'].includes(k)&&!Number.isSafeInteger(input[k]))throw Error('Integer event count required');
  provided[k]=input[k];
 }
 if(Object.keys(provided).length===0)throw Error('No observed owner metrics provided');
 const currencySensitive=['grossRevenue','estimatedRevenue','estimatedAdRevenue','estimatedRedPartnerRevenue','cpm','playbackBasedCpm'];
 const hasMoney=currencySensitive.some(k=>provided[k]!==undefined);
 if(input.api_currency_parameter!==undefined && input.api_currency_parameter!==input.currency)
  throw Error('API currency parameter differs from the reporting currency');
 if(hasMoney&&input.currency!=='USD'&&input.api_currency_parameter!==input.currency)
  throw Error('Explicit matching API currency parameter required for non-USD monetary reports');
 // USD is the API default; non-USD monetary reports are valid only with an explicitly recorded API conversion request.
 return {kind:'owner_supplied_estimated_analytics_not_final_bank_receipt',
   currency:input.currency,period:input.period,
   api_currency_parameter:input.api_currency_parameter??null,
   advertiser_gross_revenue:provided.grossRevenue??null,
   creator_estimated_net_ads:provided.estimatedAdRevenue??null,
   creator_estimated_net_total:provided.estimatedRevenue??null,
   creator_estimated_net_premium:provided.estimatedRedPartnerRevenue??null,
   gross_to_eligible_net_bridge:null,creator_contractual_share_inferred_from_gross:null,
   cash_settled:null,profit_after_costs:null,
   gross_cpm_from_impressions:
    provided.grossRevenue!==undefined&&provided.adImpressions>0?
      provided.grossRevenue*1000/provided.adImpressions:null};
}
