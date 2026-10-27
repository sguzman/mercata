import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Three selected creator charts show heterogeneous devlog periods without invented paid conversions',()=>{
 const c=get('ontology/itch-io/three-selected-devlog-traffic-patterns-2024-2026.json'),d=get('specimens/itch-io.json');
 assert.equal(c.sample.games,3);assert.equal(c.sample.independently_selected_randomly,false);
 assert.equal(c.sample.underlying_data_rows_available,false);
 assert(c.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(c.cases.map(x=>x.game),['Checkmage!','Psycutlery','ColorCoordination']);
 assert.equal(c.cases[0].quantitative_download_events_attributed_to_each_devlog,null);
 assert.equal(c.cases[1].three_later_posts_obvious_itch_lift_reported,false);
 assert.equal(c.cases[2].author_estimated_ongoing_downloads_per_day_approx,1.39);
 assert(c.cases.every(x=>x.incremental_paid_orders===null));
 assert(Object.values(c.unknown).every(v=>v===null));
 assert.equal(c.measurement_boundaries.marketing_effect_not_identified,true);
});
test('Observation advances only the fixed devlog channel question without implying causal market closure',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/discovery/study-devlog-and-follower-channels');
 assert(t.percent>=97&&t.percent<=100);
 assert.equal(t.status,t.percent===100?'complete':'in_progress');
 for(const x of ['ontology/itch-io/three-selected-devlog-traffic-patterns-2024-2026.json','ontology/itch-io/three-selected-devlog-traffic-patterns-2024-2026.md','tests/itch-three-devlog-traffic-patterns.test.mjs'])assert(t.evidence.includes(x));
 assert.equal(p.detail_tasks.find(t=>t.id==='itch-io/sales/study-browser-play-conversion').percent,72);
});
