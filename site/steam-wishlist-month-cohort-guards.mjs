// Synthetic aggregation over Valve's documented Wishlist Reporting CSV calendar fields.
// No partner data, Steam IDs, precise first-add dates, or verified paid-order records.
const DAY=86400000;
const validDate=s=>{
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('Invalid Pacific-time calendar date');
 const ms=Date.parse(s+'T00:00:00.000Z');
 if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==s)throw new TypeError('Invalid Pacific-time calendar date');
 return ms;
};
const iso=ms=>new Date(ms).toISOString().slice(0,10);
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const allowed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
export function auditSyntheticSteamWishlistMonthCohorts({as_of_pacific_date,game_id,rows}={}){
 const now=validDate(as_of_pacific_date);
 if(typeof game_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(game_id)||
  !Array.isArray(rows)||rows.length>200)throw new TypeError('Synthetic game and bounded rows required');
 const latest=now-DAY,seen=new Set(),byCohort=new Map(),out=[];let total=0;
 for(const row of rows){
  if(!allowed(row,['fixture_id','purchase_date_local_pt','month_cohort','wishlist_purchase_events'])||
   typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))
   throw new TypeError('Synthetic aggregate rows only');
  const purchased=validDate(row.purchase_date_local_pt),month=validDate(row.month_cohort);
  if(row.month_cohort.slice(8)!=='01'||month>purchased)
   throw new RangeError('Wishlist MonthCohort must begin on first day of month on or before purchase');
  if(purchased>=now)throw new RangeError('Current day and future wishlist reports are not complete');
  if(!natural(row.wishlist_purchase_events))throw new TypeError('Safe nonnegative purchase event counts required');
  const key=row.purchase_date_local_pt+'|'+row.month_cohort;
  if(seen.has(key))throw new RangeError('Repeated cohort and purchase-day row would double count');
  seen.add(key);
  total+=row.wishlist_purchase_events;
  if(!Number.isSafeInteger(total))throw new RangeError('Unsafe total purchase events');
  byCohort.set(row.month_cohort,(byCohort.get(row.month_cohort)||0)+row.wishlist_purchase_events);
  if(!Number.isSafeInteger(byCohort.get(row.month_cohort)))throw new RangeError('Unsafe cohort total');
  const first=month,lastPossible=Math.min(purchased,Date.UTC(new Date(month).getUTCFullYear(),new Date(month).getUTCMonth()+1,0));
  out.push({fixture_id:row.fixture_id,purchase_date_local_pt:row.purchase_date_local_pt,
   wishlist_add_month:row.month_cohort,purchase_events:row.wishlist_purchase_events,
   earliest_possible_first_add_date:iso(first),latest_possible_first_add_date:iso(lastPossible),
   minimum_calendar_day_lag:(purchased-lastPossible)/DAY,maximum_calendar_day_lag:(purchased-first)/DAY});
 }
 return {kind:'synthetic_wishlist_csv_cohort_calendar_bounds_not_purchase_conversion',
  as_of_pacific_date,latest_complete_report_day:iso(latest),
  rows:out,total_reported_wishlist_purchase_events:total,
  purchase_events_by_original_add_month:[...byCohort].sort(([a],[b])=>a.localeCompare(b)).map(([month_cohort,purchase_events])=>({month_cohort,purchase_events})),
  monthly_cohort_is_exact_first_add_day:false,
  original_wishlister_denominator_available:false,reported_wishlist_purchases_are_all_paid_orders:false,
  platform_preference_subsets_are_whole_population:false,
  matched_wishlist_purchase_probability:null,all_game_paid_orders:null,net_after_refunds:null,
  actual_steam_wishlist_counts:null,publisher_cash:null,causal_notification_effect:null,
  caveat:'Every row is invented. MonthCohort marks the first wishlist-add month, not a day. DateLocal is Pacific-time purchase date; the most recent as-of day is not reported. Source data do not provide verified complete cohort denominators, unique cross-game buyers or merchant cash.'};
}
