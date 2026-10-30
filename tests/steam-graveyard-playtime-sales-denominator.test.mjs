import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticOwnedCopyPlaytime as audit} from '../site/steam-owned-copy-playtime-denominator-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-graveyard-owner-copy-playtime-not-zero-paid-sales-2026.json'),
 d=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
test('Library-game-copy population and selection are not transaction population',()=>{
 assert.equal(study.sample.libraries,113781);
 assert.equal(study.sample.current_price_positive_library_game_copies,9658442);
 assert.equal(study.sample.hash_buckets,48);
 assert.equal(study.sample.all_zero_playtime_libraries_excluded,14343);
 assert.equal(study.definitions.zero_owner_appids_included,false);
 assert.equal(study.sample.probability_sample,false);
});
test('Shares refer to different playtime and heuristic-bundle denominators',()=>{
 assert.equal(study.rates.never_launched_pct_of_owned_copies,32.4);
 assert.equal(study.rates.under_2h_pct_given_positive_playtime,27.9);
 assert.equal(study.rates.never_launched_pct_bundle_giveaway_heuristic,59.1);
 assert.equal(study.rates.never_launched_pct_other_copies,24.5);
 assert.equal(study.rates.groups_have_distinct_denominators,true);
 assert.equal(study.definitions.current_price,'US_list_price_not_checkout');
});
test('Synthetic copy playtime cannot infer paid orders, zero-sale AppIDs, cash or retention',()=>{
 const s=audit({fixture_id:'fixture-sample',owned_copies:200,zero_minute_copies:60,launched_under_two_hours_copies:35});
 assert.equal(s.zero_playtime_share,0.3);assert.equal(s.under_two_hours_given_launched_share,0.25);
 for(const k of ['actual_paid_order_count','zero_paid_sale_fraction','first_paid_release_app_population','verified_merchant_income','real_checkout_price','repeat_paid_customer_retention'])assert.equal(s[k],null);
 assert(Object.values(study.unknown).every(v=>v===null));
});
test('No launched copies means conditional under-two-hours share is undefined',()=>{
 const s=audit({fixture_id:'fixture-never-launched',owned_copies:5,zero_minute_copies:5,launched_under_two_hours_copies:0});
 assert.equal(s.zero_playtime_share,1);assert.equal(s.under_two_hours_given_launched_share,null);
});
test('Reject malformed synthetic records and real account/game/price inputs',()=>{
 const x={fixture_id:'fixture-valid',owned_copies:10,zero_minute_copies:2,launched_under_two_hours_copies:4};
 for(const c of [{account_id:'secret'},{appid:1},{price_usd:2},{fixture_id:'game-title'},{owned_copies:0},{zero_minute_copies:11},{launched_under_two_hours_copies:9},{zero_minute_copies:2.5}])assert.throws(()=>audit({...x,...c}));
 assert.throws(()=>audit([10,2,4]));
});
test('Public provenance and fixed 293 tasks remain linked',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,1);assert.equal(study.claim_ids.length,11);
 for(const id of study.source_ids)assert(sources.has(id));
 for(const id of study.claim_ids){assert(claims.has(id));assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
