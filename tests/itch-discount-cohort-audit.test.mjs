import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchDiscountCohorts} from '../site/itch-discount-cohort-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const baseline={project_id:'example',offer_id:'paid',build_id:'v1',currency:'USD',audience_frame:'consistent',base_price_usd:10,start:'2026-09-01',end:'2026-09-07',page_view_events:100,paid_orders:5,refunds:1,discount_percent:0};
const a={...baseline,start:'2026-10-01',end:'2026-10-07',paid_orders:4,refunds:0};
const b={...a,discount_percent:20,paid_orders:6,refunds:1};
const checks={verified_source_attribution:true,same_refund_definition:true,same_audience_mix:true,seller_authorized_aggregates:true};
test('Synthetic same-clock baseline discount comparison reports event rates without causality',()=>{
 const r=auditItchDiscountCohorts({baseline,fullPrice:a,discount:b,checks});
 assert.equal(r.valid,true);assert.equal(r.baseline_event_order_rate,0.04);assert.equal(r.discount_event_order_rate,0.05);assert.equal(r.causal_discount_effect,null);
});
test('Discount cohort rejects free checkout, audience mismatch and late baseline',()=>{
 assert.equal(auditItchDiscountCohorts({baseline,fullPrice:a,discount:{...b,discount_percent:100},checks}).valid,false);
 assert.equal(auditItchDiscountCohorts({baseline,fullPrice:a,discount:{...b,audience_frame:'other'},checks}).valid,false);
 assert.equal(auditItchDiscountCohorts({baseline:{...baseline,end:'2026-10-05'},fullPrice:a,discount:b,checks}).valid,false);
 assert.equal(auditItchDiscountCohorts({baseline,fullPrice:a,discount:b,checks:{...checks,seller_authorized_aggregates:false}}).valid,false);
});
test('Discount controls accepted as documentation, without real seller outcomes',()=>{
 const x=get('ontology/itch-io/discount-cohort-bounded-comparison-2026.json'),s=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 const known=new Set(s.evidence.map(v=>v.id));assert(x.source_ids.every(v=>known.has(v)));
 assert.equal(x.observed.real_campaigns,0);assert.equal(x.observed.verified_paid_order_effect,null);
 const task=p.detail_tasks.find(x=>x.id==='itch-io/sales/study-discount-conversion');
 assert.equal(task.percent,100);assert.equal(task.status,'complete');
 for(const f of ['ontology/itch-io/discount-cohort-bounded-comparison-2026.json','ontology/itch-io/discount-cohort-bounded-comparison-2026.md','site/itch-discount-cohort-audit.mjs','tests/itch-discount-cohort-audit.test.mjs'])assert(task.evidence.includes(f));
});

test('Discount cohorts reject impossible calendar days instead of silently rolling them forward',()=>{
 const weirdCampaign={...a,start:'2026-02-30',end:'2026-03-07'};
 const weirdDiscount={...b,start:'2026-02-30',end:'2026-03-07'};
 const olderBaseline={...baseline,start:'2026-02-20',end:'2026-02-28'};
 const r=auditItchDiscountCohorts({baseline:olderBaseline,fullPrice:weirdCampaign,discount:weirdDiscount,checks});
 assert.equal(r.valid,false);assert.equal(r.causal_discount_effect,null);
 for(const date of ['2026-02-29','2026-04-31','2026-13-01']){
  const result=auditItchDiscountCohorts({baseline:{...baseline,start:date},fullPrice:a,discount:b,checks});
  assert.equal(result.valid,false,date);
 }
 const leapBaseline={...baseline,start:'2024-02-29',end:'2024-03-01'};
 assert.equal(auditItchDiscountCohorts({baseline:leapBaseline,fullPrice:a,discount:b,checks}).valid,true);
});
