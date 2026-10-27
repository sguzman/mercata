import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Selection and public follower/rating signals do not establish seller income advantage',()=>{
 const a=read('ontology/itch-io/incumbent-reputation-and-selection-audit-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>ids.has(x)));
 assert.equal(a.observed_cases[0].reported_page_fraction_without_ratings,0.81);assert.equal(a.observed_cases[1].reported_follower_accounts,213);assert.equal(a.observed_cases[1].comparably_attributable_paid_buyers,null);assert(a.signal_layers.every(x=>x.valid_sale_evidence===false));assert(Object.values(a.unidentified).every(x=>x===null));
 const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='competition/incumbents');assert(t);assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/incumbent-reputation-and-selection-audit-2026.json','ontology/itch-io/incumbent-reputation-and-selection-audit-2026.md','tests/itch-incumbent-reputation-selection.test.mjs'])assert(t.evidence.includes(f));
 const all=q.queues.flatMap(x=>x.tasks).map(x=>x.progress).concat(p.detail_tasks.map(x=>x.percent));assert.equal(all.length,244);assert.equal(p.progress_percent,Math.round(all.reduce((a,b)=>a+b,0)/244));
});
