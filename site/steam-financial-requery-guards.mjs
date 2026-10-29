// Synthetic, aggregate-only Steam financial reporting reconciliation. No financial keys or accounts.
const iso=value=>{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const t=new Date(value+'T00:00:00Z');return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===value;
};
const fixture=value=>typeof value==='string'&&/^fixture-[a-z0-9-]+$/.test(value);
const natural=value=>Number.isSafeInteger(value)&&value>=0;
// Valve's gross_units_returned is a signed adjustment (e.g. -2 for two returns).
const signedReturns=value=>Number.isSafeInteger(value)&&value<=0;
// Valve emits both cursor families as 64-bit IDs, often encoded as JSON decimal strings.
// Never coerce a wide decimal marker through Number: that can silently skip pages.
const UINT64_MAX=(1n<<64n)-1n,INT64_MAX=(1n<<63n)-1n;
const marker=(value,limit,label)=>{
 const decimal=typeof value==='number'
  ? (natural(value)?String(value):null)
  : (typeof value==='string'&&/^(0|[1-9][0-9]*)$/.test(value)?value:null);
 if(decimal===null)throw new TypeError('Invalid '+label+' 64-bit decimal marker');
 const parsed=BigInt(decimal);
 if(parsed>limit)throw new RangeError(label+' 64-bit marker exceeds API range');
 return parsed;
};
const dayMarker=value=>marker(value,INT64_MAX,'per-date');
const outerMarker=value=>marker(value,UINT64_MAX,'changed-date');
const safeAdd=(a,b,label)=>{const sum=a+b;if(!Number.isSafeInteger(sum))throw new RangeError('Unsafe accumulated units: '+label);return sum;};
const permitted=(obj,allowed)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>allowed.includes(k));
const kinds=new Set(['steam_package','retail_key_activation','microtransaction']);
const batchKeys=['fixture_batch_id','financial_date_pt','visibility_scope','pages'];
const pageKeys=['requested_highwatermark_id','returned_max_id','rows'];
const rowKeys=['fixture_row_id','kind','gross_units_sold','gross_units_returned','gross_units_activated'];

export function reconcileSyntheticSteamFinancialDays(batches){
 if(!Array.isArray(batches)||!batches.length)throw new TypeError('Nonempty synthetic daily reports required');
 const byDay=new Map(),batchesSeen=new Set();let visibility=null,revisions=0;
 for(const b of batches){
  if(!permitted(b,batchKeys)||!fixture(b.fixture_batch_id)||batchesSeen.has(b.fixture_batch_id))
   throw new TypeError('Unique synthetic batch identifier required');
  batchesSeen.add(b.fixture_batch_id);
  if(!iso(b.financial_date_pt))throw new TypeError('Financial date must be a valid Pacific-time calendar day');
  if(!['own_partner_only','includes_view_grants'].includes(b.visibility_scope))
   throw new TypeError('Explicit financial view-grant scope required');
  if(visibility!==null&&visibility!==b.visibility_scope)throw new RangeError('Incompatible financial visibility scopes');
  visibility=b.visibility_scope;
  if(!Array.isArray(b.pages)||!b.pages.length)throw new TypeError('Every changed date must be fully paginated');
  const observed=new Set(),rows=[];let cursor=0n,cursorOutput=0,ended=false;
  for(let i=0;i<b.pages.length;i++){
   const page=b.pages[i];
   if(!permitted(page,pageKeys)||!Array.isArray(page.rows))
    throw new TypeError('Invalid page, highwatermark or row list');
   const requested=dayMarker(page.requested_highwatermark_id),returned=dayMarker(page.returned_max_id);
   if(requested!==cursor||returned<cursor)
    throw new RangeError('Broken per-date highwatermark pagination');
   if(returned>cursor&&page.rows.length===0)
    throw new RangeError('Advancing per-date page cursor requires at least one returned row');
   for(const row of page.rows){
    if(!permitted(row,rowKeys)||!fixture(row.fixture_row_id)||observed.has(row.fixture_row_id)||!kinds.has(row.kind))
     throw new TypeError('Duplicate, nonfixture or unsupported report row');
    observed.add(row.fixture_row_id);
    if(!natural(row.gross_units_sold)||!signedReturns(row.gross_units_returned)||!natural(row.gross_units_activated))
     throw new TypeError('Sold and activated units must be nonnegative; returned units must be signed nonpositive safe integers');
    if(row.kind==='retail_key_activation'){
     if(row.gross_units_sold!==0||row.gross_units_returned!==0)throw new RangeError('Retail activation is not a Steam checkout');
    }else if(row.gross_units_activated!==0)throw new RangeError('Steam checkout and microtransaction rows cannot be key activations');
    rows.push(row);
   }
   if(returned===cursor){
    if(page.rows.length||i!==b.pages.length-1)throw new RangeError('Terminal cursor must have no rows and end the date');
    ended=true;
   }else if(i===b.pages.length-1)throw new RangeError('Incomplete daily page sequence');
   cursor=returned;cursorOutput=page.returned_max_id;
  }
  if(!ended)throw new RangeError('Missing terminal page');
  // Per Valve, a changed date is fully re-fetched. Its prior rows must be removed, not accumulated.
  if(byDay.has(b.financial_date_pt))revisions++;
  byDay.set(b.financial_date_pt,{financial_date_pt:b.financial_date_pt,
   final_cursor:cursorOutput,fully_paginated:true,revised:batches.filter(x=>x.financial_date_pt===b.financial_date_pt).length>1,rows});
 }
 const days=[...byDay.values()].sort((a,b)=>a.financial_date_pt.localeCompare(b.financial_date_pt));
 const totals={steam_package_gross_units_sold:0,steam_package_period_returns:0,
  steam_package_period_net_units:0,retail_key_units_activated:0,microtransaction_gross_units_sold:0,
  microtransaction_period_returns:0};
 for(const day of days)for(const row of day.rows){
  if(row.kind==='steam_package'){
   totals.steam_package_gross_units_sold=safeAdd(totals.steam_package_gross_units_sold,row.gross_units_sold,'steam sales');
   totals.steam_package_period_returns=safeAdd(totals.steam_package_period_returns,-row.gross_units_returned,'steam returns');
  }else if(row.kind==='retail_key_activation')
   totals.retail_key_units_activated=safeAdd(totals.retail_key_units_activated,row.gross_units_activated,'retail keys');
  else{
   totals.microtransaction_gross_units_sold=safeAdd(totals.microtransaction_gross_units_sold,row.gross_units_sold,'microtransactions');
   totals.microtransaction_period_returns=safeAdd(totals.microtransaction_period_returns,-row.gross_units_returned,'microtransaction returns');
  }
 }
 // Different dates can include returns from earlier purchases; period net may be negative.
 const net=totals.steam_package_gross_units_sold-totals.steam_package_period_returns;
 if(!Number.isSafeInteger(net))throw new RangeError('Unsafe accumulated units: period net');
 totals.steam_package_period_net_units=net;
 return {kind:'synthetic_changed_date_full_replacement_not_merchant_report',financial_date_time_basis:'Pacific Time',
  visibility_scope:visibility,fully_paginated_dates:days.length,processed_changed_date_batches:batches.length,
  replaced_previous_daily_snapshots:revisions,days:days.map(day=>({financial_date_pt:day.financial_date_pt,
   last_full_page_cursor:day.final_cursor,fully_paginated:day.fully_paginated,
   synthetic_rows_after_last_requery:day.rows.length,revised_within_input:day.revised})),
  totals,not_yet_synced_or_unobserved_dates:null,complete_partner_account_history:null,
  full_original_paid_game_cohort_attested:false,
  actual_paid_appid_units:null,actual_zero_sale_fraction:null,actual_developer_net_receipts:null,
  caveat:'Purely fabricated daily aggregates. A full page traversal for a date is not historical partner, AppID, cohort, or payout completeness. No data is independently verified.'};
}

export function auditSyntheticSteamChangedDatePolls(polls){
 if(!Array.isArray(polls)||polls.length===0)throw new TypeError('Nonempty synthetic changed-date polls required');
 const ids=new Set(),counts=new Map();let cursor=0n,cursorOutput=0;
 for(const poll of polls){
  if(!permitted(poll,['fixture_poll_id','input_highwatermark','result_highwatermark','changed_dates_pt'])||
   !fixture(poll.fixture_poll_id)||ids.has(poll.fixture_poll_id))throw new TypeError('Unique synthetic changed-date poll ID required');
  ids.add(poll.fixture_poll_id);
  const inputMarker=outerMarker(poll.input_highwatermark),resultMarker=outerMarker(poll.result_highwatermark);
  if(inputMarker!==cursor||resultMarker<cursor)
   throw new RangeError('Broken changed-date highwatermark chain');
  if(!Array.isArray(poll.changed_dates_pt))throw new TypeError('Changed-date list must be present');
  const local=new Set();
  for(const day of poll.changed_dates_pt){
   if(!iso(day)||local.has(day))throw new TypeError('Unique valid Pacific-time changed date required per poll');
   local.add(day);counts.set(day,(counts.get(day)||0)+1);
  }
  if(cursor===resultMarker&&poll.changed_dates_pt.length>0)
   throw new RangeError('Unchanged marker cannot accompany new changed-date events');
  cursor=resultMarker;cursorOutput=poll.result_highwatermark;
 }
 return {kind:'synthetic_changed_date_incremental_poll_audit',
  number_of_polls:polls.length,unique_changed_dates:counts.size,
  total_changed_date_notifications:[...counts.values()].reduce((a,b)=>a+b,0),
  repeated_date_notifications:[...counts.values()].reduce((a,b)=>a+b-1,0),
  final_changed_date_highwatermark:cursorOutput,
  days_to_fully_requery:[...counts.keys()].sort(),
  repeat_notifications_require_full_date_replacement:true,
  outer_changed_date_marker_interchangeable_with_per_day_page_cursor:false,
  key_or_real_merchant_data_used:false,
  actual_sales_change_distribution:null,
  caveat:'Invented change markers and dates only. Complete per-date page retrieval and prior-period access are independently necessary.'};
}

/**
 * Simulate the commit barrier between changed-date polling and full-day replacement.
 * Events are explicitly invented and chronologically ordered; this is not a live API client.
 * A notification cannot be acknowledged until its complete daily refresh has been linked.
 */
export function auditSyntheticSteamFinancialRefreshLog({polls,batches,events}={}){
 const pollSummary=auditSyntheticSteamChangedDatePolls(polls);
 if(!Array.isArray(batches)||!Array.isArray(events)||events.length===0)
  throw new TypeError('Synthetic batches and nonempty event log required');
 const batchById=new Map();
 for(const batch of batches){
  if(!batch||!fixture(batch.fixture_batch_id)||batchById.has(batch.fixture_batch_id))
   throw new TypeError('Unique synthetic refresh batch ID required');
  batchById.set(batch.fixture_batch_id,batch);
 }
 const allowed={
  poll:['kind','fixture_poll_id'],
  refresh:['kind','fixture_poll_id','fixture_batch_id'],
  checkpoint:['kind','fixture_poll_id','stored_highwatermark']
 };
 let nextPollIndex=0,active=null,committed=0n,committedOutput=0;
 const used=new Set(),ordered=[],checkpoints=[];
 for(const event of events){
  if(!event||!allowed[event.kind]||!permitted(event,allowed[event.kind])||
   !fixture(event.fixture_poll_id))
   throw new TypeError('Invalid or nonfixture financial event');
  if(event.kind==='poll'){
   if(active||nextPollIndex>=polls.length||event.fixture_poll_id!==polls[nextPollIndex].fixture_poll_id)
    throw new RangeError('Poll events must follow committed checkpoint order');
   const poll=polls[nextPollIndex];
   if(outerMarker(poll.input_highwatermark)!==committed)
    throw new RangeError('Poll must begin from the last committed outer highwatermark');
   active={poll,pending:new Set(poll.changed_dates_pt),refreshed:0};
  }else if(event.kind==='refresh'){
   if(!active||event.fixture_poll_id!==active.poll.fixture_poll_id)
    throw new RangeError('Refresh must belong to the current uncommitted poll');
   const batch=batchById.get(event.fixture_batch_id);
   if(!batch||used.has(event.fixture_batch_id))
    throw new RangeError('Every refresh must reference one unused synthetic batch');
   if(!active.pending.has(batch.financial_date_pt))
    throw new RangeError('Refresh date was not notified or was already refreshed in this poll');
   active.pending.delete(batch.financial_date_pt);
   used.add(event.fixture_batch_id);ordered.push(batch);active.refreshed++;
  }else{
   if(!active||event.fixture_poll_id!==active.poll.fixture_poll_id)
    throw new RangeError('Checkpoint must belong to the active poll');
   const savedMarker=outerMarker(event.stored_highwatermark);
   if(active.pending.size)
    throw new RangeError('Cannot checkpoint before every notified day is refreshed');
   if(savedMarker!==outerMarker(active.poll.result_highwatermark))
    throw new RangeError('Checkpoint must store the polled result highwatermark');
   committed=savedMarker;committedOutput=event.stored_highwatermark;
   checkpoints.push({fixture_poll_id:active.poll.fixture_poll_id,
    refreshed_dates:active.refreshed,stored_highwatermark:committedOutput});
   active=null;nextPollIndex++;
  }
 }
 if(active||nextPollIndex!==polls.length)
  throw new RangeError('Every poll must finish with a checkpoint');
 if(used.size!==batchById.size)
  throw new RangeError('Unlinked synthetic batch cannot establish a complete refresh log');
 // Ordered by declared poll events, not input-array order, so later corrections replace earlier days.
 const reconciled=ordered.length?reconcileSyntheticSteamFinancialDays(ordered):null;
 return {kind:'synthetic_change_poll_refresh_and_checkpoint_integrity_not_merchant_report',
  polls_committed:nextPollIndex,
  changed_date_notifications:pollSummary.total_changed_date_notifications,
  fully_refreshed_notifications:ordered.length,
  final_committed_outer_highwatermark:committedOutput,
  checkpoints,reconciled,
  actual_checkpoint_write_durability:null,actual_partner_coverage:null,
  actual_paid_game_zero_fraction:null,
  limitation:'A fabricated sequential event log tests the refresh-before-checkpoint invariant; it does not prove live ordering, atomic writes, merchant access or historical cohort completeness.'};
}
