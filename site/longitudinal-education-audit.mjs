export function auditEducationLongitudinalCase(model,sources){
 const errors=[],x=model?.single_channel_evergreen_longitudinal_observation;
 if(model?.kind!=='video_lifecycle_and_revenue_horizon_protocol'||x?.source_id!=='fpsy-psychotherapy-video-longitudinal-2026'||!sources.has(x.source_id))errors.push('Study source missing');
 if(x?.selected_video_count!==51||x?.channel_monthly_views_pre?.mean!==365.3||x?.channel_monthly_views_later?.mean!==1669.5||x?.average_retention_pre?.percent!==24.7||x?.average_retention_later?.percent!==33.9)errors.push('Study observations changed');
 if(x?.matched_non_educational_trend_control!==null||x?.identified_causal_effect!==null||x?.owner_total_revenue!==null||x?.net_earnings!==null||x?.production_labor_hours!==null)errors.push('Observational case promoted into causal or earnings evidence');
 if(model?.source_ids?.some(id=>!sources.has(id))||Object.values(model?.unmeasured||{}).some(v=>v!==null)||model?.acceptance_gates?.some(v=>v.pass!==false))errors.push('Unmeasured all-creator claim');
 return {valid:!errors.length,errors};
}
