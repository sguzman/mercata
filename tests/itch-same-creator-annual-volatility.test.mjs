import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Same creator annual gross and page-view movements match cited 2023–2025 public reports',()=>{
 const a=read('ontology/itch-io/same-creator-annual-payment-variability-2023-2025.json'),s=read('specimens/itch-io.json'),g=read('ontology/itch-io/notjam-game-category-series-2023-2025.json');
 assert.equal(a.sample.creators,1);assert.equal(a.annual_reports.length,3);
 assert.deepEqual(a.annual_reports.map(x=>x.annual_gross_all_categories_usd),[641,1152.22,464.66]);
 assert.deepEqual(a.annual_reports.map(x=>x.annual_page_view_events_all_categories),[25500,53681,71659]);
 assert(a.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 for(let i=0;i<2;i++){
  const b=a.annual_reports[i],c=a.annual_reports[i+1],delta=a.annual_changes[i];
  const round=(x,n)=>Number(x.toFixed(n));
  assert.equal(delta.gross_change_usd,round(c.annual_gross_all_categories_usd-b.annual_gross_all_categories_usd,2));
  assert.equal(delta.gross_change_percent,round((c.annual_gross_all_categories_usd/b.annual_gross_all_categories_usd-1)*100,2));
  assert.equal(delta.page_view_events_change,c.annual_page_view_events_all_categories-b.annual_page_view_events_all_categories);
  assert.equal(delta.page_view_events_change_percent,round((c.annual_page_view_events_all_categories/b.annual_page_view_events_all_categories-1)*100,2));
 }
 assert.deepEqual(g.time_points.map(t=>t.reported_game_category_revenue_usd_lifetime),[0,0,24]);
 assert.equal(a.multi_category_revenue_context.lifetime_game_figures_are_annual_gross_payments,false);
 assert.equal(a.review_of_explanations.causal_explanation_identified,false);
 assert.equal(a.review_of_explanations.seasonality_within_year_measured,false);
 assert(Object.values(a.unknown).every(x=>x===null));
});
test('Adds only existing sales-volatility research evidence; paid game market remains unobserved',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json'),a=read('ontology/itch-io/same-creator-annual-payment-variability-2023-2025.json');
 const original=q.queues.flatMap(x=>x.tasks);
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(original.length,84);assert.equal(p.detail_tasks.length,160);
 const task=p.detail_tasks.find(x=>x.id==='itch-io/risk/study-sales-volatility');
 assert.equal(task.status,'in_progress');assert.equal(task.percent,85);
 for(const f of ['ontology/itch-io/same-creator-annual-payment-variability-2023-2025.json','ontology/itch-io/same-creator-annual-payment-variability-2023-2025.md','tests/itch-same-creator-annual-volatility.test.mjs'])assert(task.evidence.includes(f));
 assert.equal(a.sample.matched_population_of_games_verified,false);
 assert.equal(a.review_of_explanations.representative_paid_2d_game_revenue_volatility,false);
});
