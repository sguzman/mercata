import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const snapshot=read('ontology/steam/public-catalog-and-conditional-long-tail-2026.json');
const dossier=read('specimens/steam.json');
test('Steam release counts are separate dated tracker populations, not a paid-order ledger',()=>{
 assert.equal(snapshot.source_ids.length,3);
 assert(snapshot.source_ids.every(id=>dossier.evidence.some(x=>x.id===id)));
 assert(snapshot.claim_ids.every(id=>dossier.claims.some(x=>x.id===id)));
 const steamdb=snapshot.tracker_snapshots.find(x=>x.tracker==='SteamDB');
 const lens=snapshot.tracker_snapshots.find(x=>x.tracker==='steamlense');
 assert.equal(steamdb.target_release_year,2025);
 assert.equal(steamdb.game_count_in_opened_page,21224);
 assert.equal(steamdb.search_indexed_count_also_seen,21228);
 assert.equal(steamdb.paid_at_first_release,null);
 assert.equal(lens.paid_status_game_count,17651);
 assert.equal(lens.free_status_game_count,2985);
 assert.equal(lens.paid_status_game_count+lens.free_status_game_count,lens.total_game_count);
 assert.equal(lens.share_below_ten_reviews,0.61);
 assert.equal(lens.confirmed_exact_zero_paid_sales,null);
 assert.notEqual(steamdb.game_count_in_opened_page,lens.total_game_count);
});
test('GameDiscoverCo multiplier sample positively selects successful launches, not platform median paid games',()=>{
 const x=snapshot.cohort;
 assert.equal(x.reported_sample_size_approx,5000);
 assert.equal(x.release_start,'2023-07-01');
 assert.equal(x.release_end,'2025-07-31');
 assert.equal(x.eligibility,'estimated_first_month_paid_unit_sales_greater_than_1000');
 assert.equal(x.estimates_not_merchant_receipts,true);
 assert.equal(x.included_zero_first_month_sellers,false);
 assert.equal(x.median_cumulative_copies_relative_to_month1.month12,1.79);
 assert.equal(x.median_gross_revenue_relative_to_firstweek.year1,2.46);
 assert.equal(x.populationwide_first_paid_game_median,null);
 assert.equal(x.populationwide_first_paid_game_zero_sales_fraction,null);
});
test('No study generates unsupported Steam seller income from reviews, release totals or success-selected samples',()=>{
 const reports=['ontology/steam/public-catalog-and-conditional-long-tail-2026.md'];
 for(const p of reports){
 const t=fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
 assert(t.includes('not')&&t.includes('zero'));
 assert(t.includes('1,000'));
 assert(t.includes('https://'));
 }
 const plan=read('plans/steam.json'),q=read('queues/steam.json');
 const scores=[...plan.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
