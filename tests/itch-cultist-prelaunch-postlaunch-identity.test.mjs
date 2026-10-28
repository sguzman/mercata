import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));const file="ontology/itch-io/cultist-simulator-2017-2019-itch-prelaunch-versus-postlaunch-store-sales.json";
test('Single established studio with separate prelaunch and postlaunch itch paid windows',()=>{
 const x=get(file),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.seller_count,1);assert.equal(x.game_count,1);
 assert.equal(x.timeline.itch_exclusive_prerelease_paid_copies,1070);
 assert.equal(x.timeline.itch_after_full_launch_seven_months_copies,178);
 assert.equal(x.year_one_approx_crossstore_table.itch_postlaunch_rounded_units,170);
 assert.equal(x.year_one_approx_crossstore_table.prelaunch_itch_purchases_included_in_rounded_postlaunch_row,false);
 assert.equal(x.comparability.rounded_170_vs_reported_178_not_exactly_reconciled,true);
 assert.equal(x.year_one_approx_crossstore_table.all_stores_approx_gross_usd,1760000);
});
test('Gross, publisher advance and zero-sale samples do not become seller profit',()=>{
 const x=get(file);
 assert.equal(x.financing_and_cost.publisher_advance_usd_reported,60000);
 assert.equal(x.financing_and_cost.individual_dev_net_income,null);
 assert.equal(x.comparability.market_representative_seller_distribution,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Existing paid demand task advances without changing 244 tasks',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-paid-purchase-demand');
 assert(t.percent>=76&&t.percent<100&&t.status==='in_progress');
 for(const f of [file,"ontology/itch-io/cultist-simulator-2017-2019-itch-prelaunch-versus-postlaunch-store-sales.md","tests/itch-cultist-prelaunch-postlaunch-identity.test.mjs"])assert(t.evidence.includes(f));
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
});
