// A synthetic aggregate event timeline, never a private-account report or profit estimator.
function date(s){
 if(typeof s!=='string'|| !/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('ISO date required');
 const d=new Date(s+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw new TypeError('Invalid calendar date');
 return d;
}
export function auditSyntheticWishlistPurchaseCohorts(rows,{reportAsOf}={}){
 if(!Array.isArray(rows)||rows.length>10000)throw new TypeError('Aggregate rows required');
 const cutoff=date(reportAsOf),max=new Date(cutoff.getTime()-86400000);
 const groups=new Map();let total=0;
 for(const row of rows){
  if(!row||typeof row!=='object'||['steamid','steam_id','account_id','customer_id'].some(k=>k in row))throw new TypeError('Account identities forbidden');
  const purchase=date(row.DateLocal),month=date(row.MonthCohort);
  if(month.getUTCDate()!==1)throw new TypeError('MonthCohort must be first day');
  if(month>purchase)throw new RangeError('Purchase precedes wishlist cohort');
  if(purchase>max)throw new RangeError('Today/future not yet reported');
  if(!Number.isSafeInteger(row.wishlist_purchase_events)||row.wishlist_purchase_events<0)throw new TypeError('Nonnegative aggregate count required');
  const age=(purchase.getUTCFullYear()-month.getUTCFullYear())*12+purchase.getUTCMonth()-month.getUTCMonth();
  const key=row.MonthCohort+'|'+age;
  const g=groups.get(key)||{wishlist_month:row.MonthCohort,months_since_wishlist_month:age,purchase_events:0};
  g.purchase_events+=row.wishlist_purchase_events;
  if(!Number.isSafeInteger(g.purchase_events))throw new RangeError('Unsafe cohort sum');
  groups.set(key,g);total+=row.wishlist_purchase_events;
  if(!Number.isSafeInteger(total))throw new RangeError('Unsafe total');
 }
 return {kind:'synthetic_purchase_event_timeline',as_of:reportAsOf,latest_included:max.toISOString().slice(0,10),
  total_wishlist_purchase_events:total,
  cohorts:[...groups.values()].sort((a,b)=>a.wishlist_month.localeCompare(b.wishlist_month)||a.months_since_wishlist_month-b.months_since_wishlist_month),
  original_at_risk_wishlisters:null,unique_paid_buyers:null,wishlist_purchase_probability:null,
  demo_to_paid_conversion:null,playtest_to_paid_conversion:null,causal_paid_orders:null,publisher_profit:null,
  caveat:'Coarse purchase events without an eligible cohort denominator, true paid checkout reconciliation or causal design.'};
}
