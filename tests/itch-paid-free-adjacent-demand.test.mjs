import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Fixed competition task preserves truthful measurement boundaries for itch-io/competition/compare-paid-against-free-competitors',()=>{
 const a=read('ontology/itch-io/free-vs-paid-competition-observability-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(a.source_ids.every(id=>ids.has(id)));
 assert(a.offers.every(x=>x.free_activity_establishes_sale===false));assert.equal(a.catalog_snapshot_caveat.derive_number_of_free_games_by_subtraction,false);assert(Object.values(a.observed).every(v=>v===null));
 const t=p.detail_tasks.find(x=>x.id==='itch-io/competition/compare-paid-against-free-competitors');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/free-vs-paid-competition-observability-2026.json','ontology/itch-io/free-vs-paid-competition-observability-2026.md','tests/itch-paid-free-adjacent-demand.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
