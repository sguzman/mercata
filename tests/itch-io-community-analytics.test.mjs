import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Voluntary community revenue samples are not independent paid game cohorts',()=>{
 const x=get('ontology/itch-io/community-analytics-sample-2026.json');
 const d=get('specimens/itch-io.json');
 assert.equal(x.same_collector_and_overlapping_sample,true);
 assert.deepEqual(x.snapshots.map(x=>x.projects_sampled),[145,690]);
 assert.deepEqual(x.snapshots.map(x=>x.median_reported_revenue_usd),[4,0]);
 assert.equal(x.snapshots[1].reported_zero_revenue_fraction,0.45);
 assert.equal(x.sample_interpretation.median_zero_usd_and_reported_45_percent_zero_revenue_require_clarification,true);
 assert.equal(x.sample_interpretation.explanation_verified,null);
 assert.equal(x.reported_later_comment.sample_size,702);
 assert(Object.values(x.not_observed).every(v=>v===null));
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
});
