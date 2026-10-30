import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamEarlyAccessDisclosure as audit} from '../site/steam-ea-firstpaid-payout-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-extraneum-ea-firstpaid-vs-v1-payout-2026.json'),
 d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({fixture_id:'fixture-ea-firstpaid',first_paid_date:'2022-06-14',version_one_date:'2024-09-25',
 units_reported:2400,reported_after_some_deductions_cents:1200000,
 wishlists_at_v1:10000,wishlists_after_year:10600,separate_external_publisher_named:true});
test('First paid Early Access and version 1.0 remain separate milestones on one AppID',()=>{
 const a=audit(fixture());assert.equal(a.first_paid_at,'2022-06-14');
 assert.equal(a.version_one_at,'2024-09-25');assert.equal(a.version_one_is_second_initial_paid_launch,false);
 assert.equal(study.release_history.full_release_is_a_second_firstpaid_game,false);
});
test('Author post-deduction game receipts are neither bank income nor a verified labor wage',()=>{
 const a=audit(fixture());assert.equal(a.descriptive_amount_per_unit_usd,5);
 assert.equal(a.author_bank_deposit_usd,null);assert.equal(a.publisher_royalty_share,null);
 assert.equal(a.actual_hourly_wage,null);assert.equal(a.first_paid_launch_revenue,null);
 assert.equal(study.named_roles.publisher_agreement_observed,false);
});
test('Outstanding wishlists are not converted to sales',()=>{
 const a=audit(fixture());assert.equal(a.outstanding_wishlist_balance_change,600);
 assert.equal(a.wishlist_change_equals_new_buyers,false);assert.equal(a.post_v1_paid_orders,null);
 assert.equal(a.zero_paid_sale_fraction,null);assert.equal(a.causal_early_access_gain,null);
});
test('Reject date reversals, impossible count and unapproved private money fields',()=>{
 for(const patch of [{first_paid_date:'2024-09-25'},{first_paid_date:'2022-02-30'},
 {version_one_date:'2022-06-14'},{units_reported:-1},{reported_after_some_deductions_cents:12.5},
 {separate_external_publisher_named:false},{private_partner_id:'secret'},
 {actual_royalty_share:0.5}])assert.throws(()=>audit({...fixture(),...patch}));
 assert.throws(()=>audit([2400,12000]));
});
test('Two source records and all claim references preserve the original 293 tasks',()=>{
 const sourceIds=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(sourceIds.has(id));
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>sourceIds.has(x)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(study.unknown).every(x=>x===null));
});
