import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Fixed competition task preserves truthful measurement boundaries for itch-io/competition/study-old-versus-new-listing-advantage',()=>{
 const a=read('ontology/itch-io/old-new-listing-cohort-control-protocol-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(a.source_ids.every(id=>ids.has(id)));
 assert.equal(a.study_state.actual_pairs_measured,0);assert.equal(a.study_state.causal_legacy_page_advantage,null);assert.equal(a.identification.project_publish_date_reset_on_build_update,false);assert.equal(a.historical_filters.filters_measured_same_instant,false);assert.equal(a.release_age_days_categories.length,4);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/competition/study-old-versus-new-listing-advantage');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/old-new-listing-cohort-control-protocol-2026.json','ontology/itch-io/old-new-listing-cohort-control-protocol-2026.md','tests/itch-old-new-listing-controls.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
