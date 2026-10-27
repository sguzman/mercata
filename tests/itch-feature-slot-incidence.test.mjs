import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Featured membership and sampled positions do not become paid market concentration',()=>{
 const a=read('ontology/itch-io/featured-slot-incidence-and-rank-sampling-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const sourceSet=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>sourceSet.has(x)));
 assert.equal(a.sample.first_seen_games,118017);assert.equal(a.sample.ever_featured_games,2477);
 assert.equal(a.sample.paid_seller_population_sample,false);assert.equal(a.sample.entry_followup_period_equal_for_all,false);
 assert.equal(a.selected_game.featured_sightings,652);assert.equal(a.selected_game.every_featured_slot_is_top_onscreen,false);
 assert(Object.values(a.unknown).every(x=>x===null));
 const t=p.detail_tasks.find(t=>t.id==='itch-io/competition/define-feature-slot-concentration');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/featured-slot-incidence-and-rank-sampling-2026.json','ontology/itch-io/featured-slot-incidence-and-rank-sampling-2026.md','tests/itch-feature-slot-incidence.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
