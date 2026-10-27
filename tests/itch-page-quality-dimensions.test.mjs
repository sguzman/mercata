import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Page quality dimensions are not observed conversion effects',()=>{
 const x=get('ontology/itch-io/page-quality-dimensions-2026.json'),s=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 const refs=new Set(s.evidence.map(v=>v.id));assert(x.source_ids.every(y=>refs.has(y)));
 assert.deepEqual(x.dimensions.map(v=>v.id),['cover','screenshots','trailer','description','tags','accessibility']);assert(x.dimensions.every(v=>v.real_checkout_uplift===null));assert(Object.values(x.unknown).every(v=>v===null));
 const t=p.detail_tasks.find(z=>z.id==='itch-io/sales/study-release-page-quality');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/page-quality-dimensions-2026.json','ontology/itch-io/page-quality-dimensions-2026.md','tests/itch-page-quality-dimensions.test.mjs'])assert(t.evidence.includes(f));
});
