import {evaluateIncomeScenario} from './scenario.mjs';
const FIELDS=['watch_views','watch_ad_only_rpm','shorts_engaged_views','shorts_ad_only_rpm','net_other_receipts','cash_costs','labor_hours'];
export function evaluateIncomeInterval(input){
 if(!input||!/^[A-Z]{3}$/.test(input.currency||''))throw Error('Explicit three-letter currency required');
 for(const name of FIELDS){
  const bounds=input[name];
  if(!bounds||!Number.isFinite(bounds.min)||!Number.isFinite(bounds.max)||bounds.min<0||bounds.max<bounds.min)throw Error('Explicit ordered numeric interval required for '+name);
  if((name==='watch_views'||name==='shorts_engaged_views')&&(!Number.isSafeInteger(bounds.min)||!Number.isSafeInteger(bounds.max)))throw Error('Views must be safely representable integers: '+name);
  if(name==='labor_hours'&&bounds.min<=0)throw Error('Positive lower labor-hour bound required');
 }
 const samples=[];
 for(let mask=0;mask<(1<<FIELDS.length);mask++){
  const row={currency:input.currency};
  for(let i=0;i<FIELDS.length;i++){const name=FIELDS[i];row[name]=(mask&(1<<i))?input[name].max:input[name].min;}
  samples.push(evaluateIncomeScenario(row));
 }
 const get=k=>({min:Math.min(...samples.map(x=>x[k])),max:Math.max(...samples.map(x=>x[k]))});
 const result={currency:input.currency,kind:'hypothetical_assumption_envelope_not_statistical_forecast',watch_ad_receipts:get('watch_ad_receipts'),shorts_ad_receipts:get('shorts_ad_receipts'),net_receipts:get('net_receipts'),cash_profit_before_tax:get('cash_profit_before_tax'),cash_profit_per_hour:get('cash_profit_per_hour'),verified_confidence_percent:null,actual_creator_earnings:null,assumption_probability:null};
 return result;
}
export function auditNicheUncertainty(data,sources){
 const errors=[];
 if(data?.kind!=='explicit_scenario_input_range_and_profit_boundary_protocol'||data?.input_intervals?.length!==FIELDS.length)errors.push('Wrong interval scope');
 for(let i=0;i<FIELDS.length;i++){
  const x=data?.input_intervals?.[i];
  if(x?.id!==FIELDS[i]||x?.min!==null||x?.max!==null||x?.observed_sample_size!==null||x?.source_specific_empirical_percentile!==null)errors.push('Preset or unsupported field '+FIELDS[i]);
 }
 if(data?.source_ids?.some(x=>!sources.has(x))||!data?.source_ids?.length)errors.push('Missing public source');
 if(data?.currency!==null||data?.blocked_defaults?.forecast_probability!==null||data?.real_creator_samples?.length!==0||Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Invented observed income or probability');
 return {valid:errors.length===0,errors};
}
