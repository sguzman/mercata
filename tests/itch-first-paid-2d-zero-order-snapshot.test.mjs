import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First paid 2D game zero-order report preserves listing exposures, source clocks and verified unknowns',()=>{
 const c=read('ontology/itch-io/first-paid-2d-horror-game-zero-order-snapshot-2026.json'),d=read('specimens/itch-io.json');
 assert.equal(c.sample.selected_publishers,1);assert.equal(c.sample.creator_team_members_reported,2);
 assert(c.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(c.offer.public_game_listing_date_utc,'2026-10-24T14:00:00Z');
 assert.equal(c.offer.full_game_positive_minimum_usd_during_report,1.99);
 assert.equal(c.self_report.post_timestamp_utc,'2026-10-25T13:14:33Z');
 assert.equal(c.self_report.clock_claims_reconciled,false);
 assert.equal(c.self_report.itch_catalog_impression_events_approx,700);
 assert.equal(c.self_report.click_through_fraction_upper_bound_exclusive,0.01);
 assert.equal(c.self_report.click_events_exact,null);
 assert.equal(c.self_report.self_reported_purchases_as_of_post,0);
 assert.equal(c.self_report.reported_zero_is_verified_merchant_ledger,false);
 assert.equal(c.self_report.settled_positive_price_order_count,null);
 assert(Object.values(c.unknown).every(x=>x===null));
 assert(Object.values(c.economic_boundaries).every(x=>x===false));
});
test('Zero-sale case advances an existing market demand question, not a population-income acceptance',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/market/estimate-paid-purchase-demand');
 assert(t.percent>=63&&t.percent<=100);
 assert.equal(t.status,t.percent===100?'complete':'in_progress');
 for(const ev of ['ontology/itch-io/first-paid-2d-horror-game-zero-order-snapshot-2026.json','ontology/itch-io/first-paid-2d-horror-game-zero-order-snapshot-2026.md','tests/itch-first-paid-2d-zero-order-snapshot.test.mjs'])assert(t.evidence.includes(ev));
 const avg=p.detail_tasks.find(x=>x.id==='itch-io/income/estimate-mean-seller-income');
 assert(avg.percent<100,'One early zero sale cannot close mean market income');
});
