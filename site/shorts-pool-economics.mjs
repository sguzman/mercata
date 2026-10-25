// Source-defined contract arithmetic, not actual creator income or a channel forecast.
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const month=m=>typeof m==='string'&&/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(m);
export function publishedMusicPoolFraction(model,n){
 const r=model.current_2026.music_revenue_pool_fraction_examples.find(x=>x.tracks===n);
 return r?{published:true,pool_fraction:r.pool_fraction,individual_creator_pay_fraction:null}:
  {published:false,pool_fraction:null,individual_creator_pay_fraction:null};
}
export function hypotheticalShortsCreatorPool(model,v){
 if(!v||!month(v.month)||!/^[A-Z]{2}$/.test(v.country||'')||!/^[A-Z]{3}$/.test(v.currency||''))
  throw Error('Specify one country, currency and YYYY-MM month');
 if(v.shorts_module_accepted_before_activity!==true||v.content_eligible!==true)
  throw Error('Prospective module acceptance and content eligibility required');
 if(v.period_is_authorized_country_eligible_engaged_views!==true)
  throw Error('Raw or cross-country public views are not valid Shorts pool denominators');
 if(v.month>='2027-02'&&v.qualified_rolling_shorts_gate_met!==true)
  throw Error('Future monthly rolling Shorts gate not verified');
 if(!valid(v.country_creator_pool)||!Number.isSafeInteger(v.creator_eligible_engaged_views)||!Number.isSafeInteger(v.total_eligible_engaged_views)||
  v.total_eligible_engaged_views<=0||v.creator_eligible_engaged_views<0||
  v.creator_eligible_engaged_views>v.total_eligible_engaged_views)
  throw Error('Missing or invalid country pool and matching engaged-view denominator');
 const allocated=v.country_creator_pool*v.creator_eligible_engaged_views/v.total_eligible_engaged_views;
 const estimated=allocated*model.current_2026.creator_share_of_allocated_pool;
 if(!Number.isFinite(estimated))throw Error('Overflow');
 return {kind:'hypothetical_no_actual_account_data',country:v.country,currency:v.currency,month:v.month,
  creator_fraction_of_country_pool:v.creator_eligible_engaged_views/v.total_eligible_engaged_views,
  allocated_pool:allocated,conditional_creator_share:estimated,
  actual_earnings:null,actual_bank_received:null,creator_profit:null};
}
export function hypotheticalFutureDirectShortsAd(model,v){
 if(!v||!month(v.month)||v.month<'2027-02')throw Error('Future direct targeted Shorts route not effective');
 if(v.shorts_module_accepted!==true||v.qualified_rolling_shorts_gate_met!==true)
  throw Error('Module or qualified rolling Shorts gate missing');
 if(!Number.isSafeInteger(v.targeted_channel_count)||v.targeted_channel_count<1||
  v.targeted_channel_count>model.future_2027.direct_targeted_max_channels)
  throw Error('Only targeted ads for five or fewer channels qualify');
 if(!/^[A-Z]{3}$/.test(v.currency||'')||!valid(v.eligible_net_targeted_ad_revenue))
  throw Error('Actual eligible net ad basis must be supplied as hypothetical');
 const share=v.eligible_net_targeted_ad_revenue*model.future_2027.direct_targeted_share_of_eligible_net;
 return {kind:'hypothetical_2027_targeted_not_pooled',conditional_share:share,
  same_ad_also_in_pool:false,actual_creator_cash:null,creator_profit:null};
}
