import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const get=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const filename="ontology/itch-io/chico-2022-2024-one-commercial-game-dx-update-crossstore-snapshots.json";
test("Single first commercial game has three venue-specific approximate sales counts",()=>{
 const x=get(filename),d=get("specimens/itch-io.json");
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.publisher_and_game.independent_publisher_count_in_this_case,1);
 assert.equal(x.publisher_and_game.distinct_games_counted_by_original_and_dx,1);
 assert.equal(x.creator_self_report_as_of_april_2024.itch_copies_approx,60);
 assert.equal(x.creator_self_report_as_of_april_2024.steam_copies_approx,800);
 assert.equal(x.creator_self_report_as_of_april_2024.switch_copies_approx,600);
 assert.equal(x.creator_self_report_as_of_april_2024.crossstore_sum_approx_copies,1460);
 assert.equal(x.creator_self_report_as_of_april_2024.counts_audited_from_payment_processor,false);
 assert.equal(x.creator_self_report_as_of_april_2024.reported_earnings_itch_usd,null);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test("DX upgrade and the Switch port are not new itch paid-game releases",()=>{
 const x=get(filename),t=x.release_timeline;
 assert.equal(t.first_itch_and_steam_commercial_release_day,"2022-08-08");
 assert.equal(t.dx_free_existing_purchasers_upgrade_day,"2023-01-13");
 assert.equal(t.nintendo_switch_port_release_day,"2023-12-29");
 assert.equal(x.publisher_and_game["2023_dx_is_separate_paid_game_launch"],false);
 assert.equal(t.matching_price_and_release_age_for_all_stores,false);
 assert.equal(x.verified_itch_offer.listed_discount_price_usd,3.49);
 assert.equal(x.verified_itch_offer.sale_discount_percent,30);
 assert.equal(x.verified_itch_offer.prices_prove_purchase_transaction_amounts,false);
});
test("Two bounded original detail tasks improve without changing the 244-task population",()=>{
 const p=get("plans/itch-io.json"),q=get("queues/itch-io.json");
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 for(const [id,pct] of [["itch-io/market/estimate-paid-purchase-demand",74],["itch-io/competition/measure-release-frequency",97]]){
  const t=p.detail_tasks.find(t=>t.id===id);
  assert.equal(t.percent,pct);assert.equal(t.status,"in_progress");
  for(const evidence of [filename,"ontology/itch-io/chico-2022-2024-one-commercial-game-dx-update-crossstore-snapshots.md","tests/itch-chico-2022-2024-dx-release-unit.test.mjs"])assert(t.evidence.includes(evidence));
 }
 assert.equal(p.detail_tasks.filter(t=>t.percent<100).length+q.queues.flatMap(w=>w.tasks).filter(t=>t.progress<100).length,32);
});
