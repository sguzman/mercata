export function validateNewsEventFrame(model,x){
 if(!x||typeof x!=='object')return {valid:false,reason:'missing_frame'};
 if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(x.eventDate||'')||!Number.isFinite(Date.parse(x.eventDate+'T00:00:00Z')))return {valid:false,reason:'invalid_event_date'};
 const day=(Date.parse(x.eventDate+'T00:00:00Z'))/86400000;
 if(!Number.isInteger(x.beforeDays)||!Number.isInteger(x.afterDays)||x.beforeDays<=0||x.afterDays<=0||x.beforeDays!==x.afterDays)return {valid:false,reason:'noncomparable_window'};
 if(!x.query||!x.regionCode||!x.relevanceLanguage||!x.snapshotMethod)return {valid:false,reason:'missing_query_or_capture_parameters'};
 if(x.infersViewerPoliticalIdentity)return {valid:false,reason:'private_political_inference_prohibited'};
 return {valid:true,preStart:new Date((day-x.beforeDays)*86400000).toISOString().slice(0,10),
  preEnd:new Date((day-1)*86400000).toISOString().slice(0,10),eventDate:x.eventDate,
  postStart:new Date((day+1)*86400000).toISOString().slice(0,10),
  postEnd:new Date((day+x.afterDays)*86400000).toISOString().slice(0,10),
  sampledVideoObservations:model.event_window_design.records.length,
  causalTrafficEffect:null,partyViewerProfiles:null};
}
export function assessNewsSurveyClaim(model,claim){
 const s=model.polls;
 if(claim==='2026_US_adult_regular_youtube_news_share')return {allowed:true,value_pct:s.overall_2026_pct_us_adults,
  denominator:'all_US_adults',sample_size:s.sample_size,political_viewer_distribution:null};
 if(claim==='2026_US_party_specific_regular_news_prevalence')return {allowed:true,
  groups:s.party_subgroups,denominator:'US_adults_within_each_party_lean_group',
  channel_audience_party_composition:null};
 return {allowed:false,reason:'no_individual_or_creator_audience_party_estimate'};
}
export function assessGoogleTrendsClaim(model,claim){
 if(claim==='normalized_relative_google_search_index')return {allowed:true,range:[model.google_trends.scale_min,model.google_trends.scale_max],
  observed_results:null,absolute_searches:null};
 return {allowed:false,reason:'not_youtube_search_volume_or_voters'};
}
