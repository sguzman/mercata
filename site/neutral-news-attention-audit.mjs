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

export function auditReutersVideoNewsSurvey(model,registered){
 const errors=[],r=model?.reuters_video_news_survey;
 if(!r||r.eligible_market_count!==48||r.published_at!=='2026-06-16'||
    !registered.has(r.source_id)||!registered.has(r.same_study_family_existing_source_id))
    return {valid:false,errors:['missing registered 48-market survey frame']};
 if(r.weekly_youtube_news_use_all_market_pct!==34||
    r.regional_weekly_youtube_news_video_use?.map(x=>x.percent).join(',')!=='54,47,24'||
    r.regional_weekly_youtube_news_video_use?.map(x=>x.region).join(',')!=='Africa,Asia,Europe')
    errors.push('survey population or regional rates corrupted');
 if(r.youtube_news_consumers_intent?.mostly_intentional_pct!==55||
    r.youtube_news_consumers_intent?.mostly_incidental_pct!==40||
    r.youtube_news_consumers_intent?.remainder_not_assigned!==null||
    !r.youtube_news_consumers_intent?.population?.includes('news_on_youtube'))
    errors.push('intent categories misrepresented as all adults');
 if(r.respondents_total_n!==null||r.per_question_n!==null||r.country_coverage_complete_world!==false||
    r.direct_comparison_to_pew_us_regular_news_rate!==false||
    r.same_respondent_pool_independent_replication!==false||
    r.overlaps_with_reuters_main_report!==true)
    errors.push('invented matched global person sample or independent replication');
 for(const k of ['reliable_mainstream_vs_independent_creator_share','confirmed_political_news_only_share',
   'political_affiliation_of_youtube_users','per_creator_political_audience_profile','causal_effect_of_content_on_beliefs','typical_channel_income','unique_weekly_news_people'])
   if(r[k]!==null)errors.push('unmeasured audience politics or economics invented');
 if(model?.private_user_records_collected!==false)errors.push('individual political profile prohibited');
 return {valid:errors.length===0,errors};
}
