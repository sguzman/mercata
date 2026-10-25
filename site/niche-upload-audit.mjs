export function auditNicheUploads(data,sources,original){
 const errors=[];
 if(data?.kind!=='five_dated_niche_upload_lower_bound_observations'||data?.observations?.length!==5)errors.push('Incorrect bounded source count');
 const seen=new Set(),allowed=new Set(['title_keyword','platform_related_topic']);
 for(const x of data?.observations||[]){
  if(seen.has(x.id)||!sources.has(x.source_id)||!x.topic_predicate||!allowed.has(x.predicate_kind))errors.push('Missing source or predicate');
  seen.add(x.id);
  if(x.metric!=='video_uploads'||x.unit!=='video_objects_uploaded'||!Number.isSafeInteger(x.lower_bound_exclusive)||x.lower_bound_exclusive<=0||x.exact_count!==null||x.unique_uploading_channels!==null||x.creator_income!==null)errors.push('Video upload lower bound relabeled');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(x.period_start)||! /^\d{4}-\d{2}-\d{2}$/.test(x.period_end)||x.period_start>x.period_end)errors.push('Missing observation window');
 }
 const old=original.observations.filter(x=>['upcycle-title-uploads-2025','morning-routine-title-uploads-h1-2026'].includes(x.id));
 for(const o of old){const x=data?.observations?.find(x=>x.id===o.id);if(!x||x.lower_bound_exclusive!==o.value||x.topic_id!==o.topic_id)errors.push('Existing platform source rewritten');}
 if(Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Invented niche population');
 return {valid:!errors.length,errors};
}
