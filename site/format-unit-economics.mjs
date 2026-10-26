import {evaluateWatchPageEligibleNet,assessLongFormAdOpportunity} from './watch-page-ad-accounting.mjs';
import {hypotheticalShortsCreatorPool} from './shorts-pool-economics.mjs';

const nonnegative=(x,name)=>{
 if(typeof x!=='number'||!Number.isFinite(x)||x<0)throw Error('Missing or invalid '+name);
 return x;
};
const cents=(x,name)=>{
 nonnegative(x,name);
 const c=Math.round(x*100);
 if(!Number.isSafeInteger(c)||Math.abs(x*100-c)>1e-6)throw Error('Money requires cents precision: '+name);
 return c;
};
const labor=(x,name)=>nonnegative(x,name);
function costAndWork(name,record,conditionalShare){
 const paid=cents(record.production_cash_paid,name+'.production_cash_paid')+
   cents(record.distribution_cash_paid,name+'.distribution_cash_paid');
 if(!Number.isSafeInteger(paid))throw Error('Cash cost overflow');
 const hours=labor(record.production_hours,name+'.production_hours')+
   labor(record.distribution_hours,name+'.distribution_hours');
 if(!Number.isFinite(hours))throw Error('Work hours overflow');
 const contractualCents=cents(conditionalShare,name+'.conditional_share');
 const contribution=(contractualCents-paid)/100;
 return {
  name,conditional_creator_contract_share:contractualCents/100,
  paid_direct_cash_costs:paid/100,recorded_work_hours:hours,
  conditional_contribution_after_direct_cash_costs:contribution,
  conditional_contribution_per_work_hour:hours>0?contribution/hours:null,
  cash_received:null,net_profit:null,verified_earnings:null
 };
}
export function evaluateMatchedFormatEconomics(model,watchModel,shortsModel,v){
 if(model?.kind!=='conditional_long_form_versus_shorts_creator_ad_economics')
  throw Error('Unsupported format economics model');
 if(!v||!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(v.month||'')||v.month>='2027-02')
  throw Error('Explicit pre-February-2027 month required');
 if(!/^[A-Z]{3}$/.test(v.currency||'')||!/^[A-Z]{2}$/.test(v.country||''))
  throw Error('Reporting currency and Shorts country required');
 if(!v.long_form||!v.shorts)throw Error('Separate explicit production scenarios required');
 if(v.long_form.reported_public_views!==undefined||v.shorts.reported_public_views!==undefined||
   v.long_form.advertiser_cpm!==undefined||v.shorts.advertiser_cpm!==undefined)
  throw Error('Public views and advertiser CPM are not contract share inputs');
 const common=cents(v.common_cash_overhead_unallocated,'common_cash_overhead_unallocated');
 const l=v.long_form,s=v.shorts;
 const resultLong=evaluateWatchPageEligibleNet(watchModel,{
  input_basis:'eligible_net_ad_revenues_watch_page_module',currency:v.currency,period:v.month,
  watch_page_module_accepted:l.watch_page_module_accepted,
  eligible_public_video:l.eligible_public_video,
  eligible_net_ad_revenues:cents(l.eligible_net_ad_revenues,'eligible_net_ad_revenues')/100
 });
 const duration=assessLongFormAdOpportunity(watchModel,{
  duration_seconds:l.video_duration_seconds,
  monetized:true,watch_page_module_accepted:l.watch_page_module_accepted,
  eligible_public_video:l.eligible_public_video,mode:l.ad_slot_mode
 });
 if(duration.reason==='invalid_duration'||duration.reason==='unknown_slot_mode')throw Error('Invalid long-form duration or slot mode');
 const resultShort=hypotheticalShortsCreatorPool(shortsModel,{
  month:v.month,country:v.country,currency:v.currency,
  shorts_module_accepted_before_activity:s.shorts_module_accepted_before_activity,
  content_eligible:s.content_eligible,
  period_is_authorized_country_eligible_engaged_views:s.period_is_authorized_country_eligible_engaged_views,
  country_creator_pool:cents(s.country_creator_pool,'country_creator_pool')/100,
  creator_eligible_engaged_views:s.creator_eligible_engaged_views,
  total_eligible_engaged_views:s.total_eligible_engaged_views
 });
 return {
  kind:'paired_explicit_hypothetical_not_creator_income_forecast',
  month:v.month,currency:v.currency,shorts_pool_country:v.country,
  long_form:{...costAndWork('watch_page',l,resultLong.creator_contractual_share),
   midroll_duration_gate_satisfied:duration.eligible,
   midroll_ad_served:null},
  shorts:{...costAndWork('shorts',s,resultShort.conditional_creator_share),
   creator_fraction_of_country_pool:resultShort.creator_fraction_of_country_pool,
   raw_public_views_validated:false},
  common_cash_overhead_unallocated:common/100,
  can_claim_after_overhead_profit:false,
  observed_bank_cash:null,actual_creator_income:null,
  causal_format_advantage:null,representative_earnings_distribution:null
 };
}
