import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticReviewlessEstimation as audit} from '../site/steam-reviewless-estimator-denominator-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/indielist-v1-reviewless-excluded-vs-zero-paid-sale-2026.json'),
d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const f=()=>({fixture_id:'fixture-reviewed',reviews:10,release_year:2026,price_usd_cents:1000,positive_pct:90,studio_size:'solo',genre:'rpg'});
test('Public v1 parameters reproduce bounded, additive white-box arithmetic without validation',()=>{
 const v=study.original_machine_spec;assert.equal(v.nb_base,50);assert.equal(v.nb_min,15);assert.equal(v.nb_max,150);
 assert.equal(v.net_list_price_factor,0.5712);
 assert.equal(v.provider_validation_status,'runtime_parity_tested_not_ground_truth_backtested');
 const z=audit(f());assert.equal(z.additive_multiplier_nb,50);
 assert.equal(z.synthetic_estimated_units,500);
 assert.equal(z.synthetic_fixed_lower_units,300);
 assert.equal(z.synthetic_fixed_upper_units,700);
 assert.equal(z.synthetic_net_revenue_usd_heuristic,2856);
 assert.equal(z.modeled_range_is_calibrated_interval,false);
});
test('Reviewless game excluded by model must not be labeled a zero-order game',()=>{
 const z=audit({...f(),reviews:0,fixture_id:'fixture-unreviewed'});
 assert.equal(z.estimator_status,'excluded_no_reviews');
 for(const k of ['synthetic_estimated_units','synthetic_fixed_lower_units','synthetic_fixed_upper_units','synthetic_net_revenue_usd_heuristic',
   'authenticated_paid_orders','actual_zero_paid_sale_app_fraction','publisher_bank_cash_usd'])assert.equal(z[k],null,k);
 assert.equal(study.observation_controls.unreviewed_means_not_estimated,true);
 assert.equal(study.example_public_anecdote.report_authenticated_by_mercata,false);
});
test('Unobserved price and positive-rating fallback are assumptions rather than measurements',()=>{
 const z=audit({...f(),reviews:1,price_usd_cents:null,positive_pct:null,studio_size:'small',genre:'other'});
 assert.equal(z.additive_multiplier_nb,40);
 assert.equal(z.synthetic_estimated_units,40);
 assert.equal(z.synthetic_net_revenue_usd_heuristic,40*15*0.5712);
});
test('Low multiplier clamped to 15 and all payee outcomes remain missing',()=>{
 const z=audit({...f(),price_usd_cents:200,positive_pct:50,studio_size:'solo',genre:'casual'});
 assert.equal(z.additive_multiplier_nb,15);
 for(const k of ['authenticated_paid_orders','actual_zero_paid_sale_app_fraction','publisher_bank_cash_usd','after_cost_profit_usd','measured_prediction_error'])assert.equal(z[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Synthetic guard rejects real AppIDs, unsupported categories and malformed inputs',()=>{
 for(const change of [{appid:123},{partner_id:'owner'},{price:4},{fixture_id:'real-game'},{reviews:-1},
  {release_year:1900},{studio_size:'unknown_new'},{genre:'fantasy'},{price_usd_cents:10.1},{positive_pct:105}])
   assert.throws(()=>audit({...f(),...change}));
 assert.throws(()=>audit([10,2026,1000]));
});
test('Source/claim joins preserve the original 293 Steam tasks',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.claim_ids.length,11);assert.equal(study.source_ids.length,3);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)),id);}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(x=>x.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
