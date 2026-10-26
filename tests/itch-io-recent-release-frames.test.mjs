import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Recent rolling itch.io listings cannot become a confirmed seller success rate',()=>{
 const x=load('ontology/itch-io/recent-release-filter-frames-2026.json');
 const s=load('specimens/itch-io.json');
 assert.equal(x.observations.length,6);
 assert.deepEqual(x.observations.map(y=>y.result_count),[1057,3752,3799,447,202,16776]);
 assert(x.source_ids.every(id=>s.evidence.some(y=>y.id===id)));
 assert(x.observations.every(y=>y.confirmed_paid_orders===null&&y.first_time_commercial_publishers===null));
 assert.equal(x.sort_comparison.difference,47);
 assert.equal(x.sort_comparison.same_underlying_cohort_verified,false);
 assert(Object.values(x.not_observed).every(v=>v===null));
});
