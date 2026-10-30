import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamRegionalDiscountFloors as check} from '../site/steam-regional-discount-floors.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const base={fixture_id:'fixture-local-floor-study',discount_percent:50,
 price_state:'current',market_roster_complete_in_fixture:true,
 markets:[
 {market:'USD',current_base_price_units:499,minimum_base_price_units:99,minimum_transaction_price_units:49},
 {market:'MXN',current_base_price_units:2000,minimum_base_price_units:180,minimum_transaction_price_units:90}
 ]};
test('Supplied local minima pass conditionally without claiming actual Steam eligibility',()=>{
 const a=check(base);
 assert.equal(a.new_discount_scheduling_clears_supplied_minimums,true);
 assert.equal(a.markets_examined,2);
 assert.equal(a.market_results[0].proposed_discount_price_lower_bound_units,249);
 assert.equal(a.market_results[0].proposed_discount_price_upper_bound_units,250);
 assert.equal(a.market_results[0].proposed_discount_meets_transaction_floor,true);
 assert.equal(a.steamworks_discount_permission_verified,false);
 assert.equal(a.real_local_minimum_thresholds_independently_verified,false);
 assert.equal(a.true_price_elasticity,null);
});
test('One failing local market blocks new discounts globally; US price alone cannot approve',()=>{
 const rows=[...base.markets,{market:'JPY',current_base_price_units:120,
  minimum_base_price_units:100,minimum_transaction_price_units:70}];
 const result=check({...base,markets:rows});
 assert.equal(result.new_discount_scheduling_clears_supplied_minimums,false);
 assert.deepEqual(result.markets_with_known_local_blockers,['JPY']);
 assert.equal(result.market_results[0].proposed_discount_market_status,'clears_supplied_transaction_minimum');
});
test('Missing market price produces market unavailability without proving zero demand',()=>{
 const rows=[...base.markets,{market:'JPY',current_base_price_units:null,
  minimum_base_price_units:100,minimum_transaction_price_units:50}];
 const a=check({...base,markets:rows});
 assert.equal(a.new_discount_scheduling_clears_supplied_minimums,false);
 assert.equal(a.market_results[2].current_price_unavailable_in_market,true);
 assert.equal(a.sales_in_missing_or_blocked_markets,null);
 assert(a.markets_with_known_local_blockers.includes('JPY'));
});
test('Unknown local threshold or incomplete market roster must not become a pass',()=>{
 const row={market:'MXN',current_base_price_units:500,
  minimum_base_price_units:null,minimum_transaction_price_units:null};
 const a=check({...base,markets:[row]});
 assert.equal(a.new_discount_scheduling_clears_supplied_minimums,null);
 assert.deepEqual(a.markets_with_unresolved_price_or_floor,['MXN']);
 assert.equal(check({...base,market_roster_complete_in_fixture:false})
  .new_discount_scheduling_clears_supplied_minimums,null);
});
test('Unknown price rounding at exactly a transaction floor is unresolved, not invented',()=>{
 const row={market:'USD',current_base_price_units:99,
  minimum_base_price_units:99,minimum_transaction_price_units:50};
 const a=check({...base,markets:[row]});
 assert.equal(a.market_results[0].proposed_discount_price_lower_bound_units,49);
 assert.equal(a.market_results[0].proposed_discount_price_upper_bound_units,50);
 assert.equal(a.market_results[0].proposed_discount_meets_transaction_floor,null);
 assert.equal(a.new_discount_scheduling_clears_supplied_minimums,null);
 assert.equal(check({...base,markets:[{...row,minimum_transaction_price_units:49}]})
  .new_discount_scheduling_clears_supplied_minimums,true);
});
test('A current legacy base below new-entry floor is not automatically an unsellable price',()=>{
 const row={market:'USD',current_base_price_units:75,
  minimum_base_price_units:99,minimum_transaction_price_units:30};
 const current=check({...base,discount_percent:50,markets:[row]});
 assert.equal(current.new_discount_scheduling_clears_supplied_minimums,true);
 assert.equal(current.market_results[0].newly_entered_base_price_meets_minimum,null);
 const proposed=check({...base,discount_percent:50,price_state:'post_change',
  post_change_prices_published_in_fixture:true,markets:[{...row,post_change_base_price_units:75}]});
 assert.equal(proposed.new_discount_scheduling_clears_supplied_minimums,false);
 assert.equal(proposed.market_results[0].newly_entered_base_price_meets_minimum,false);
});
test('Regional base-price change can newly block or unblock the same proposed discount',()=>{
 const row={market:'USD',current_base_price_units:499,
  post_change_base_price_units:99,minimum_base_price_units:99,
  minimum_transaction_price_units:49};
 const old=check({...base,discount_percent:75,markets:[row]});
 assert.equal(old.new_discount_scheduling_clears_supplied_minimums,true);
 const newPrice=check({...base,discount_percent:75,price_state:'post_change',
  post_change_prices_published_in_fixture:true,markets:[row]});
 assert.equal(newPrice.new_discount_scheduling_clears_supplied_minimums,false);
 assert.equal(newPrice.market_results[0].newly_entered_base_price_meets_minimum,true);
 const notPublished=check({...base,discount_percent:50,price_state:'post_change',
  post_change_prices_published_in_fixture:false,markets:[row]});
 assert.equal(notPublished.new_discount_scheduling_clears_supplied_minimums,null);
});
test('Newly entered local price below the base minimum is different from transaction minimum',()=>{
 const row={market:'USD',current_base_price_units:500,
  post_change_base_price_units:75,minimum_base_price_units:99,
  minimum_transaction_price_units:20};
 const out=check({...base,price_state:'post_change',
  post_change_prices_published_in_fixture:true,markets:[row]});
 assert.equal(out.new_discount_scheduling_clears_supplied_minimums,false);
 assert.equal(out.market_results[0].proposed_discount_meets_transaction_floor,true);
 assert.equal(out.market_results[0].newly_entered_base_price_meets_minimum,false);
});
test('All supplied fields, duplicate markets, unsupported discounts and unsafe money fail closed',()=>{
 assert.throws(()=>check({...base,discount_percent:96}),/Bounded synthetic/);
 assert.throws(()=>check({...base,discount_percent:9}),/Bounded synthetic/);
 assert.throws(()=>check({...base,price_state:'post_change'}),/publication attestation/);
 assert.throws(()=>check({...base,earnings_usd:12}),/Bounded synthetic/);
 assert.throws(()=>check({...base,markets:[...base.markets,base.markets[0]]}),/Malformed/);
 assert.throws(()=>check({...base,markets:[{...base.markets[0],current_base_price_units:1e16}]}),/Malformed/);
 assert.throws(()=>check({...base,markets:[{...base.markets[0],minimum_transaction_price_units:0}]}),/Malformed/);
 assert.throws(()=>check({...base,markets:Array(65).fill(base.markets[0])}),/Bounded synthetic/);
 assert.throws(()=>check({...base,markets:[{...base.markets[0],market:'fake'}]}),/Malformed/);
});
test('Existing Steam public research links and the fixed task inventory survive the new audit',()=>{
 const x=read('ontology/steam/regional-price-realization-and-value-2026.json');
 const dossier=read('specimens/steam.json'),plan=read('plans/steam.json'),queues=read('queues/steam.json');
 const ids=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 for(const id of x.source_ids)assert(ids.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)),id);}
 assert.equal(x.minimum_threshold_audit.model_path,'site/steam-regional-discount-floors.mjs');
 assert.equal(x.minimum_threshold_audit.test_path,'tests/steam-regional-discount-floors.test.mjs');
 assert.equal(x.minimum_threshold_audit.authoritative_local_threshold_table_fetched,false);
 assert.equal(x.unknown.median_order_realization,null);
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queues.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
