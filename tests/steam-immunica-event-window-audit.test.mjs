import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticEventLaunchWindows as audit} from '../site/steam-event-wishlist-window-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/immunica-firstgame-niche-event-wishlist-and-sales-windows-2026.json'),
 dossier=load('specimens/steam.json'),plan=load('plans/steam.json'),queue=load('queues/steam.json');
const f=()=>({fixture_id:'fixture-launch',first_3day_units:147,first_week_units:234,later_units:895,niche_wishlist_additions:474,nextfest_wishlist_additions:160,same_observation_cohort:true});
test('Author cumulative checkpoints cannot be added as if they were independent new purchases',()=>{
 assert.equal(study.store.app_id,4315220);
 assert.equal(study.store.first_paid_release,'2026-03-29');
 assert.equal(study.public_author.published_at,'2026-10-15');
 const a=audit(f());assert.equal(a.descriptive_first3day_to_week_increment,87);
 assert.equal(a.descriptive_firstweek_to_later_increment,661);
 assert.equal(study.descriptive_only.report_is_only_three_months_sales,false);
});
test('Festival wishlist ratio is descriptive only; no causal or matched conversion',()=>{
 const a=audit(f());assert.equal(a.descriptive_reported_event_addition_ratio,2.9625);
 assert.equal(study.public_author.event_exposure_windows_identical,false);
 assert.equal(study.descriptive_only.festival_ratio_is_causal_effect,false);
 for(const k of ['causal_event_effect','matched_launch_wishlist_purchase_conversion','actual_partner_bank_receipts','developer_after_cost_profit','representative_first_paid_game_median','zero_paid_sale_fraction'])assert.equal(a[k],null);
 assert(Object.values(study.unknown).every(v=>v===null));
});
test('No denominator and mismatched cohorts cannot produce an inferred conversion rate',()=>{
 const a=audit({...f(),nextfest_wishlist_additions:0,same_observation_cohort:false});
 assert.equal(a.descriptive_reported_event_addition_ratio,null);
 assert.equal(a.descriptive_first3day_to_week_increment,null);
 assert.equal(a.descriptive_firstweek_to_later_increment,null);
 assert.equal(a.matched_launch_wishlist_purchase_conversion,null);
});
test('Reject duplicate or out-of-order observations and real player data',()=>{
 for(const bad of [{account_id:'secret'},{app_id:4315220},{real_sales:895},{first_week_units:146},{later_units:200},{nextfest_wishlist_additions:1.4},{same_observation_cohort:1},{fixture_id:'real game'}])assert.throws(()=>audit({...f(),...bad}));
 assert.throws(()=>audit([147,234,895]));
});
test('Public reference joins retain all 293 original Steam tasks',()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
