import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticCumulativeLaunchWindows as audit} from '../site/steam-two-window-selfreport-cash-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/coinsweeper-two-window-first-launch-gross-vs-net-2026.json'),
 d=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
const f=()=>({fixture_id:'fixture-two-observations',early_days:2,late_days:28,
 early_units_approx:280,late_units_approx:800,early_gross_cents:111800,late_gross_cents:329500,
 early_author_net_cents:95100,late_author_net_cents:259300,author_net_is_verified_bank_receipt:false});
test('Single release cumulative windows yield descriptive differences, not further payments',()=>{
 const x=audit(f());assert.equal(x.descriptive_units_change_approx,520);
 assert.equal(x.descriptive_gross_change_usd,2177);
 assert.equal(x.descriptive_author_net_change_undefined_basis_usd,1642);
 assert.equal(x.author_net_is_settled_payout,false);
});
test('Net category, refunds, bank cash and fixed-launch wishlist conversion stay unknown',()=>{
 const x=audit(f());
 for(const k of ['actual_refunded_orders','verified_incremental_paid_orders','bank_cash_received_usd',
 'after_labor_profit_usd','matched_launch_wishlist_conversion','representative_first_paid_median_usd',
 'zero_actual_paid_sales_fraction'])assert.equal(x[k],null,k);
 assert(Object.values(study.unknown).every(x=>x===null));
 assert.equal(study.descriptive_differences_not_settlement.net_deduction_basis_known,false);
});
test('Time-window and population violations fail closed',()=>{
 for(const bad of [
  {late_days:2},{early_days:0},{late_gross_cents:111799},{late_units_approx:279},
  {late_author_net_cents:95099},{early_units_approx:2.5},
  {author_net_is_verified_bank_receipt:true},{gross_sales_partner_id:'hidden'},
  {real_appid:4321130}
 ])assert.throws(()=>audit({...f(),...bad}));
 assert.throws(()=>audit([2,28,280,800]));
});
test('Public sources and claims are linked without changing original 293 tasks',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
