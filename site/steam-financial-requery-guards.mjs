// Synthetic, aggregate-only Steam financial reporting reconciliation. No financial keys or accounts.
const iso=value=>{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const t=new Date(value+'T00:00:00Z');return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===value;
};
const fixture=value=>typeof value==='string'&&/^fixture-[a-z0-9-]+$/.test(value);
const natural=value=>Number.isSafeInteger(value)&&value>=0;
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
  const observed=new Set(),rows=[];let cursor=0,ended=false;
  for(let i=0;i<b.pages.length;i++){
   const page=b.pages[i];
   if(!permitted(page,pageKeys)||!natural(page.requested_highwatermark_id)||!natural(page.returned_max_id)||!Array.isArray(page.rows))
    throw new TypeError('Invalid page, highwatermark or row list');
   if(page.requested_highwatermark_id!==cursor||page.returned_max_id<cursor)
    throw new RangeError('Broken per-date highwatermark pagination');
   for(const row of page.rows){
    if(!permitted(row,rowKeys)||!fixture(row.fixture_row_id)||observed.has(row.fixture_row_id)||!kinds.has(row.kind))
     throw new TypeError('Duplicate, nonfixture or unsupported report row');
    observed.add(row.fixture_row_id);
    if(!natural(row.gross_units_sold)||!natural(row.gross_units_returned)||!natural(row.gross_units_activated))
     throw new TypeError('All aggregate units must be nonnegative safe integers');
    if(row.kind==='retail_key_activation'){
     if(row.gross_units_sold!==0||row.gross_units_returned!==0)throw new RangeError('Retail activation is not a Steam checkout');
    }else if(row.gross_units_activated!==0)throw new RangeError('Steam checkout and microtransaction rows cannot be key activations');
    rows.push(row);
   }
   if(page.returned_max_id===cursor){
    if(page.rows.length||i!==b.pages.length-1)throw new RangeError('Terminal cursor must have no rows and end the date');
    ended=true;
   }else if(i===b.pages.length-1)throw new RangeError('Incomplete daily page sequence');
   cursor=page.returned_max_id;
  }
  if(!ended)throw new RangeError('Missing terminal page');
  // Per Valve, a changed date is fully re-fetched. Its prior rows must be removed, not accumulated.
  if(byDay.has(b.financial_date_pt))revisions++;
  byDay.set(b.financial_date_pt,{financial_date_pt:b.financial_date_pt,
   final_cursor:cursor,fully_paginated:true,revised:batches.filter(x=>x.financial_date_pt===b.financial_date_pt).length>1,rows});
 }
 const days=[...byDay.values()].sort((a,b)=>a.financial_date_pt.localeCompare(b.financial_date_pt));
 const totals={steam_package_gross_units_sold:0,steam_package_period_returns:0,
  steam_package_period_net_units:0,retail_key_units_activated:0,microtransaction_gross_units_sold:0,
  microtransaction_period_returns:0};
 for(const day of days)for(const row of day.rows){
  if(row.kind==='steam_package'){
   totals.steam_package_gross_units_sold+=row.gross_units_sold;
   totals.steam_package_period_returns+=row.gross_units_returned;
  }else if(row.kind==='retail_key_activation')totals.retail_key_units_activated+=row.gross_units_activated;
  else{
   totals.microtransaction_gross_units_sold+=row.gross_units_sold;
   totals.microtransaction_period_returns+=row.gross_units_returned;
  }
 }
 // Different dates can include returns from earlier purchases; period net may be negative.
 totals.steam_package_period_net_units=totals.steam_package_gross_units_sold-totals.steam_package_period_returns;
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
 const ids=new Set(),counts=new Map();let cursor=0;
 for(const poll of polls){
  if(!permitted(poll,['fixture_poll_id','input_highwatermark','result_highwatermark','changed_dates_pt'])||
   !fixture(poll.fixture_poll_id)||ids.has(poll.fixture_poll_id))throw new TypeError('Unique synthetic changed-date poll ID required');
  ids.add(poll.fixture_poll_id);
  if(!natural(poll.input_highwatermark)||!natural(poll.result_highwatermark)||poll.input_highwatermark!==cursor||
   poll.result_highwatermark<cursor)throw new RangeError('Broken changed-date highwatermark chain');
  if(!Array.isArray(poll.changed_dates_pt))throw new TypeError('Changed-date list must be present');
  const local=new Set();
  for(const day of poll.changed_dates_pt){
   if(!iso(day)||local.has(day))throw new TypeError('Unique valid Pacific-time changed date required per poll');
   local.add(day);counts.set(day,(counts.get(day)||0)+1);
  }
  if(cursor===poll.result_highwatermark&&poll.changed_dates_pt.length>0)
   throw new RangeError('Unchanged marker cannot accompany new changed-date events');
  cursor=poll.result_highwatermark;
 }
 return {kind:'synthetic_changed_date_incremental_poll_audit',
  number_of_polls:polls.length,unique_changed_dates:counts.size,
  total_changed_date_notifications:[...counts.values()].reduce((a,b)=>a+b,0),
  repeated_date_notifications:[...counts.values()].reduce((a,b)=>a+b-1,0),
  final_changed_date_highwatermark:cursor,
  days_to_fully_requery:[...counts.keys()].sort(),
  repeat_notifications_require_full_date_replacement:true,
  outer_changed_date_marker_interchangeable_with_per_day_page_cursor:false,
  key_or_real_merchant_data_used:false,
  actual_sales_change_distribution:null,
  caveat:'Invented change markers and dates only. Complete per-date page retrieval and prior-period access are independently necessary.'};
}
