export function videoSampleConcentration(sample,{topFraction=0.01}={}){
 if(!sample||!['view_events','engaged_view_events','estimated_watch_minutes'].includes(sample.metric))throw Error('Specify one supported attention metric');
 for(const k of ['topic_id','period_start','period_end','selection_method']){
  if(typeof sample[k]!=='string'||!sample[k])throw Error('Missing required sample frame: '+k);
 }
 if(!/^\d{4}-\d{2}-\d{2}$/.test(sample.period_start)||!/^\d{4}-\d{2}-\d{2}$/.test(sample.period_end)||sample.period_end<sample.period_start)throw Error('Invalid observation window');
 if(!(topFraction>0&&topFraction<=1&&Number.isFinite(topFraction)))throw Error('Top fraction must lie inside (0,1]');
 if(!Array.isArray(sample.video_rows)||sample.video_rows.length===0)throw Error('No sampled video rows');
 const seen=new Set(),counts=[];
 for(const row of sample.video_rows){
  if(typeof row.video_id!=='string'||!row.video_id||seen.has(row.video_id))throw Error('Video IDs must be unique and nonempty');
  seen.add(row.video_id);
  if(!Number.isFinite(row.value)||row.value<0)throw Error('All sampled measures must be finite and nonnegative');
  counts.push(row.value);
 }
 const total=counts.reduce((a,b)=>a+b,0);
 if(!Number.isFinite(total)||total<=0)throw Error('No positive finite denominator');
 const n=counts.length,k=Math.max(1,Math.ceil(n*topFraction));
 const sorted=[...counts].sort((a,b)=>b-a);
 const top=sorted.slice(0,k).reduce((a,b)=>a+b,0);
 const shares=sorted.map(v=>v/total);
 const hhi=shares.reduce((a,s)=>a+s*s,0);
 const ascending=[...counts].sort((a,b)=>a-b);
 const weighted=ascending.reduce((a,v,i)=>a+(i+1)*(v/total),0);
 const gini=(2*weighted/n)-(n+1)/n;
 return {kind:'selected_video_sample_only',topic_id:sample.topic_id,metric:sample.metric,period_start:sample.period_start,period_end:sample.period_end,sample_size:n,top_video_count:k,top_share_percent:100*top/total,video_share_hhi:hhi,video_share_gini:Math.max(0,Math.min(1,gini)),all_niche_video_share:null,creator_profit:null,unique_viewers:null};
}
export function auditVideoConcentration(model,existing,sources){
 const errors=[],o=existing?.observations?.find(x=>x.id==='omdia-top-1pct-watchtime');
 const row=model?.published_video_level_observation;
 if(model?.kind!=='video_level_attention_concentration_bounded_evidence_and_sample_metric'||row?.upper_share_of_watch_time_percent!==o?.value||row?.upper_share_of_ranked_video_objects_percent!==1||row?.complementary_share_of_watch_time_percent!==9)errors.push('Omdia video-level baseline changed');
 if(!sources.has('omdia-video-supply-2026')||row?.source_id!=='omdia-video-supply-2026')errors.push('Unlinked original source');
 if(row?.creator_revenue_share!==null||row?.topic_specific_concentration!==null||row?.raw_sample_size!==null)errors.push('Unsupported Omdia disaggregation');
 if(model?.measured_niche_samples?.length!==0||Object.values(model?.unmeasured||{}).some(x=>x!==null))errors.push('Unobserved niche-level measurements inferred');
 return {valid:errors.length===0,errors};
}
