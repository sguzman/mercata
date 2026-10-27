// Offline matched event-rate comparisons; never equate events with distinct buying people.
const count=x=>Number.isSafeInteger(x)&&x>=0;
const money=x=>typeof x==='number'&&Number.isFinite(x)&&x>0;
// Verify that the ISO date exists instead of accepting silently normalized days.
const day=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(Date.parse(x+'T00:00:00Z')).toISOString().slice(0,10)===x;
const str=x=>typeof x==='string'&&x.trim().length>0;
const ok=r=>r&&str(r.project_id)&&str(r.offer_id)&&str(r.build_id)&&str(r.currency)&&str(r.audience_frame)&&money(r.base_price_usd)&&day(r.start)&&day(r.end)&&r.start<=r.end&&count(r.page_view_events)&&count(r.paid_orders)&&count(r.refunds)&&r.refunds<=r.paid_orders&&count(r.discount_percent)&&r.discount_percent<=100;
export function auditItchDiscountCohorts({baseline,fullPrice,discount,checks}={}){
 const issues=[];
 if(!ok(baseline)||!ok(fullPrice)||!ok(discount))return {valid:false,issues:['Complete valid baseline and campaign aggregate rows required'],causal_discount_effect:null};
 for(const r of [fullPrice,discount]){
  for(const key of ['project_id','offer_id','build_id','currency','audience_frame','base_price_usd'])if(r[key]!==baseline[key])issues.push('Incompatible baseline '+key);
 }
 if(fullPrice.start!==discount.start||fullPrice.end!==discount.end)issues.push('Campaign comparison clock differs');
 if(baseline.end>=fullPrice.start)issues.push('Pre-campaign baseline is not prior');
 if(baseline.discount_percent!==0)issues.push('Pre-campaign baseline must be full price');
 if(fullPrice.discount_percent!==0||discount.discount_percent===0||discount.discount_percent===100)issues.push('Need 0%-price control and positive-price discounted treatment');
 if(!checks||checks.verified_source_attribution!==true||checks.same_refund_definition!==true||checks.same_audience_mix!==true||checks.seller_authorized_aggregates!==true)issues.push('Missing attribution or permission controls');
 const valid=issues.length===0;
 const rate=x=>x.page_view_events?(x.paid_orders-x.refunds)/x.page_view_events:null;
 const a=valid?rate(fullPrice):null,b=valid?rate(discount):null;
 return {valid,issues,baseline_event_order_rate:valid?rate(baseline):null,full_price_event_order_rate:a,discount_event_order_rate:b,
  descriptive_discount_minus_full_price_rate:valid&&a!==null&&b!==null?b-a:null,unique_buyer_conversion:null,
  causal_discount_effect:null,profit_after_full_costs:null,real_source_authenticated:false,
  note:'Aligned self-reported event rates never certify true causal effects or paid-person purchase probabilities.'};
}
