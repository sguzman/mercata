import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-grimegold-firstgame-net-stage-demo-window-2026.json');
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('First paid Steam product remains distinct from earlier demo, and one studio from three creators',()=>{
 assert.equal(x.case.steam_appid,3165090);
 assert.equal(x.case.steam_paid_release_date,'2026-01-20');
 assert.equal(x.case.free_demo_devlog_date,'2024-10-03');
 assert(x.case.free_demo_devlog_date<x.case.steam_paid_release_date);
 assert.equal(x.case.developer_publisher_labels.length,3);
 assert.equal(x.case.source_scope.three_people_do_not_equal_three_independent_games,true);
});
test('The self-described Steam net stage is before Valve share and does not certify take-home',()=>{
 const a=x.case.sale_observation;
 assert.equal(a.units_sold_reported,642);
 assert.equal(a.steam_net_before_steam_share_usd_reported,2425);
 assert.equal(a.net_label_includes_valve_30_percent_share,false);
 assert.equal(a.actual_platform_payout_evidenced,false);
 assert.equal(a.copies_to_launch_wishlist_exact_conversion_valid,false);
 assert.equal(x.unknown.publisher_after_platform_share_usd,null);
 assert.equal(x.unknown.labor_adjusted_profit_usd,null);
 assert.equal(x.case.labor.author_reported_elapsed_development_months_approx,18);
});
test('Next Fest count arithmetic works while two GX numbers and overlapping events remain unresolved',()=>{
 const a=x.case.festival;
 assert.equal(a.steam_next_fest_oct2024_before_wishlist_stock+a.reported_additions,a.reported_after_stock);
 assert.equal(a.gx_games_demo_nov2024_list_item_reported_additions,300);
 assert.equal(a.gx_demo_later_narrative_reported_approx_additions,200);
 assert.equal(a.identical_gx_measurement_windows_verified,false);
 assert.equal(a.gx_demo_reported_wishlist_per_1000_plays_approx/1000,a.gx_demo_author_estimated_rate);
 assert.equal(a.cooking_fest_overlap_with_gx_stated,true);
 assert.equal(a.valid_additive_independent_attribution,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Source IDs, claims, privacy and original 293-task research count remain intact',()=>{
 const ids=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,3);
 assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(ids.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>ids.has(z)),id);}
 const scores=[...p.detail_tasks.map(z=>z.percent),...q.queues.flatMap(g=>g.tasks.map(z=>z.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert.equal(x.private_financial_records_used,false);
});
