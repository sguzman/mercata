import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Editorial selection is documented without invented sales',()=>{
 const x=get('ontology/itch-io/editorial-browse-pathways-2026.json'),s=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 const refs=new Set(s.evidence.map(v=>v.id));assert(x.source_ids.every(y=>refs.has(y)));
 assert.equal(x.mechanisms.length,6);assert(Object.values(x.unknown).every(v=>v===null));assert.equal(x.independent_feed_sample.representative_paid_sellers,false);
 const t=p.detail_tasks.find(z=>z.id==='itch-io/discovery/map-featured-placement-pathways');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/editorial-browse-pathways-2026.json','ontology/itch-io/editorial-browse-pathways-2026.md','tests/itch-editorial-browse-pathways.test.mjs'])assert(t.evidence.includes(f));
});
