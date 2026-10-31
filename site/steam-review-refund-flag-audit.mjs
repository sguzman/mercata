// Only fictional aggregate review-flag counts; never raw reviews, IDs, keys or financial records.
import {auditSyntheticSteamReviewQueryCoverage} from './steam-review-api-query-scope-guard.mjs';
const object=(x,fields)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>fields.includes(k));
const count=x=>Number.isSafeInteger(x)&&x>=0&&x<=0xffffffff;
const sum=(x,y)=>{const n=x+y;if(!Number.isSafeInteger(n))throw new RangeError('Unsafe aggregate review count');return n;};
export function auditSyntheticSteamReviewRefundFlags(input={}){
 if(!object(input,['fixture_id','query','flag_pages'])||
   typeof input.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id)||
   !object(input.query,['fixture_id','request','pages'])||
   input.query.fixture_id!==input.fixture_id||!Array.isArray(input.flag_pages))
  throw new TypeError('Only bounded fictional aggregate review inputs are allowed');
 const query=auditSyntheticSteamReviewQueryCoverage(input.query);
 if(input.flag_pages.length!==input.query.pages.length)
  throw new RangeError('Refund-flag pages must match the query page chain');
 let yes=0,no=0,unknown=0;
 for(let i=0;i<input.flag_pages.length;i++){
  const row=input.flag_pages[i],page=input.query.pages[i];
  if(!object(row,['cursor_in','refunded_true','refunded_false','refunded_unobserved'])||
    row.cursor_in!==page.cursor_in||
    !count(row.refunded_true)||!count(row.refunded_false)||!count(row.refunded_unobserved)||
    row.refunded_true+row.refunded_false+row.refunded_unobserved!==page.num_reviews)
   throw new TypeError('Review refund flag totals must reconcile to fictional page counts');
  yes=sum(yes,row.refunded_true);no=sum(no,row.refunded_false);
  unknown=sum(unknown,row.refunded_unobserved);
 }
 const total=sum(sum(yes,no),unknown);
 if(total!==query.observed_review_rows_in_fixture)
  throw new RangeError('Review flag totals do not reconcile with query');
 const full=query.all_origin_all_language_query_chain_candidate;
 return Object.freeze({
  kind:'synthetic_review_author_refund_flag_not_purchase_refund_rate',
  fixture_id:input.fixture_id,observed_review_rows_in_fixture:total,
  refunded_true_review_rows:yes,refunded_false_review_rows:no,
  unobserved_refund_flag_review_rows:unknown,
  checked_review_flag_fraction_lower:total?yes/total:null,
  checked_review_flag_fraction_upper:total?(yes+unknown)/total:null,
  complete_review_query_candidate:full,
  complete_review_flags_in_fixture:unknown===0,
  synthetic_complete_review_flag_fraction:full&&unknown===0&&total>0?yes/total:null,
  nonreviewing_paid_customers_observed:false,
  actual_refunded_paid_orders:null,
  actual_paid_order_refund_rate:null,
  matched_original_purchase_cohort_refund_rate:null,
  publisher_refund_loss_usd:null,
  developer_net_profit:null,
  actual_steam_review_author_flag_fraction:null,
  live_steam_api_called:false,individual_review_records_processed:false,
  caveat:'Invented review-author flags are selected review observations, not transaction or payout events. Missing flags are unknown; absent reviews do not imply no refunds. Even a reconciled full-scope fictional review query cannot establish actual purchase cohort refunds.'
 });
}
