// Aggregate only invented direct Steam-API CCU readings; no scraping, accounts or prices.
const date=(s)=>{
 if(typeof s!=='string'||!new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$').test(s))throw new TypeError('Valid UTC snapshot timestamp required');
 const ms=Date.parse(s);
 if(!Number.isFinite(ms)||new Date(ms).toISOString().replace('.000','')!==s)throw new TypeError('Invalid snapshot timestamp');
 return ms;
};
export function auditSyntheticSteamDbCcu({samples,declaredPollMinutes=10,advanceAccessUnobservable=false}={}){
 if(!Array.isArray(samples)||samples.length===0)throw new TypeError('Nonempty synthetic CCU samples required');
 if(![5,10].includes(declaredPollMinutes))throw new TypeError('Officially described poll period must be five or ten minutes');
 if(typeof advanceAccessUnobservable!=='boolean')throw new TypeError('Advance Access coverage flag must be boolean');
 let prev=-Infinity,max=0,largestGap=0;
 for(const row of samples){
  if(!row||typeof row.fixture_id!=='string'||!new RegExp('^fixture-[a-z0-9-]+$').test(row.fixture_id))throw new TypeError('Only synthetic fixture IDs allowed');
  const now=date(row.at_utc);
  if(now<=prev)throw new RangeError('Samples must be strictly time ordered');
  if(!Number.isSafeInteger(row.concurrent_players)||row.concurrent_players<0)throw new TypeError('Invalid concurrent player count');
  if(prev!==-Infinity)largestGap=Math.max(largestGap,(now-prev)/60000);
  prev=now;max=Math.max(max,row.concurrent_players);
 }
 return {observed_samples:samples.length,declared_poll_minutes:declaredPollMinutes,observed_snapshot_max:max,
  maximum_sample_gap_minutes:largestGap,observed_gap_exceeds_declared_poll:largestGap>declaredPollMinutes,
  advance_access_coverage_attested:!advanceAccessUnobservable,
  true_continuous_time_peak:null,unique_players:null,actual_paid_orders:null,net_revenue_usd:null,developer_profit_usd:null,
  note:'CCU readings are snapshots, not a guaranteed continuous maximum, ownership, unique buyers or paid game sales.'};
}
