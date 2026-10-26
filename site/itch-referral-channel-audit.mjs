const CLASSES=new Set(['internal_search','internal_browse_or_recommendation','external_search','external_social_or_forum','external_press_or_influencer','verified_direct','unattributed']);
const UNITS=new Set(['project_referral_view_event','purchase_referrer_event']);
function safeInt(n){return Number.isSafeInteger(n)&&n>=0;}
export function auditItchReferralChannels(input){
 if(!input||typeof input!=='object'||!Array.isArray(input.rows))throw new TypeError('Aggregate rows are required');
 const issues=[],totalByUnit={project_referral_view_event:0,purchase_referrer_event:0};
 const perChannel={}, seen=new Set();
 for(const x of input.rows){
  if(!x||!CLASSES.has(x.channel)||!UNITS.has(x.unit)||!safeInt(x.count)){issues.push('Invalid channel, measurement unit or count');continue;}
  if(typeof x.period!=='string'||!/^[0-9]{4}-[0-9]{2}$/.test(x.period)){issues.push('Month window must be YYYY-MM');continue;}
  if(typeof x.project_id!=='string'||!x.project_id.trim()){issues.push('Project identifier required');continue;}
  if(x.channel!=='unattributed'&&x.evidence_verified!==true){issues.push('Specific channel cannot be declared from unknown or unverified referrer');continue;}
  if(x.channel==='verified_direct'&&x.independent_direct_verification!==true){issues.push('Missing referrer cannot be labeled verified direct');continue;}
  const key=[x.project_id,x.period,x.unit,x.channel].join('|');
  if(seen.has(key)){issues.push('Duplicate aggregate bucket: '+key);continue;}
  seen.add(key);
  totalByUnit[x.unit]+=x.count;
  const key2=x.unit+':'+x.channel;perChannel[key2]=(perChannel[key2]||0)+x.count;
 }
 const windows=[...new Set(input.rows.filter(x=>x&&typeof x.period==='string').map(x=>x.period))];
 const projects=[...new Set(input.rows.filter(x=>x&&typeof x.project_id==='string').map(x=>x.project_id))];
 if(windows.length>1)issues.push('Different reporting windows cannot be combined as a single aligned source cohort');
 if(projects.length>1)issues.push('Multiple games cannot stand in for one matched population');
 return {valid:issues.length===0,issues,reported_event_counts_by_unit:issues.length===0?totalByUnit:null,reported_event_counts_by_channel:issues.length===0?perChannel:null,
  attributable_unique_visitors:null,unique_paying_customers:null,paid_customer_conversion:null,causal_channel_effect:null,game_profit_usd:null,
  note:'Referral views, click/location labels and purchases have distinct units. No population buyer inference.'};
}
