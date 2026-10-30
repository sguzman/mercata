// Date-span arithmetic for synthetic examples of short, developer-opt-in reporting.
// Source labels are not independent authentication of partner transactions.
const validDate=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const count=x=>Number.isSafeInteger(x)&&x>=0;
export function auditSyntheticVerifiedReportingWindows(x){
 const allowed=['fixture_id','windows','full_merchant_history_verified','matched_complete_paid_launch_frame'];
 const windowKeys=['id','first_date','last_date','reported_days'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!allowed.includes(k))||
 typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id)||
 x.full_merchant_history_verified!==false||x.matched_complete_paid_launch_frame!==false||
 !Array.isArray(x.windows)||x.windows.length<1||x.windows.length>20)
  throw new TypeError('Only synthetic partial-window report aggregates accepted');
 const seen=new Set(),windows=x.windows.map(w=>{
  if(!w||typeof w!=='object'||Array.isArray(w)||
   Object.keys(w).some(k=>!windowKeys.includes(k))||
   typeof w.id!=='string'||!/^fixture-[a-z0-9-]+$/.test(w.id)||seen.has(w.id)||
   !validDate(w.first_date)||!validDate(w.last_date)||w.first_date>w.last_date||
   !count(w.reported_days)||w.reported_days<1)
   throw new TypeError('Invalid labelled synthetic report window');
  seen.add(w.id);
  const span=(Date.parse(w.last_date+'T00:00:00Z')-Date.parse(w.first_date+'T00:00:00Z'))/86400000+1;
  if(w.reported_days>span)throw new RangeError('Observed reporting days exceed calendar span');
  return {id:w.id,reported_days:w.reported_days,inclusive_calendar_span_days:span,
   unreported_calendar_days_in_span:span-w.reported_days,
   unreported_calendar_day_revenue_usd:null,complete_firstyear_revenue_usd:null};
 });
 return {reported_window_count:windows.length,windows,
  an_operator_verified_badge_is_an_independent_account_audit:false,
  verified_account_lifetime_revenue_usd:null,
  actual_legal_publisher_bank_deposits_usd:null,
  representative_median_paid_game_revenue_usd:null,
  exact_zero_paid_sale_fraction:null};
}
