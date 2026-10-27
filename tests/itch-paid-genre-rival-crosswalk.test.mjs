import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Paid 2D tag and genre counts have distinct source windows and no purchases',()=>{
 const a=read('ontology/itch-io/paid-genre-competition-crosswalk-oct2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(a.observations.map(x=>x.value),[12691,4196,7485,2458]);
 assert(a.observations.every(x=>x.paid_orders===null));
 assert.equal(a.observations[2].earlier_2026_10_26_count,7456);
 assert.equal(a.comparability.mutually_exclusive,false);
 assert.equal(a.comparability.same_capture_clock,false);
 assert.equal(a.comparability.counts_are_verified_sales,false);
 assert(Object.values(a.unknown).every(x=>x===null));
 const task=p.detail_tasks.find(t=>t.id==='itch-io/competition/map-genre-specific-rivals');assert.equal(task.percent,100);assert.equal(task.status,'complete');
 for(let x of ['ontology/itch-io/paid-genre-competition-crosswalk-oct2026.json','ontology/itch-io/paid-genre-competition-crosswalk-oct2026.md','tests/itch-paid-genre-rival-crosswalk.test.mjs'])assert(task.evidence.includes(x));
 assert.equal(p.total_tracked_tasks,244);
});
