export function auditSearchDemand(d,sources){
 const errors=[];
 if(d?.kind!=='search_demand_proxy_crosswalk'||d?.platform!=='youtube')errors.push('identity');
 if(d?.proxies?.length!==4)errors.push('coverage');
 for(const p of d?.proxies||[]){
  if(!p.source_ids?.length||!p.source_ids.every(id=>sources.has(id)))errors.push('source');
  if(p.observed_value!==null||p.absolute_searches!==null||p.unique_searchers!==null)errors.push('invented volume');
 }
 if(d?.published_limits?.google_trends_is_absolute!==false||d?.published_limits?.studio_window_days!==28)errors.push('wrong limit');
 if(d?.recorded_keyword_panels?.length||!d?.unmeasured||Object.values(d.unmeasured).some(v=>v!==null))errors.push('uncollected results');
 return {valid:errors.length===0,errors};
}
export function compareDemandIndex(a,b){
 const fields=['query','query_kind','search_service','country','language','time_range','category','comparison_panel','definition_epoch'];
 if(fields.some(k=>!a?.[k]||a[k]!==b?.[k]))return {status:'incomparable',index_difference:null};
 if(!Number.isFinite(a.index)||!Number.isFinite(b.index)||a.index<0||a.index>100||b.index<0||b.index>100)return {status:'invalid',index_difference:null};
 return {status:'relative_only',index_difference:b.index-a.index,absolute_searches:null,creator_income_effect:null};
}
