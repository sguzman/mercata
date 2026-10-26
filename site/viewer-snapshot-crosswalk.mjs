// Owner-authorized aggregate counts only. Never infer viewers moving between groups.
const integer=(x)=>Number.isSafeInteger(x)&&x>=0;
const validDate=(x)=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 !Number.isNaN(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
export function describeViewerSnapshot(model,reported){
 const errors=[];
 if(model?.access!=='authorized_owner_analytics_only')errors.push('Unknown data access');
 if(!reported||typeof reported!=='object')return {valid:false,errors:['Missing report'],shares:null};
 if(reported.owner_authorized!==true||reported.reporting_surface!=='youtube_studio_owner')
  errors.push('Owner Studio authorization required');
 if(reported.aggregated_only!==true)errors.push('Aggregate-only report required');
 if(reported.metric!=='monthly_audience_estimated_viewers')
  errors.push('Public views and subscribers are invalid audience denominators');
 if(reported.window_days!==28||!validDate(reported.end_date))
  errors.push('A dated 28-day rolling window is required');
 const metrics=['audience','new','casual','regular'];
 for(const key of metrics)if(reported[key]!==null&&!integer(reported[key]))
  errors.push('Invalid viewer estimate: '+key);
 if(!integer(reported.audience)||reported.audience===0)
  errors.push('Nonzero monthly audience denominator required');
 if(errors.length)return {valid:false,errors,shares:null};
 if(!metrics.every(k=>integer(reported[k])))
  return {valid:true,errors,shares:null,reason:'incomplete_owner_estimates'};
 return {valid:true,errors,shares:{
  new:reported.new/reported.audience,
  casual:reported.casual/reported.audience,
  regular:reported.regular/reported.audience
 },interpretation:'same_snapshot_estimated_share_not_person_transition',
  new_to_regular_conversion:null,causal_recommendation_change:null,net_creator_income:null};
}
export function contrastViewerSnapshots(model,before,after){
 const b=describeViewerSnapshot(model,before),a=describeViewerSnapshot(model,after);
 if(!a.valid||!b.valid||a.shares===null||b.shares===null||before.end_date===after.end_date)
  return {status:'insufficient_or_same_date',new_to_regular_conversion:null};
 return {status:'two_aggregate_snapshots_not_a_transition',
  change_in_reported_regular_count:after.regular-before.regular,
  change_in_reported_new_count:after.new-before.new,
  new_to_regular_conversion:null,identified_viewer_retention:null,creator_income_effect:null};
}
