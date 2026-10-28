import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const r=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
test("One selected creator case does not turn whole-business cash into itch-only proceeds",()=>{
 const d=r("ontology/itch-io/2025-monstermind-ttrpg-cash-longtail.json"),s=r("specimens/itch-io.json");
 assert(d.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.equal(d.sample.publisher_count,1);assert.equal(d.sample.random_sample,false);
 assert.equal(d.cash_all_channels_2025.gross_approx_usd,2400);
 assert.equal(d.cash_all_channels_2025.after_other_costs_approx_usd,2200);
 assert.equal(d.cash_all_channels_2025.itch_reported_share_percent,43.8);
 assert.equal(d.cash_all_channels_2025.exact_itch_net_usd,null);
 assert.equal(d.releases.new_2025_pwyw_tabletop_titles,2);
 assert(Object.values(d.unknown).every(x=>x===null));
});
test("Older title persistence and bundle fraction are not mature paid order cohorts",()=>{
 const d=r("ontology/itch-io/2025-monstermind-ttrpg-cash-longtail.json");
 assert.deepEqual(d.old_titles.map(x=>x.release_year),[2021,2023]);
 assert(d.old_titles.every(x=>x.reported_still_selling_2025===true&&x.observed_paid_orders_2025===null));
 assert.equal(d.bundle_note.sales_denominator_type_verified,false);
 assert.equal(d.bundle_note.incremental_bundle_effect,null);
 assert(Object.values(d.matched_long_tail_orders).every(x=>x===null));
});
test("Original 244 task population unchanged and long tail remains incomplete",()=>{
 const p=r("plans/itch-io.json"),q=r("queues/itch-io.json");
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==="itch-io/sales/measure-long-tail-income");
 assert(t.percent>=98&&t.percent<100);assert.equal(t.status,"in_progress");
 for(const f of ["ontology/itch-io/2025-monstermind-ttrpg-cash-longtail.json","ontology/itch-io/2025-monstermind-ttrpg-cash-longtail.md","tests/itch-monstermind-2025-longtail.test.mjs"])assert(t.evidence.includes(f));
});
