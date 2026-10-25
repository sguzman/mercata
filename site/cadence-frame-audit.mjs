export function auditCadenceFrames(data,sources){
 const errors=[];
 const a=data?.datasets?.find(x=>x.id==='air-282-2026'),v=data?.datasets?.find(x=>x.id==='vidiq-2026'),third=data?.additional_study;
 if(a?.reported_sample_channels!==282||v?.reported_sample_channels!==10210278||third?.reported_sample_channels!==18000)errors.push('Vendor study samples collapsed');
 if(third?.source_id!=='air-2026-publishing-study-18000'||!sources.has(third.source_id))errors.push('New source missing');
 if(third?.statistic!=='publisher_recommended_videos_per_week_from_observational_association'||third?.median_uploads_per_month!==null||third?.causal_optimal_frequency!==null||third?.creator_net_profit!==null)errors.push('Recommendation confused with observation or causal profit');
 if(third?.recommendations?.length!==3||third?.recommendations?.some(x=>!(x.min_per_week>=0&&x.max_per_week>=x.min_per_week)))errors.push('Inconsistent quoted vendor ranges');
 if(data?.cross_study_comparability?.can_pool_channels!==false||data?.cross_study_comparability?.third_sample_compatible!==false)errors.push('Unjustified pooling');
 for(const c of a?.niche_size_groups||[]){if(c.p25_uploads_month>c.median_uploads_month||c.median_uploads_month>c.p75_uploads_month||c.respondent_channels_n!==null)errors.push('Invented individual niche n');}
 if(Object.values(data?.unmeasured||{}).some(v=>v!==null))errors.push('Invented creator outcome');
 return {valid:!errors.length,errors};
}
