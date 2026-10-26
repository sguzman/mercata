import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Five historically verified 2025/2026 jam and promotional windows retain distinct unit definitions',()=>{
 const x=get('ontology/itch-io/seasonal-jam-sale-cohort-windows-2025-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.windows.length,5);
 const at=id=>x.windows.find(w=>w.id===id);
 assert.equal(at('creator_day_2025').start_utc,'2025-11-28T08:00:00Z');
 assert.equal(at('creator_day_2025').end_utc,'2025-11-29T08:00:00Z');
 assert.equal(at('creator_day_2025').processor_fees_waived,false);
 assert.equal(at('halloween_2025').games_reported_lower_bound_exclusive,2300);
 assert.equal(at('gamedevjs_jam_2026').host_reported_entries,482);
 assert.equal(at('gamedevjs_jam_2026').official_submissions_listing_entries_later,483);
 assert.equal(at('gamedevjs_jam_2026').submission_and_results_count_agree,false);
 assert.equal(at('summer_sale_2026').game_sale_pages_reported_lower_bound_exclusive,4500);
});
test('Calendar selection is not a paid-game seasonal income effect or game launch frequency',()=>{
 const x=get('ontology/itch-io/seasonal-jam-sale-cohort-windows-2025-2026.json'),p=get('plans/itch-io.json');
 assert.equal(x.observed_platform_paid_seasonality_effect,null);
 assert.equal(x.observed_platform_new_paid_release_rate_by_season,null);
 assert.equal(x.observed_jam_to_paid_2d_conversion,null);
 assert.equal(x.observed_creator_day_sales_lift,null);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/market/examine-seasonal-release-patterns');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-io-seasonal-cohort-windows.test.mjs'));
 assert.equal(p.total_tracked_tasks,244);
});
