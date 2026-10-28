import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Separate Steam paid game results are never relabeled itch demo conversions',()=>{
 const r=get('ontology/itch-io/it-never-ends-demo-versus-paid-steam-2026.json'),d=get('specimens/itch-io.json');
 assert(r.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(r.source_publication_date,'2026-10-22');
 assert.equal(r.observed_self_reports.itch_free_demo_browser_play_events_lower_bound_exclusive,20000);
 assert.equal(r.observed_self_reports.steam_full_game_paid_copies_reported,3042);
 assert.equal(r.observed_self_reports.steam_full_game_gross_usd_reported,37917);
 assert.equal(r.observed_self_reports.revenue_claim_is_steam_not_itch,true);
 assert.equal(r.observed_self_reports.steam_purchased_copies_from_itch_demo_exposure,null);
 assert.equal(r.creator_interpretation.actual_cross_platform_conversion_measured,false);
 assert(Object.values(r.do_not_derive).every(v=>v===null));
 assert.equal(r.sample.selected_creator_count,1);
});
test('Actual observed external case advances one existing incomplete research task only',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(g=>g.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/sales/study-browser-play-conversion');
 assert.equal(t.status,'in_progress');assert(t.percent>=72&&t.percent<100);
 for(const f of ['ontology/itch-io/it-never-ends-demo-versus-paid-steam-2026.json','ontology/itch-io/it-never-ends-demo-versus-paid-steam-2026.md','tests/itch-it-never-ends-crossstore-demo.test.mjs'])assert(t.evidence.includes(f));
});
