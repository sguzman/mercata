import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Independent sampled recency observations cannot become paid customer exposure',()=>{
 const x=load('ontology/itch-io/new-release-featured-visibility-observations-2026.json'),s=load('specimens/itch-io.json'),p=load('plans/itch-io.json');
 const refs=new Set(s.evidence.map(e=>e.id));assert(x.source_ids.every(i=>refs.has(i)));
 assert.deepEqual(x.positions.map(v=>v.rank),[28,7193,20,24]);
 assert.equal(x.featured.days_with_sightings,112);assert.equal(x.featured.sampled_rank_sightings,652);
 assert.equal(x.featured.last_sample_is_actual_removal,false);
 assert.equal(x.rolling_paid_filters_prior.verified_paid_orders,null);
 assert(Object.values(x.unknown).every(v=>v===null));
 const t=p.detail_tasks.find(t=>t.id==='itch-io/discovery/study-recent-release-exposure');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/new-release-featured-visibility-observations-2026.json','ontology/itch-io/new-release-featured-visibility-observations-2026.md','tests/itch-new-release-feature-sightings.test.mjs'])assert(t.evidence.includes(f));
});
