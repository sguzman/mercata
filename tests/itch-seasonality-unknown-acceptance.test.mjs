import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Seasonal cohort comparisons truthfully leave paid demand unknown',()=>{
 const a=read('ontology/itch-io/seasonality-evidence-acceptance-oct2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>ids.has(x)));
 assert.equal(a.conclusion.seasonal_pattern,'unknown');assert(a.events.every(e=>e.paid_orders===null));assert.equal(a.conclusion.observed_paid_order_demand_by_month,null);assert.equal(a.conclusion.causal_promotion_effect,null);assert.equal(a.comparisons[1].comparable_as_independent_events,false);
 const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='discovery/seasonal');assert(t);assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/seasonality-evidence-acceptance-oct2026.json','ontology/itch-io/seasonality-evidence-acceptance-oct2026.md','tests/itch-seasonality-unknown-acceptance.test.mjs'])assert(t.evidence.includes(f));
 const all=q.queues.flatMap(x=>x.tasks).map(x=>x.progress).concat(p.detail_tasks.map(x=>x.percent));assert.equal(all.length,244);assert.equal(p.progress_percent,Math.round(all.reduce((a,b)=>a+b,0)/244));
});
