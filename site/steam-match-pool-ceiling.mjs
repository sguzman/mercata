// Necessary deterministic matchmaking capacity ceiling for invented pools only.
// NOT an estimate of actual match success, queue time, retention, paid sales or profitability.
export function maxCompatiblePartyCapacity({concurrentPlayers,partySize,pools}={}){
 if(!Number.isSafeInteger(concurrentPlayers)||concurrentPlayers<0)throw new TypeError('concurrentPlayers must be a nonnegative integer');
 if(!Number.isSafeInteger(partySize)||partySize<2||partySize>250)throw new TypeError('partySize must be an integer from 2 to 250');
 if(!Array.isArray(pools)||pools.length>1000)throw new TypeError('Disjoint compatible pools are required');
 const keys=new Set();let readyTotal=0,busyTotal=0,ceiling=0;
 const details=pools.map(pool=>{
  if(!pool||typeof pool.group!=='string'||!/^[A-Za-z0-9_:-]{1,60}$/.test(pool.group)||keys.has(pool.group))throw new TypeError('Unique anonymous pool identifier required');
  keys.add(pool.group);
  for(const x of ['ready','busy'])if(!Number.isSafeInteger(pool[x])||pool[x]<0)throw new TypeError('Nonnegative pool counts required');
  readyTotal+=pool.ready;busyTotal+=pool.busy;
  if(!Number.isSafeInteger(readyTotal)||!Number.isSafeInteger(busyTotal))throw new RangeError('Unsafe pool totals');
  const complete=Math.floor(pool.ready/partySize);
  const potentiallyMatched=complete*partySize;
  ceiling+=potentiallyMatched;
  return {group:pool.group,ready:pool.ready,busy:pool.busy,max_complete_parties:complete,optimistic_matchable_players:potentiallyMatched,insufficient_players_at_snapshot:pool.ready<partySize};
 });
 if(readyTotal+busyTotal>concurrentPlayers)throw new RangeError('Pool participants cannot exceed declared concurrency');
 const unclassified=concurrentPlayers-readyTotal-busyTotal;
 return {kind:'synthetic_best_case_partitioned_matchmaking_capacity_not_a_forecast',party_size:partySize,
  current_app_players:concurrentPlayers,ready_in_partitioned_pools:readyTotal,busy_in_partitioned_pools:busyTotal,
  unclassified_app_players:unclassified,upper_bound_simultaneously_groupable_ready_players:ceiling,
  upper_bound_complete_party_count:ceiling/partySize,ready_but_not_groupable_in_any_pool:readyTotal-ceiling,
  fraction_of_all_app_players_groupable_upper_bound:concurrentPlayers?ceiling/concurrentPlayers:null,
  pool_ceiling_details:details,observed_successful_matches:null,observed_queue_time_seconds:null,
  unique_paid_customers:null,paid_revenue:null,hosting_bill_usd:null,developer_profit:null,
  caveat:'All counts must describe a single snapshot with disjoint compatible regions, modes and build versions. A mathematical ceiling does not guarantee sessions; global concurrency includes other states and Steam offline play can be omitted.'};
}
