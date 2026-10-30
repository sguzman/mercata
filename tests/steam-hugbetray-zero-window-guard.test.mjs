import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticZeroWindowCopies as audit} from '../site/steam-zero-window-key-copy-count-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=read('ontology/steam/hugbetray-fiveweek-zero-period-keys-bots-and-cash-2026.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const f=()=>({fixture_id:'fixture-copies',cumulative_steam_copies:4,returned_steam_copies:1,separate_key_copies:1,zero_interval_orders:0,later_interval_orders:1,reported_players_including_tests:8});
test('Author local and UTC store dates are one initial paid launch',()=>{
 assert.equal(s.release.main_app_id,5051910);
 assert.equal(s.release.first_paid_launches,1);
 assert.equal(s.release.author_release_calendar_date,'2026-09-04');
 assert.equal(s.release.store_us_release_calendar_date,'2026-09-03');
 assert.equal(s.release.steamdb_release_instant_utc,'2026-09-04T03:01:00Z');
});
test('Zero sales in one interval does not turn later positive copies into market-wide zero sales',()=>{
 const a=audit(f());
 assert.equal(a.observed_zero_order_interval,true);
 assert.equal(a.reported_cumulative_positive_orders,true);
 assert.equal(a.conditional_retained_steam_copy_count,3);
 assert.equal(a.total_steam_plus_key_distributions,5);
 assert.equal(a.market_zero_paid_sale_fraction,null);
 assert.equal(s.descriptive_cautions.interval_zero_is_not_lifetime_zero,true);
});
test('Key copies, free browser players, impression and bot counts never become merchant transactions',()=>{
 const a=audit(f());
 assert.equal(s.store_evidence.other_participants_may_join_free_browser,true);
 assert.equal(s.public_author.reported_players_including_tests,8);
 assert.equal(s.public_author.store_impressions_reported,124000);
 assert.equal(s.public_author.bot_labeled_visits_reported,753);
 assert.equal(s.descriptive_cautions.bot_direct_categories_known_disjoint,false);
 for(const k of ['player_to_paid_customer_conversion','key_distributions_actually_paid','verified_merchant_paid_order_count','verified_bank_cash','legal_partner_after_cost_profit'])assert.equal(a[k],null);
 assert(Object.values(s.unknown).every(v=>v===null));
});
test('Reject actual identifiers and inconsistent synthetic sample sizes',()=>{
 for(const c of [{account_id:'secret'},{appid:5051910},{buyer_id:'buyer'},{returned_steam_copies:5},{zero_interval_orders:4,later_interval_orders:4},{reported_players_including_tests:1.5},{fixture_id:'real game'},{separate_key_copies:-1}])assert.throws(()=>audit({...f(),...c}));
 assert.throws(()=>audit([4,1,1,0,1,8]));
});
test('Public source citations and original 293 task progress remain intact',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(s.source_ids.length,4);assert.equal(s.claim_ids.length,12);
 for(const id of s.source_ids)assert(ids.has(id),id);
 for(const id of s.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>ids.has(x)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
