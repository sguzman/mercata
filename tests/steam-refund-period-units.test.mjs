import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {periodRefundRatio} from '../site/steam-refund-period-units.mjs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=j('ontology/steam/refund-reporting-period-versus-purchase-cohort-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('Refunded units from old cohort can exceed current-period purchases',()=>{
 const v=periodRefundRatio({period_purchases:4,period_returned:6});
 assert.equal(v.period_refund_events_over_period_purchases,1.5);
 assert.equal(v.matched_original_purchase_cohort_refund_rate,null);
 assert.equal(v.actual_developer_profit,null);
});
test('No purchases means undefined ratio, not zero or Infinity',()=>{
 const v=periodRefundRatio({period_purchases:0,period_returned:3});
 assert.equal(v.period_refund_events_over_period_purchases,null);
 assert.throws(()=>periodRefundRatio({period_purchases:1,period_returned:-1}),/Invalid period returns/);
});
test('Official reporting source mapped, all 293 tasks remain fixed',()=>{
 assert.equal(x.official_rate.same_purchase_cohort_not_guaranteed,true);
 assert.equal(x.access.individual_notes_collected,false);
 const ss=new Set(d.evidence.map(e=>e.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cc.has(id),id);assert(cc.get(id).source_ids.every(s=>ss.has(s)));}
 const s=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(s.length,293);assert.equal(p.progress_percent,Math.round(s.reduce((a,b)=>a+b,0)/293));
});
