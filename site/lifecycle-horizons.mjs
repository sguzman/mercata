// Audience/revenue lifecycle cohort accounting. Operates on authorized, aggregate-safe inputs.
// Passing arithmetic validation does NOT establish probability sampling or causal effects.
export const HORIZONS=Object.freeze([30,90,365]);
const RELEASE_CHANGE='2026-08-24';
const TYPES=['evergreen','trend_or_event'];
const FORMATS=['long_form','shorts','live_replay'];
const dateUTC=s=>{
 if(typeof s!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s))return null;
 const d=new Date(s+'T00:00:00Z');
 return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===s?d:null;
};
const addDay=(start,index)=>new Date(start.getTime()+index*86400000).toISOString().slice(0,10);
const median=xs=>{const a=[...xs].sort((x,y)=>x-y);return a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2;};
export function assessVideoLifecycle(record,{metric='views'}={}){
 const errors=[];
 if(!record||typeof record!=='object')return {status:'invalid',errors:['Missing record'],windows:{}};
 if(!TYPES.includes(record.cohort))errors.push('Predeclared cohort must be evergreen or trend_or_event');
 if(record.predeclared_cohort!==true)errors.push('Cohort classification must be recorded before evaluating observed outcomes');
 if(!FORMATS.includes(record.format))errors.push('Unknown YouTube format');
 if(!['views','estimated_revenue'].includes(metric))errors.push('Invalid measurement type');
 if(!['pre_2026_08_24','post_2026_08_24'].includes(record.view_metric_era))errors.push('View definition era must be specified');
 const published=dateUTC(record.published_at),asOf=dateUTC(record.as_of);
 if(!published||!asOf||asOf<published)errors.push('Invalid publication or snapshot date');
 if(metric==='estimated_revenue'&&(record.authorized_owner_analytics!==true||!(/^[A-Z]{3}$/.test(record.currency||''))))
   errors.push('Owner-authorized revenue and ISO-like three-letter currency required');
 if(record.includes_individual_identifiers===true||record.raw_person_level_rows!==undefined)
   errors.push('Person-level or sensitive records cannot enter the public study');
 if(!Array.isArray(record.daily)||!record.daily.length)errors.push('Daily observations required; absent data are not zero');
 const days=new Map();
 for(const row of Array.isArray(record.daily)?record.daily:[]){
   if(!Number.isSafeInteger(row?.age_day)||row.age_day<0||row.age_day>100000||days.has(row.age_day)){
     errors.push('Duplicate/invalid age day');continue;
   }
   const value=metric==='views'?row.views:row.estimated_revenue;
   if(value!==null && value!==undefined && (!Number.isFinite(value) || (metric==='views' && (!Number.isSafeInteger(value)||value<0))))
     errors.push('Invalid observed value for day '+row.age_day);
   days.set(row.age_day,value);
 }
 if(published&&asOf)for(const day of days.keys())if(addDay(published,day)>record.as_of)errors.push('Observation occurs after snapshot date');
 if(errors.length)return {status:'invalid',errors,windows:{}};
 const windows={};
 for(const end of HORIZONS){
   const hasFollowup=addDay(published,end-1)<=record.as_of;
   const breakDay=RELEASE_CHANGE;
   const incompatible=metric==='views' && ((record.view_metric_era==='pre_2026_08_24'&&addDay(published,end-1)>=breakDay)||
       (record.view_metric_era==='post_2026_08_24'&&record.published_at<breakDay));
   const values=[];
   let missing=0;
   for(let day=0;day<end;day++){
     const val=days.get(day);
     if(!days.has(day)||val===null||val===undefined)missing++;
     else values.push(val);
   }
   const status=!hasFollowup?'right_censored':incompatible?'definition_break':missing?'missing_observations':'measured';
   windows[String(end)]={status,value:status==='measured'?values.reduce((a,b)=>a+b,0):null,observed_days:end-missing,required_days:end,missing_days:missing};
 }
 return {status:'valid',errors:[],metric,cohort:record.cohort,format:record.format,currency:metric==='estimated_revenue'?record.currency:null,
   windows,limitations:['Publication-age cumulative totals, not calendar-month estimates','No demographic or population inference','No external sponsorship, costs, taxes or labor included']};
}
export function compareLifecycleCohorts(records,{metric='views',horizon=90}={}){
 if(!HORIZONS.includes(horizon))return {status:'invalid',reason:'Horizon must be 30, 90 or 365',groups:[]};
 if(!Array.isArray(records)||!records.length)return {status:'no_observations',groups:[],reason:'No data supplied; no creator earnings estimate'};
 const checked=records.map(row=>assessVideoLifecycle(row,{metric}));
 if(checked.some(x=>x.status==='invalid'))return {status:'invalid',reason:'Invalid individual cohort observations',groups:[],errors:checked.flatMap(x=>x.errors)};
 const formats=new Set(records.map(x=>x.format));const geos=new Set(records.map(x=>x.geography));
 const currencies=metric==='estimated_revenue'?new Set(records.map(x=>x.currency)):new Set(['not_applicable']);
 if(formats.size!==1||geos.size!==1||currencies.size!==1||[...geos].some(x=>typeof x!=='string'||!x.trim()))
   return {status:'incompatible_cohorts',reason:'Geography, format and reporting currency must be held constant',groups:[]};
 const groups=TYPES.map(cohort=>{
  const positions=records.map((x,i)=>x.cohort===cohort?i:-1).filter(i=>i>=0);
  const measured=positions.map(i=>checked[i].windows[String(horizon)]).filter(x=>x.status==='measured').map(x=>x.value);
  const rightCensored=positions.filter(i=>checked[i].windows[String(horizon)].status==='right_censored').length;
  return {cohort,entry_n:positions.length,observed_n:measured.length,right_censored_n:rightCensored,
    incomplete_or_incompatible_n:positions.length-measured.length-rightCensored,
    sample_median:measured.length?median(measured):null,sample_mean:measured.length?measured.reduce((a,b)=>a+b,0)/measured.length:null,
    observed_zero_n:measured.filter(x=>x===0).length};
 });
 return {status:'descriptive_only',metric,horizon,format:[...formats][0],geography:[...geos][0],
   currency:metric==='estimated_revenue'?[...currencies][0]:null,groups,
   limitations:['Descriptive observed sample only, not a probability cohort','Missing and right-censored participants remain in enrollment denominators','No causal evergreen advantage or creator profit inferred']};
}
