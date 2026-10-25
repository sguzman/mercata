export function auditQualityCrosswalk(data,sources) {
 const errors=[];
 if(data?.kind!=='video_quality_proxies_and_production_effort_crosswalk'||data?.bounded_observations?.length!==4)errors.push('Wrong evidence frame');
 const seen=new Set();
 for(const row of data?.bounded_observations||[]){
  if(!row.id||seen.has(row.id))errors.push('Duplicated case');seen.add(row.id);
  if(!sources.has(row.source_id)||!(row.sampled_video_count>0)||row.profit_observed!==false||row.representative_of_youtube_creators!==false)errors.push('Unsourced or overgeneralized case');
 }
 for(const row of data?.dimensions||[]){
  if(!row.source_ids?.length||row.source_ids.some(id=>!sources.has(id))||row.universal_quality_cutoff!==null)errors.push('Unverified quality cutpoint');
 }
 const photo=data?.bounded_observations?.find(x=>x.id==='single_photography_work_diary');
 if(photo){
  const total=Object.values(photo.reported_stage_mean_hours||{}).reduce((a,b)=>a+b,0);
  if(photo.sampled_creator_count!==1||photo.sampled_video_count!==61||Math.abs(total-9.73)>1e-8||Math.abs(photo.reported_hour_mean-total-0.01)>1e-8||photo.reported_hour_median!==7.37)errors.push('Photography work diary measurement mismatch');
 }
 const ind=data?.bounded_observations?.find(x=>x.id==='indonesian_learning_channel');
 if(ind?.sampling_frame_videos!==218||ind?.sampled_video_count!==139)errors.push('Indonesian selected sample denominator lost');
 const tur=data?.bounded_observations?.find(x=>x.id==='turkish_high_view_math');
 if(tur?.sampled_creator_count!==null||tur?.sampled_video_count!==126)errors.push('Turkish study cannot claim creator count');
 if(Object.values(data?.unknowns||{}).some(x=>x!==null))errors.push('Invented unmeasured result');
 return {valid:!errors.length,errors};
}
