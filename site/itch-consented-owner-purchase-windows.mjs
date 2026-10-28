// Only privacy-reviewed, owner-authorized aggregates are accepted.
// No buyer records, seller IDs, raw CSV contents, tokens or network access.
const W=[7,30,90,365];
const fields=['owner_authorized','aggregated_only','privacy_reviewed','redistribution_allowed',
'first_positive_price_game_verified','other_payment_types_excluded','all_refunds_reconciled',
'monthly_exports_complete','release_utc_day','observation_utc_day','currency','cumulative'];
const rowFields=['horizon_days','captured_orders','refunded_orders','captured_gross_cents','refunded_gross_cents'];
function exactKeys(o,allowed) {
 if(!o||typeof o!=='object'||Array.isArray(o))throw new TypeError('Aggregate object required');
 if(Object.keys(o).some(k=>!allowed.includes(k)))throw new TypeError('Unexpected/identifying input key forbidden');
}
const count=x=>Number.isSafeInteger(x)&&x>=0;
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
export function auditConsentedItchSalesWindows(input){
 exactKeys(input,fields);
 for(const k of fields.slice(0,8))if(input[k]!==true)throw new Error('Authorization and fully classified reconciled source data required: '+k);
 if(!date(input.release_utc_day)||!date(input.observation_utc_day)||input.observation_utc_day<input.release_utc_day)
  throw new RangeError('Valid ordered release and observation UTC dates required');
 if(typeof input.currency!=='string'||!/^[A-Z]{3}$/.test(input.currency))throw new TypeError('One explicit currency required');
 if(!Array.isArray(input.cumulative)||input.cumulative.length!==4)throw new TypeError('Exactly 7/30/90/365 windows required');
 const elapsed=(Date.parse(input.observation_utc_day)-Date.parse(input.release_utc_day))/86400000;
 let previous=null,missing=false;
 const windows=input.cumulative.map((r,i)=>{
  const days=W[i];
  if(r===null){missing=true;return {days,known:false,retained_paid_orders:null,retained_gross_before_fees_cents:null};}
  exactKeys(r,rowFields);
  if(r.horizon_days!==days||rowFields.slice(1).some(k=>!count(r[k])))throw new TypeError('Exact horizon and safe nonnegative integer event/cents required');
  if(missing||days>elapsed)throw new RangeError('Cannot claim a mature cumulative window after missing/immature earlier window');
  if(r.refunded_orders>r.captured_orders||r.refunded_gross_cents>r.captured_gross_cents)throw new RangeError('Impossible refunded quantities');
  if(previous&&rowFields.slice(1).some(k=>r[k]<previous[k]))throw new RangeError('Cumulative gross/order/refund series cannot decrease');
  // Mandatory positive-price captured orders require a positive gross amount; a
  // zero-order period cannot contain gross paid-game receipts.
  if((r.captured_orders===0)!==(r.captured_gross_cents===0))
   throw new RangeError('Captured paid-order counts and positive gross must agree');
  const retainedOrders=r.captured_orders-r.refunded_orders;
  const retainedGross=r.captured_gross_cents-r.refunded_gross_cents;
  // Refunds for the same earlier sale must be attributed to *every* earlier
  // cumulative release-age window under the one common as-of snapshot.
  // A smaller retained later window means the export cohorts were misaligned.
  if(previous&&(retainedOrders<previous.captured_orders-previous.refunded_orders||
    retainedGross<previous.captured_gross_cents-previous.refunded_gross_cents))
   throw new RangeError('Retained cumulative orders and gross cannot decrease at one as-of snapshot');
  previous=r;
  return {days,known:true,retained_paid_orders:retainedOrders,
   retained_gross_before_fees_cents:retainedGross};
 });
 return {currency:input.currency,release_utc_day:input.release_utc_day,observation_utc_day:input.observation_utc_day,
  elapsed_days:elapsed,horizons:windows,raw_transaction_rows_processed:0,
  unique_buyers:null,net_settled_cash_cents:null,developer_profit_cents:null,
  representative_platform_mean:null,representative_platform_median:null,
  note:'Cumulative owner-reviewed order cohorts. Windows overlap and cannot be summed; no marketwide inference.'};
}
