export function getSelectedRPMMonth(model,month){
 if(!Number.isInteger(month)||month<1||month>12)return {supported:false,reason:'bad_calendar_month'};
 const x=model.month_of_year_rpm.values.find(y=>y.month===month);
 return x?{supported:true,value:x.rpm_usd,unit:'sample_median_RPM_USD_per_1000_views',
  predicts_future:false,verified_creator_net_profit:null}:{supported:false,reason:'unreported_month'};
}
export function validateNestedChannelRevenueShares(model){
 const g=model.ad_revenue_distribution.groups;
 const counts=g.map(x=>x.channels);
 if(JSON.stringify(counts)!==JSON.stringify([30,75,150,150]))return {valid:false,reason:'wrong_group_sizes'};
 const shares=g.map(x=>x.ad_revenue_share_percent);
 const valid=shares[0]<=shares[1]&&shares[1]<=shares[2]&&shares[2]+shares[3]===100;
 return {valid,top_10_percent:shares[0],top_25_percent:shares[1],
   top_50_percent:shares[2],bottom_50_percent:shares[3],
   may_sum_nested_top_groups:false,all_creator_earnings_share:null};
}
export function inferGlobalCreatorEarnings(model){
 return {allowed:false,reason:'selected_monetized_vendor_studio_accounts_not_all_creator_cash',
  median_all_creator_income:null,zero_earner_fraction:null,creator_net_profit:null};
}
