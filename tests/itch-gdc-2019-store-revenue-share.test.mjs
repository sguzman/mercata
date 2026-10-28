import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const f='ontology/itch-io/historical-gdc-2019-store-revenue-dependence.json';
test('2019 GDC conditional merchant revenue shares cannot become market totals',()=>{
 const a=read(f),s=read('specimens/itch-io.json');
 assert(a.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(a.sample.itch_selling_subgroup_n,null);
 assert.equal(a.sample.steam_selling_subgroup_n,null);
 assert.equal(a.sample.pc_mac_store_question_n,null);
 assert.equal(a.conditional_itch_seller_share_of_own_game_sales_revenue_percent.under_10_percent,52);
 assert.equal(a.conditional_itch_seller_share_of_own_game_sales_revenue_percent.from_75_to_100_percent,28);
 assert.equal(a.steam_store_question_respondents_reporting_steam_seller_percent_approx,47);
 assert.equal(a.conditional_steam_seller_share_of_own_game_sales_revenue_percent.from_75_to_100_percent,54);
 assert.equal(a.conditional_steam_seller_share_of_own_game_sales_revenue_percent.from_50_to_74_percent,17);
 assert.equal(a.comparability.conditional_store_dependence_is_platform_market_share,false);
 assert.equal(a.comparability.conditional_store_dependence_is_absolute_income,false);
 assert(Object.values(a.unobserved).every(x=>x===null));
});
test('2025 web developer publishing survey cannot be compared as store revenue dependence',()=>{
 const a=read(f),w=read('ontology/itch-io/web-developer-survey-crosswalk-2026.json');
 assert.equal(a.other_survey_context.publishing_question_n,w.years[1].publishing_question_n);
 assert.equal(a.other_survey_context.itch_and_similar_publishing_percent,w.years[1].itch_and_similar_publishing_percent);
 assert.equal(a.comparability.different_survey_platform_publishing_share_estimates_2019_to_2025_trend,false);
 assert.equal(a.other_survey_context.itch_only_sellers_identified,false);
 assert.equal(a.rights.no_private_data_accessed,true);
});
test('Only one original benchmark task advanced and remains unfinished',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/competition/create-cross-platform-benchmarks');
 assert.equal(t.percent,99);assert.equal(t.status,'in_progress');
 for(const e of [f,'ontology/itch-io/historical-gdc-2019-store-revenue-dependence.md','tests/itch-gdc-2019-store-revenue-share.test.mjs'])assert(t.evidence.includes(e));
});
