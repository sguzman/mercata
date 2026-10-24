// Creator-owned schedule audit. This validates civil times and comparable units;
// it does NOT estimate optimal upload time or establish a causal viewership effect.
const pad=n=>String(n).padStart(2,'0');

export function resolvePublishInstant({local_date,local_clock,time_zone,release_utc=null}={}) {
  const errors=[];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(local_date||'')||!/^\d{2}:\d{2}$/.test(local_clock||''))
    errors.push('Valid local date YYYY-MM-DD and HH:mm required');
  let formatter=null;
  try {
    formatter=new Intl.DateTimeFormat('en-US',{
      timeZone:time_zone,year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',hourCycle:'h23'
    });
  }catch { errors.push('Recognized IANA time zone required'); }
  if(errors.length)return {status:'invalid',utc_instant:null,candidates:[],errors};
  const year=Number(local_date.slice(0,4)),month=Number(local_date.slice(5,7)),day=Number(local_date.slice(8,10));
  const hour=Number(local_clock.slice(0,2)),minute=Number(local_clock.slice(3,5));
  const baseline=Date.UTC(year,month-1,day,hour,minute);
  const round=new Date(baseline);
  if(round.getUTCFullYear()!==year||round.getUTCMonth()!==month-1||
    round.getUTCDate()!==day||round.getUTCHours()!==hour||round.getUTCMinutes()!==minute)
    return {status:'invalid',utc_instant:null,candidates:[],errors:['Invalid civil calendar date or clock time']};
  const expected=local_date+' '+local_clock;
  const getLocal=ms=>{
    const fields=Object.fromEntries(formatter.formatToParts(new Date(ms)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    return fields.year+'-'+fields.month+'-'+fields.day+' '+fields.hour+':'+fields.minute;
  };
  const candidates=[];
  // All civil UTC offsets are between -12:00 and +14:00; quarter hours cover
  // published time zones. Search a wider symmetric 14-hour window for both folds.
  for(let offset=-14*60;offset<=14*60;offset+=15){
    const instant=baseline-offset*60000;
    if(getLocal(instant)===expected)candidates.push(new Date(instant).toISOString());
  }
  if(candidates.length===0)return {status:'nonexistent_local_time',utc_instant:null,candidates,errors:['Clock time does not occur in this time zone (possible DST gap)']};
  if(release_utc!==null){
    const isZ=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(release_utc);
    if(!isZ||!candidates.some(x=>x===new Date(release_utc).toISOString()))
      return {status:'invalid',utc_instant:null,candidates,errors:['Explicit UTC instant does not match local date/time and zone']};
    return {status:'resolved',utc_instant:new Date(release_utc).toISOString(),candidates,errors:[]};
  }
  if(candidates.length>1)return {status:'ambiguous_local_time',utc_instant:null,candidates,errors:['Repeated clock hour; explicit UTC instant or offset required']};
  return {status:'resolved',utc_instant:candidates[0],candidates,errors:[]};
}

export function auditTimingStudyComparison(a,b){
  const errors=[];
  if(!a||!b)return {descriptively_comparable:false,causal_effect_established:false,errors:['Two observations are required']};
  const keys=['channel_id','format','metric_id','view_definition','reporting_window_hours','country_scope','owner_authorized'];
  for(const key of keys)if(a[key]===undefined||b[key]===undefined||a[key]!==b[key])
    errors.push('Different or absent '+key);
  if(a.owner_authorized!==true||b.owner_authorized!==true)
    errors.push('Channel-owned analytics require documented authorization');
  if(!Number.isFinite(a.value)||!Number.isFinite(b.value)||a.value<0||b.value<0)
    errors.push('Measured nonnegative metric values required');
  if(!a.publish_utc||!b.publish_utc||!/^\d{4}-\d{2}-\d{2}T/.test(a.publish_utc)||!/^\d{4}-\d{2}-\d{2}T/.test(b.publish_utc))
    errors.push('Dated UTC release timestamps are required');
  if(a.geo_rows_suppressed===true||b.geo_rows_suppressed===true)
    errors.push('Geography-suppressed observations cannot be compared as complete country totals');
  return {descriptively_comparable:errors.length===0,causal_effect_established:false,errors};
}
