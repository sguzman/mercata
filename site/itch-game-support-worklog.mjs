const categories=new Set(['bug_reproduce','bug_fix','compatibility_regression','save_data_migration','security_dependency_update','platform_packaging','accessibility_regression','buyer_support','release_upload_qa']);
const platforms=new Set(['linux','windows','macos','html5_desktop','html5_mobile']);
const required=['event_id','project_version','platform','category','minutes','issue_id','source_of_report','reported_at_utc','resolution_status'];
const utc=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x)&&!Number.isNaN(Date.parse(x));
export function auditItchGameSupportWorklog(events){
 if(!Array.isArray(events))throw new TypeError('Maintenance event array required');
 const seen=new Set(),errors=[],platformMinutes={},categoryMinutes={};
 let total=0;
 for(const [i,e] of events.entries()){
  if(!e||typeof e!=='object'){errors.push('Invalid event at index '+i);continue;}
  if(required.some(k=>e[k]===null||e[k]===undefined||e[k]==='')){errors.push('Missing required entry at index '+i);continue;}
  if(seen.has(e.event_id)){errors.push('Duplicate work event '+e.event_id);continue;}
  seen.add(e.event_id);
  if(!categories.has(e.category)||!platforms.has(e.platform)||!Number.isSafeInteger(e.minutes)||e.minutes<0||!utc(e.reported_at_utc)){
   errors.push('Invalid category/platform/minutes/timestamp at '+i);continue;
  }
  total+=e.minutes;
  categoryMinutes[e.category]=(categoryMinutes[e.category]||0)+e.minutes;
  platformMinutes[e.platform]=(platformMinutes[e.platform]||0)+e.minutes;
 }
 const valid=errors.length===0;
 return {valid,errors,log_records:events.length,logged_minutes:valid?total:null,logged_hours:valid?total/60:null,
  category_minutes:valid?categoryMinutes:null,platform_minutes:valid?platformMinutes:null,
  representative_market_maintenance_hours:null,profit_after_labor:null,unique_paid_buyers:null,
  audit_scope:'Input-specific descriptive work hours only; no real games or seller data are accessed'};
}
