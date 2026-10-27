import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Indexed creator profiles are not a census of active paid itch game merchants',()=>{
 const d=read('ontology/itch-io/independent-catalog-creator-frame-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const sourceIds=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(id=>sourceIds.has(id)));
 assert.equal(d.observation.indexed_games_reported,400641);
 assert.equal(d.observation.creator_profiles_reported,65273);
 assert.equal(d.observation.tags_ranked_reported,215920);
 assert.equal(d.observation.counts_are_transient,true);
 assert.equal(d.cross_source_distinction.direct_ratio_has_common_denominator,false);
 assert(d.possible_visible_signals.every(x=>x.source_ids.every(id=>sourceIds.has(id))&&!x.proof_paid_seller));
 assert(Object.values(d.unknown).every(v=>v===null));
 assert.equal(q.queues.flatMap(x=>x.tasks).find(x=>x.id==='market/sellers').progress,58);
 assert.equal(p.detail_tasks.find(x=>x.id==='itch-io/market/estimate-active-sellers').percent,61);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
