// Protects owner-only completion measures from interpretation as public views or people.
export function auditRetentionObservability(data,sources){
 const errors=[];
 if(data?.platform!=='youtube'||data?.kind!=='retention_completion_observability_matrix')errors.push('identity');
 const m=data?.metrics||[];
 if(m.length!==11||new Set(m.map(x=>x.id)).size!==11)errors.push('metric coverage');
 for(const x of m){
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('missing registered source');
  if(!x.unit||!x.access||!x.limit||x.value!==null||x.observed!==false)errors.push('invented metric observation');
 }
 const metric=id=>m.find(x=>x.id===id);
 if(metric('shorts_stayed')?.unit!=='initial_short_view_opportunities'||metric('shorts_stayed')?.access!=='owner_only')errors.push('Shorts retention confused');
 if(metric('cross_video_session')?.access!=='not_established')errors.push('unsupported session length');
 if(metric('public_video_views')?.unit!=='view_start_events')errors.push('views misdefined');
 if(data?.owner_report?.retention_curve_observed!==false||data?.owner_report?.shorts_full_completion_distribution!==null)errors.push('false owner data');
 if(data?.sampled_video_retention_records?.length!==0||!data?.unmeasured||Object.values(data.unmeasured).some(x=>x!==null))errors.push('fictitious completion distribution');
 return {valid:errors.length===0,errors};
}
export function compareRetentionInputs(a,b){
 if(!a||!b||!a.metric_id||!b.metric_id)return {status:'invalid',difference:null};
 const required=['metric_id','unit','format','content_duration_seconds','definition_epoch','observation_period','source_population'];
 const mismatch=required.filter(k=>a[k]===undefined||b[k]===undefined||a[k]!==b[k]);
 if(mismatch.length)return {status:'incomparable',difference:null,mismatched:mismatch};
 if(!Number.isFinite(a.value)||!Number.isFinite(b.value))return {status:'missing_values',difference:null};
 return {status:'same_unit_descriptive_only',difference:b.value-a.value,causal_lift_verified:false};
}
