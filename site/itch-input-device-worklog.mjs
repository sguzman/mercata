// Private or synthetic log input stays in caller memory. Public results never infer marketplace averages.
const DEVICES=new Set(['desktop','laptop','phone','tablet','handheld']);
const INPUTS=new Set(['keyboard_mouse','gamepad','touchscreen']);
const KINDS=new Set(['initial_qa','compatibility_qa','accessibility_qa','support_reproduction','patch_retest']);
const OUTCOMES=new Set(['pass','fail','blocked']);
const validDate=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x)&&!Number.isNaN(Date.parse(x));
export function auditInputDeviceWorklog(records,{usdPerHour=null}={}){
 if(!Array.isArray(records))throw new TypeError('Input effort records array required');
 if(usdPerHour!==null&&!(typeof usdPerHour==='number'&&Number.isFinite(usdPerHour)&&usdPerHour>=0&&usdPerHour<=100000))throw new TypeError('Invalid optional declared hourly labor rate');
 const errors=[],seen=new Set(),byDevice={},byInput={},byKind={};let minutes=0;
 for(let i=0;i<records.length;i++){
  const r=records[i];
  if(!r||typeof r!=='object'||typeof r.session_id!=='string'||!r.session_id.trim()||
     typeof r.build_version!=='string'||!r.build_version.trim()||typeof r.issue_code!=='string'||!r.issue_code.trim()||
     !DEVICES.has(r.device)||!INPUTS.has(r.input)||!KINDS.has(r.kind)||!OUTCOMES.has(r.outcome)||
     !Number.isSafeInteger(r.minutes)||r.minutes<0||!validDate(r.recorded_at_utc)){
   errors.push('Invalid input effort record at '+i);continue;
  }
  if(seen.has(r.session_id)){errors.push('Repeated work session would double count effort: '+r.session_id);continue;}
  seen.add(r.session_id);
  minutes+=r.minutes;
  if(!Number.isSafeInteger(minutes)){errors.push('Accumulated minutes exceed safe integer');continue;}
  byDevice[r.device]=(byDevice[r.device]||0)+r.minutes;
  byInput[r.input]=(byInput[r.input]||0)+r.minutes;
  byKind[r.kind]=(byKind[r.kind]||0)+r.minutes;
 }
 const valid=errors.length===0;const logged=valid&&records.length>0;
 const roundUsd=amount=>Math.round((amount+Number.EPSILON)*100)/100;
 return {valid,errors,record_count:records.length,
  documented_input_minutes:logged?minutes:null,documented_input_hours:logged?minutes/60:null,
  minutes_by_device:logged?byDevice:null,minutes_by_input:logged?byInput:null,minutes_by_work_kind:logged?byKind:null,
  valued_labor_usd:logged&&usdPerHour!==null?roundUsd(minutes/60*usdPerHour):null,
  device_valuation_usd:logged&&usdPerHour!==null?Object.fromEntries(Object.entries(byDevice).map(([d,n])=>[d,roundUsd(n/60*usdPerHour)])):null,
  reported_result_is_market_mean:false,actual_source_authenticity_audited:false,
  representative_device_qa_cost_usd:null,verified_paid_game_customer_count:null,device_caused_sales_lift:null,
  note:'A caller-provided worklog is not a representative itch.io seller sample or device execution certificate.'};
}
