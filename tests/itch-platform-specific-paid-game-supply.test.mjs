import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Paid platform filters remain nonadditive and do not imply buyers',()=>{
 const d=load('ontology/itch-io/platform-specific-paid-game-supply-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(d.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(d.observations.slice(0,3).map(x=>x.count),[7456,7350,25265]);
 assert(d.observations.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert.equal(d.overlap_and_definition.platform_counts_not_additive,true);
 assert.equal(d.overlap_and_definition.HTML5_only_count_verified,false);
 assert.equal(d.overlap_and_definition.same_timestamp_all_frames,false);
 assert(Object.values(d.unknown).every(x=>x===null));
 const b=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='market/niches');
 assert.equal(b.progress,100);assert.equal(b.status,'complete');
 const x=p.detail_tasks.find(x=>x.id==='itch-io/market/study-browser-versus-downloadable-supply');
 const y=p.detail_tasks.find(x=>x.id==='itch-io/market/measure-2d-game-supply');
 assert.equal(x.percent,90);assert.equal(y.percent,96);
 for(const t of [b,x,y])assert(t.evidence.includes('ontology/itch-io/platform-specific-paid-game-supply-2026.json'));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});
