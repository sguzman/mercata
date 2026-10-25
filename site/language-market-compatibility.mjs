export function compareLanguageIndexPeriods(a,b){
 const fields=['query','search_service','comparison_panel','normalization_batch','country','language','definition_epoch','metric','period_granularity','sample_inclusion_rules'];
 if(!a||!b||fields.some(k=>typeof a[k]!=='string'||!a[k]||a[k]!==b[k]))return {valid:false,reason:'incompatible_query_or_normalization_frame'};
 if(a.period===b.period||!a.period||!b.period)return {valid:false,reason:'same_or_missing_period'};
 if(![a.index,b.index].every(x=>Number.isFinite(x)&&x>=0&&x<=100))return {valid:false,reason:'missing_normalized_index'};
 if(a.metric!=='google_trends_youtube_search_index'||a.search_service!=='youtube_search'||a.shared_scale!==true||b.shared_scale!==true)return {valid:false,reason:'not_same_youtube_search_reference_scale'};
 return {valid:true,kind:'relative_index_point_change_not_search_volume_or_people',index_point_change:b.index-a.index,absolute_searches:null,unique_people:null,creator_income:null};
}
export function auditLanguageMarketRegister(d,multilingual,countries,sourceIds){
 const errors=[];
 if(d?.kind!=='language_market_longitudinal_comparability_register'||d?.observations?.length!==6)errors.push('Wrong evidence frame');
 const a=multilingual?.official_selected_observations?.find(x=>x.id==='mla-watch-time-non-primary-language-2025');
 const b=multilingual?.official_selected_observations?.find(x=>x.id==='auto-dubbing-language-total-may-2026');
 if(d?.observations?.[0]?.value_lower_bound_exclusive!==a?.value||d?.observations?.[1]?.value_exact!==b?.value)errors.push('Multilingual feature source changed');
 for(let i=0;i<4;i++){
  if(d?.observations?.[i+2]?.value_exact!==countries?.observations?.[i]?.ad_reach_million||d?.observations?.[i+2]?.country!==countries?.observations?.[i]?.code)errors.push('Country planner proxy mismatch');
 }
 if(!d?.source_ids?.length||d.source_ids.some(x=>!sourceIds.has(x)))errors.push('Missing verified source');
 if(d?.shared_language_by_year_person_panel?.length!==0||Object.values(d?.unmeasured||{}).some(x=>x!==null)||d?.ad_reach_not_a_language_market!==true)errors.push('Invented language-market growth');
 return {valid:!errors.length,errors};
}
