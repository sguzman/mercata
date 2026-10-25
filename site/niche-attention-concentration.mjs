export function calculateVideoConcentration(rows,{metric='views',fraction=.01}={}){
 if(!['views','estimatedMinutesWatched'].includes(metric)||!Number.isFinite(fraction)||fraction<=0||fraction>1)return {valid:false};
 if(!Array.isArray(rows)||rows.length<2)return {valid:false};
 const keys=['frame_id','topic','country','language','format','start','end'],base=rows[0],ids=new Set(),xs=[];
 for(const r of rows){
  if(keys.some(k=>typeof r[k]!=='string'||!r[k]||r[k]!==base[k]))return {valid:false};
  if(!r.video_id||ids.has(r.video_id)||!Number.isFinite(r[metric])||r[metric]<0)return {valid:false};
  if(metric==='views'&&!Number.isSafeInteger(r.views))return {valid:false};
  ids.add(r.video_id);xs.push(r[metric]);
 }
 xs.sort((a,b)=>a-b);const n=xs.length,total=xs.reduce((a,b)=>a+b,0),k=Math.ceil(n*fraction);
 if(!(total>0)||!Number.isFinite(total))return {valid:false};
 const hhi=xs.reduce((a,v)=>a+(v/total)**2,0);
 const gini=2*xs.reduce((a,v,i)=>a+(i+1)*v,0)/(n*total)-(n+1)/n;
 return {valid:true,video_count:n,top_video_count:k,top_share:xs.slice(-k).reduce((a,b)=>a+b,0)/total,hhi,gini,unique_people:null,creator_profit:null};
}
export function auditVideoConcentrationStudy(d,sources){
 const errors=[];
 if(d?.kind!=='per_niche_video_attention_concentration_protocol'||d?.sampled_rows?.length!==0)errors.push('invalid_frame');
 if(d?.global_study?.top_video_percent!==1||d?.global_study?.share_of_watchtime_percent!==91)errors.push('invalid_global_context');
 if(d?.source_ids?.some(x=>!sources.has(x))||!d?.source_ids?.length)errors.push('source_missing');
 if(Object.values(d?.actual_niche||{}).some(x=>x!==null))errors.push('invented_niche');
 return {valid:!errors.length,errors};
}
