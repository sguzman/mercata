// This pure audit handles synthetic or separately owner-authorized aggregates.
// It never collects user identifiers or treats event rates as unique-human conversions.
const EVENT_UNITS=Object.freeze({
 impression:'project_impression_event',
 page_view:'project_page_view_event',
 checkout_start:'positive_price_checkout_attempt',
 paid_order:'completed_positive_price_game_order',
 refund:'refunded_positive_price_game_order'
});
const CHANNELS=new Set(['internal_search','internal_browse','external_search','external_social','external_press','permissioned_email','paid_campaign','verified_direct','unattributed']);
const isCount=n=>Number.isSafeInteger(n)&&n>=0;
// Reject impossible calendar dates; Date.parse alone rolls February 30 into March.
const utc=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x)&&Number.isFinite(Date.parse(x))&&new Date(Date.parse(x)).toISOString()===x.replace('Z','.000Z');
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export function auditMatchedItchFunnel(report){
 if(!report||typeof report!=='object'||!Array.isArray(report.rows))throw new TypeError('Require one aggregate funnel report and event rows');
 if(report.owner_authorized!==true||report.aggregated_only!==true||report.research_redistribution_allowed!==true)throw new Error('Owner authorization, aggregate scope and research permission required');
 if(report.same_attribution_cohort_verified!==true)throw new Error('Identical source-cohort attribution across event stages must be verified');
 if(!Number.isSafeInteger(report.attribution_lag_days)||report.attribution_lag_days<0||report.attribution_lag_days>365)throw new TypeError('Declared order attribution horizon required');
 const problems=[],seen=new Set(),totals={};
 const keys=['project_id','release_id','offer_id','channel','window_start_utc','window_end_utc','attribution_method'];
 let reference=null;
 for(const [index,row] of report.rows.entries()){
  if(!row||typeof row!=='object'||!Object.hasOwn(EVENT_UNITS,row.event)||row.unit!==EVENT_UNITS[row.event]||!isCount(row.count)){
   problems.push('Invalid event, unit or count at row '+index);continue;
  }
  if(!keys.every(k=>nonempty(row[k]))||!CHANNELS.has(row.channel)||!utc(row.window_start_utc)||!utc(row.window_end_utc)||
     Date.parse(row.window_end_utc)<=Date.parse(row.window_start_utc)){
   problems.push('Missing project, offer, attribution or valid aligned UTC window at row '+index);continue;
  }
  if(row.attribution_method!=='owner_verified_common_cohort'){
   problems.push('Unverified impression to order attribution at row '+index);continue;
  }
  if(reference && keys.some(k=>row[k]!==reference[k])){
   problems.push('Unmatched event cohort or observation interval at row '+index);continue;
  }
  if(seen.has(row.event)){problems.push('Duplicate metric stage '+row.event);continue;}
  reference=reference??row;
  seen.add(row.event);
  totals[row.event]=row.count;
 }
 for(const e of Object.keys(EVENT_UNITS))if(!seen.has(e))problems.push('Missing required metric: '+e);
 if(problems.length===0&&totals.refund>totals.paid_order)problems.push('Refunds exceed completed positive-price orders');
 if(problems.length===0&&report.rows.length!==Object.keys(EVENT_UNITS).length)problems.push('Unexpected extra event rows');
 const valid=problems.length===0;
 if(!valid)return {valid:false,issues:problems,aligned_event_totals:null,
  retained_positive_price_orders:null,page_view_event_rate:null,checkout_to_order_event_rate:null,
  unique_paying_buyers:null,customer_conversion_probability:null,incremental_sales_lift:null,representative_income:null};
 const retained=totals.paid_order-totals.refund;
 return {valid:true,issues:[],project_id:reference.project_id,release_id:reference.release_id,offer_id:reference.offer_id,
  attribution_channel:reference.channel,window_start_utc:reference.window_start_utc,window_end_utc:reference.window_end_utc,
  lag_window_days:report.attribution_lag_days,aligned_event_totals:totals,retained_positive_price_orders:retained,
  paid_order_events_per_page_view:totals.page_view>0?retained/totals.page_view:null,
  paid_order_events_per_checkout_start:totals.checkout_start>0?retained/totals.checkout_start:null,
  impression_to_page_view_event_rate:totals.impression>0?totals.page_view/totals.impression:null,
  page_view_event_rate:totals.impression>0?totals.page_view/totals.impression:null,
  checkout_to_order_event_rate:totals.checkout_start>0?retained/totals.checkout_start:null,
  unique_paying_buyers:null,customer_conversion_probability:null,incremental_sales_lift:null,representative_income:null,
  real_source_data_authenticated:false,
  note:'Caller-authorized, same-cohort descriptive event ratios; no unique buyers, causal claims or population extrapolation.'};
}
