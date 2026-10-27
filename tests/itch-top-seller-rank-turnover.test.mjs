import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Third-party Top Sellers chart observations are dated, separate and strictly nonmonetary',()=>{
 const a=load('ontology/itch-io/third-party-top-seller-rank-turnover-2026.json'),s=load('specimens/itch-io.json');
 assert(a.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(a.observations.length,2);
 assert.equal(a.observations[0].captured_snapshot,'2026-10-23T12:00:00Z');
 assert.equal(a.observations[1].captured_snapshot,'2026-10-23T18:00:00Z');
 assert.deepEqual([a.observations[0].distinct_games_ever_in_top100_over_about_30d,a.observations[0].number_of_chart_walks,a.observations[0].seven_day_top100_turnover_fraction],[367,182,0.39]);
 assert.equal(a.observations[1].ranked_games_in_full_display,7197);
 assert(a.observations.every(o=>o.paid_units===null&&o.unique_sellers===null));
 assert.equal(a.scope.market_representative,false);
 assert.equal(a.methodology.independent_velocity_formula_not_the_same_as_itch_top_sellers_sort,true);
 assert.equal(a.methodology.turnover_does_not_measure_paid_game_sales,true);
 assert(Object.values(a.missing_economic_outputs).every(x=>x===null));
});
test('Only existing ranked visibility / bestseller concentration research advances, not income claims',()=>{
 const p=load('plans/itch-io.json'),q=load('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/competition/study-best-seller-concentration');
 assert.equal(t.status,'in_progress');assert.equal(t.percent,73);
 for(const path of ['ontology/itch-io/third-party-top-seller-rank-turnover-2026.json','ontology/itch-io/third-party-top-seller-rank-turnover-2026.md','tests/itch-top-seller-rank-turnover.test.mjs'])assert(t.evidence.includes(path));
});
