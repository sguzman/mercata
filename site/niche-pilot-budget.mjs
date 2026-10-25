// Predeclared niche experiment accounting. Pure and input-dependent: never invent channel analytics.
const nonNegative=(v,name)=>{
 if(typeof v!=='number'||!Number.isFinite(v)||v<0)throw Error('Missing or negative '+name);
 return v;
};
const whole=(v,name)=>{
 if(!Number.isSafeInteger(v)||v<0)throw Error('Invalid integer '+name);
 return v;
};
const cashKeys=['new_equipment_cash_cents','third_party_assets_cash_cents','contractor_cash_cents','software_cash_cents','network_power_cash_cents','marketing_cash_cents','other_cash_cents'];
const allocKey='allocated_owned_gear_usage_cents';
const hoursKeys=['research','writing','recording','editing','artwork','publishing','moderation','marketing','administration'];
const formats=['short_phone','horizontal_video','live_webcam','live_encoder','multicamera_live'];
const metrics=['impressions','views','engaged_views','eligible_watch_minutes'];
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export function evaluateNichePilot(plan,attempts,{as_of}={}){
 if(!plan||!Array.isArray(attempts)||!validDate(as_of))throw Error('Plan, episodes and explicit as_of date required');
 if(typeof plan.pilot_id!=='string'||!plan.pilot_id.trim()||!plan.topic?.trim()||!formats.includes(plan.format))throw Error('Missing topic or unsupported format');
 if(!/^[A-Z]{3}$/.test(plan.currency||''))throw Error('Explicit ISO currency required');
 if(!validDate(plan.start_date)||!validDate(plan.end_date)||plan.start_date>plan.end_date)throw Error('Invalid scheduled pilot window');
 whole(plan.planned_episodes,'planned_episodes');
 if(plan.planned_episodes<2)throw Error('Minimum two prespecified episode attempts required');
 const cap=whole(plan.maximum_new_cash_cents,'maximum_new_cash_cents');
 const hourCap=nonNegative(plan.maximum_total_labor_hours,'maximum_total_labor_hours');
 if(!Number.isFinite(hourCap)||hourCap<=0)throw Error('Positive labor cap required');
 if(!metrics.includes(plan.primary_metric))throw Error('Unsupported primary exposure metric');
 const minExposure=whole(plan.minimum_eligible_exposures,'minimum_eligible_exposures');
 if(minExposure<=0)throw Error('Positive measured exposure gate required');
 if(attempts.length>plan.planned_episodes)throw Error('More attempts than preregistered episodes');
 const seen=new Set();let newCash=0,allocatedUsage=0,hours=0,complete=0,abandoned=0,validExposureSum=0,measuredAttempts=0;
 for(const a of attempts){
  if(typeof a?.episode_id!=='string'||!a.episode_id.trim()||seen.has(a.episode_id))throw Error('Duplicate or missing episode ID');
  seen.add(a.episode_id);
  if(!['published','abandoned','attempted'].includes(a.status))throw Error('Invalid episode disposition');
  if(!validDate(a.attempt_date)||a.attempt_date<plan.start_date||a.attempt_date>plan.end_date)throw Error('Episode outside preregistered interval');
  const itemCash=cashKeys.reduce((sum,key)=>sum+whole(a[key],key),0);
  const usage=whole(a[allocKey],allocKey);
  const labor=hoursKeys.reduce((sum,key)=>sum+nonNegative(a.hours?.[key],key),0);
  if(!Number.isSafeInteger(itemCash)||!Number.isFinite(labor))throw Error('Pilot accounting overflow');
  newCash+=itemCash;allocatedUsage+=usage;hours+=labor;
  if(a.status==='published')complete++;
  if(a.status==='abandoned')abandoned++;
  if(a.exposures!==null){
   if(a.status!=='published')throw Error('Unpublished episode cannot claim measured video exposure');
   const count=whole(a.exposures,'exposures');
   if(!a.own_analytics_authorized||a.exposure_metric!==plan.primary_metric)throw Error('Unverified or incompatible metric observation');
   validExposureSum+=count;measuredAttempts++;
  }
 }
 if(!Number.isSafeInteger(newCash)||!Number.isSafeInteger(allocatedUsage)||!Number.isSafeInteger(validExposureSum)||!Number.isFinite(hours))
  throw Error('Pilot totals overflow');
 const budgetReached=newCash>=cap;
 const hoursReached=hours>=hourCap;
 const terminal=as_of>plan.end_date||attempts.length===plan.planned_episodes;
 const exposureGateSatisfied=measuredAttempts===complete&&complete>0&&validExposureSum>=minExposure;
 const stopReasons=[];
 if(budgetReached)stopReasons.push('cash_budget_reached');
 if(hoursReached)stopReasons.push('labor_cap_reached');
 if(as_of>plan.end_date)stopReasons.push('predeclared_window_ended');
 if(attempts.length===plan.planned_episodes)stopReasons.push('planned_attempt_count_reached');
 return {
  currency:plan.currency,attempted_episodes:attempts.length,published_episodes:complete,abandoned_episodes:abandoned,
  new_cash_spent_cents:newCash,allocated_owned_gear_use_cents:allocatedUsage,
  cash_plus_allocated_use_cents:newCash+allocatedUsage,labor_hours:hours,
  remaining_new_cash_cents:Math.max(0,cap-newCash),remaining_labor_hours:Math.max(0,hourCap-hours),
  new_cash_overrun_cents:Math.max(0,newCash-cap),labor_overrun_hours:Math.max(0,hours-hourCap),
  evidence_exposure_count:measuredAttempts===complete&&complete>0?validExposureSum:null,
  exposure_gate_satisfied:exposureGateSatisfied,operational_pilot_ended:terminal,
  can_authorize_another_attempt:!terminal&&!budgetReached&&!hoursReached,
  stop_reasons:stopReasons,
  audience_success:null,net_creator_profit:null,causal_uplift:null,representative_success_probability:null,
  kind:'preregistered_owner_entered_pilot_only'
 };
}
