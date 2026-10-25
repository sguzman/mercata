export function auditBeautyTopicFrames(model,sources){
 const errors=[],frames=model?.beauty_subtopic_frames;
 if(model?.kind!=='fashion_beauty_lifestyle_content_taxonomy_with_dated_video_event_proxies'||frames?.length!==3)errors.push('Incorrect bounded beauty-frame count');
 const ids=new Set();const expected=[['nail_art_global_2022','yt-nail-art-2022-views','2022-01-01','2022-12-31',5000000000],['drag_performance_global_2023','yt-drag-community-2023-views','2023-01-01','2023-12-31',2000000000],['halloween_title_makeup_2025','yt-halloween-makeup-2025','2025-01-01','2025-10-05',1000000000]];
 (frames||[]).forEach((row,i)=>{
  const [id,source,start,end,bound]=expected[i]||[];
  if(row.id!==id||ids.has(row.id)||row.source_id!==source||!sources.has(row.source_id)||row.window_start!==start||row.window_end!==end||row.lower_bound!==bound||row.comparison!=='>'||row.metric!=='historical_video_view_events')errors.push('Source frame or lower bound changed');
  ids.add(row.id);
  if(row.unique_people!==null||row.active_creators!==null||row.verified_creator_profit!==null)errors.push('Invented unique people or earnings');
 });
 const scope=model?.beauty_subtopic_comparability;
 if(scope?.mutually_exclusive_topics_verified!==false||scope?.identical_inclusion_rules!==false||scope?.verified_year_over_year_growth!==false||scope?.estimated_niche_revenue_per_view!==null)errors.push('Invented compatible beauty-market total');
 if(model?.source_ids?.some(x=>!sources.has(x)))errors.push('Unknown source registration');
 return {valid:!errors.length,errors};
}
