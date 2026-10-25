export function auditStatisticsVideoSample(data,sources){
 const x=data?.statistics_search_quality_case,errors=[];
 if(data?.kind!=='three_selected_educational_video_format_analytics_cohorts'||!sources.has(x?.source_id)||x?.source_id!=='j-korean-med-sci-statistics-video-quality-2026')errors.push('Missing original statistics study');
 if(x?.search_snapshot!=='2025-11-17'||x?.initial_urls!==200||x?.duplicate_urls_excluded!==41||x?.language_excluded!==22||x?.off_topic_excluded!==23||x?.eligible_videos!==114)errors.push('Study denominator drift');
 if(x?.manually_rated_quality?.high_quality_videos!==87||x?.manually_rated_quality?.high_quality_percent_reported!==76.3||x?.manually_rated_quality?.low_quality_videos!==12||x?.manually_rated_quality?.intermediate_quality_videos!==15)errors.push('Quality counts drift');
 const actual=(x?.content_formats||[]).map(v=>v.videos);
 if(actual.join('|')!=='45|24|29|16'||actual.reduce((a,b)=>a+b,0)!==114)errors.push('Video format sample count drift');
 if(x?.manually_rated_quality?.true_population_share!==null||x?.representative_all_educational_video_quality_rate!==null||x?.creator_cash_profit!==null||x?.measured_unique_people!==null||x?.public_metadata?.actual_observed_daily_view_events_series!==null)errors.push('Invented creator income or population outcome');
 if(data?.studies?.length!==3||data.source_ids.some(x=>!sources.has(x)))errors.push('Selected cohorts silently pooled or unsourced');
 return {valid:!errors.length,errors};
}
