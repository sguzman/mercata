import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {estimateSale} from '../site/itch-sale-math.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('itch.io first-party findings have source-linked, dated limitations',()=>{
 const specimen=load('specimens/itch-io.json'),registry=load('ontology/itch-io/commercial-rules-2026.json');
 const sources=new Set(specimen.evidence.map(s=>s.id));
 assert.equal(sources.size,specimen.evidence.length);
 assert(sources.size>=10);assert(specimen.claims.length>=28);
 for(const c of specimen.claims){
  assert(c.text&&/^\d{4}-\d{2}-\d{2}$/.test(c.observed_at)&&c.limitations);
  assert.equal(new Date(c.observed_at+'T00:00:00Z').toISOString().slice(0,10),c.observed_at);
  assert(c.source_ids.length>0&&c.source_ids.every(id=>sources.has(id)));
 }
 assert(registry.source_ids.every(id=>sources.has(id)));
 assert.equal(registry.payment_modes.length,2);
 assert(registry.payment_modes[0].merchant_of_record!=='itch_io');
 assert(registry.payment_modes[1].merchant_of_record==='itch_io');
 assert(Object.values(registry.unresolved).every(x=>x===null));
 assert.equal(registry.official_example.is_creator_profit,false);
});
test('official proceeds example and small-price arithmetic remain hypothetical',()=>{
 const x=estimateSale({buyerPayment:10,platformShareRate:0.1,processorFixed:0.3,processorRate:0.029});
 assert.deepEqual([x.platformShare,x.processorFee,x.proceedsBeforeOtherCosts],[1,0.59,8.41]);
 assert.equal(x.netProfit,null);assert.equal(x.payoutAvailable,null);
 assert.equal(estimateSale({buyerPayment:1,platformShareRate:0.1,processorFixed:0.3,processorRate:0.029}).proceedsBeforeOtherCosts,0.57);
 for(const params of [
  {buyerPayment:10,platformShareRate:0.1,processorFixed:null,processorRate:0.029},
  {buyerPayment:10,platformShareRate:1.2,processorFixed:0.3,processorRate:0.029},
  {buyerPayment:-1,platformShareRate:0.1,processorFixed:0.3,processorRate:0.029}
 ])assert.throws(()=>estimateSale(params));
});
test('itch.io task updates preserve accounting of all 244 tasks',()=>{
 const p=load('plans/itch-io.json'),q=load('queues/itch-io.json'),s=load('specimens/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(q.plan,'plans/itch-io.json');assert.equal(p.status,'researching');
 assert.equal(s.status,'researching');
 const all=q.queues.flatMap(g=>g.tasks).map(t=>t.progress).concat(p.detail_tasks.map(t=>t.percent));
 assert.equal(all.length,244);
 assert.equal(p.progress_percent,Math.round(all.reduce((a,b)=>a+b,0)/244));
 for(const t of [...q.queues.flatMap(g=>g.tasks),...p.detail_tasks]){
  const progress=t.progress??t.percent;
  if(progress>0){assert(t.evidence?.length>0);assert(t.status==='in_progress'||t.status==='complete');}
  else assert(t.status==='pending');
 }
 assert(p.progress_percent>0);
});
