// Pure metric comparability check for two dated content observations.
// Direction between two matched points is descriptive, never a trend forecast.
export function assessTopicChange(before,after){
 const errors=[];
 if(!before||!after)return {status:'incomparable',direction:null,percent_change:null,persistent_trend_verified:false,errors:['Two dated observations are required']};
 const fields=['topic_id','title_predicate','geography','language_scope','format','population','unit','measurement_epoch','sampling_frame','period_days'];
 for(const field of fields)if(!before[field]||!after[field]||before[field]!==after[field])
   errors.push('Missing or mismatched '+field);
 if(before.period_start===undefined||after.period_start===undefined||
   typeof before.period_start!=='string'||typeof after.period_start!=='string'||
   !/^\d{4}-\d{2}-\d{2}$/.test(before.period_start)||!/^\d{4}-\d{2}-\d{2}$/.test(after.period_start)||
   before.period_start>=after.period_start)
   errors.push('Distinct ordered dated periods required');
 if(before.bound_type!=='exact'||after.bound_type!=='exact')
   errors.push('Exact measured values required; lower bounds cannot be subtracted');
 if(!Number.isFinite(before.value)||!Number.isFinite(after.value)||before.value<0||after.value<0)
   errors.push('Nonnegative finite values required');
 if(!before.source_ids?.length||!after.source_ids?.length)
   errors.push('Source attribution for both periods required');
 if(errors.length)return {status:'incomparable',direction:null,percent_change:null,persistent_trend_verified:false,errors};
 const direction=after.value<before.value?'decrease':after.value>before.value?'increase':'unchanged';
 const pct=before.value===0?null:(after.value-before.value)/before.value*100;
 return {status:'descriptive_two_period_change_only',direction,percent_change:pct,persistent_trend_verified:false,errors:[]};
}
