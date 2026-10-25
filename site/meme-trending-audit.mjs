export function summarizeHistoricalTrendingEntries(entries,selection){
 if(!Array.isArray(entries)||selection?.surface!=='historical_curated_trending'||selection?.window_start!=='2022-07-01'||selection?.window_end!=='2025-06-30')
  return {valid:false,reason:'wrong_historical_sampling_frame'};
 const unique=new Set(),pairKeys=new Set(),countries=new Set();
 for(const entry of entries){
  if(typeof entry?.video_id!=='string'||!entry.video_id.trim()||typeof entry.country!=='string'||!entry.country.trim()||
    typeof entry.snapshot_id!=='string'||!entry.snapshot_id.trim()||!Number.isSafeInteger(entry.rank)||entry.rank<1||entry.rank>200)
    return {valid:false,reason:'incomplete_or_invalid_trending_entry'};
  const key=entry.snapshot_id+'|'+entry.country+'|'+entry.rank;
  if(pairKeys.has(key))return {valid:false,reason:'duplicate_snapshot_rank'};
  pairKeys.add(key);unique.add(entry.video_id);countries.add(entry.country);
 }
 return {valid:true,ranked_entries:entries.length,unique_videos:unique.size,observed_country_codes:countries.size,
  unique_viewers:null,meme_classified_video_count:null,global_creator_earnings:null};
}
export function checkMemeSurveyClaim(model,id,requested) {
 const row=model.survey.observation.find(x=>x.id===id);
 if(!row)return {allowed:false,reason:'unknown_survey_question'};
 if(requested!=='percent_of_respondents_answering_named_question')return {allowed:false,reason:'cannot_substitute_awareness_for_actual_viewers'};
 return {allowed:true,percentage:row.percent,sample_n:model.survey.online_age_14_29_sample_size,
   total_global_viewers:null,creator_profit:null};
}
