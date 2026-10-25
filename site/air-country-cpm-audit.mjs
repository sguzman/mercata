export function readCountryAdCPM(model,countryCode,metric='advertiser_cpm'){
 if(metric!=='advertiser_cpm')return {supported:false,reason:'not_advertiser_cpm'};
 if(model.unreported_reference_markets.some(x=>x.country_code===countryCode))
  return {supported:false,reason:'unreported_country_price',value:null,creator_rpm:null};
 const row=model.observations.find(x=>x.country_code===countryCode);
 if(!row)return {supported:false,reason:'not_in_selected_sample',value:null,creator_rpm:null};
 return {supported:true,countryCode,unit:'USD_per_1000_ad_impressions',value:row.value_usd_per_thousand_ad_impressions,
  source_frame:'selected_AIR_client_channels_2025',creator_rpm:null,creator_residence_income:null};
}
export function compareCountryAdCPM(model,first,second){
 const a=readCountryAdCPM(model,first),b=readCountryAdCPM(model,second);
 if(!a.supported||!b.supported)return {supported:false,reason:'both_observations_required',price_ratio:null,creator_earnings_ratio:null};
 return {supported:true,price_ratio:a.value/b.value,unit:'descriptive_sample_advertiser_CPM_ratio',
   creator_earnings_ratio:null,typical_resident_income:null};
}
export function inferCreatorCountryIncome(model,req){
 return {allowed:false,reason:'advertiser_impression_CPM_not_resident_creator_net_receipts',median_creator_income:null,after_cost_profit:null};
}
