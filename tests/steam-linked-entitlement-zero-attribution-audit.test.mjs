import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditLinkedEntitlementZeroAttribution as audit} from '../site/steam-linked-entitlement-zero-attribution-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-carrier-command-vr-linked-attribution-2026.json');
const sample=()=>({fixture_id:'fixture-linked-edition',base_app_fixture:'fixture-base',
 linked_app_fixture:'fixture-vr',ownership_bundled:true,
 base_received_reported_sales_credit:true,linked_edition_credited_sales:0,
 linked_app_first_paid_own_checkout_verified:false,merchant_report_accessed:false});
test('Zero credited separate VR AppID does not mean zero buyers of bundled product',()=>{
 const a=audit(sample());
 assert.equal(a.linked_edition_credit_count,0);
 assert.equal(a.linked_edition_credit_is_product_wide_zero_orders,false);
 assert.equal(a.linked_app_independently_paid_original_release_proven,false);
 assert.equal(a.unrelated_originally_paid_game_census_candidate,false);
 assert.equal(a.verified_customer_count_for_linked_product,null);
 assert.equal(a.actual_zero_order_steam_game_fraction,null);
});
test('Selected first-party 2021/2022 case preserves unverified checkout and financial unknowns',()=>{
 const c=study.case;
 assert.equal(c.shared_purchase_entitlement_stated,true);
 assert.equal(c.author_reported_credited_sales_for_vr_app,0);
 assert.equal(c.author_says_all_sales_assigned_to_base_game,true);
 assert.equal(c.independent_original_paid_vr_launch_attested,false);
 assert.equal(c.actual_base_game_paid_order_count,null);
 assert.equal(c.actual_linked_product_zero_buyer_finding,null);
 assert.equal(study.population_inference.marketwide_zero_paid_first_launch_fraction,null);
});
test('Reject real app IDs, imported merchant records, invented independent VR launch and conflicting zero credits',()=>{
 const changes=[
  x=>x.base_app_fixture=1489630,
  x=>x.linked_app_fixture=x.base_app_fixture,
  x=>x.ownership_bundled=false,
  x=>x.linked_edition_credited_sales=1,
  x=>x.linked_app_first_paid_own_checkout_verified=true,
  x=>x.merchant_report_accessed=true,
  x=>x.customer_ids=[12],
  x=>x.sales_per_country={}
 ];
 for(const update of changes){const x=sample();update(x);assert.throws(()=>audit(x));}
});
test('Three public source records and claims link to existing original zero-sales research task',()=>{
 const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const src=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of study.source_ids)assert(src.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(id=>src.has(id)));}
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 const t=all.find(x=>x.id==='steam/income/measure-exact-zero-sale-fraction');assert(t);
 for(const ref of ['ontology/steam/steam-carrier-command-vr-linked-attribution-2026.md',
  'ontology/steam/steam-carrier-command-vr-linked-attribution-2026.json',
  'site/steam-linked-entitlement-zero-attribution-audit.mjs',
  'tests/steam-linked-entitlement-zero-attribution-audit.test.mjs'])assert(t.evidence.includes(ref),ref);
 assert.equal(p.progress_percent,Math.round(all.reduce((n,x)=>n+(x.percent??x.progress),0)/293));
});
