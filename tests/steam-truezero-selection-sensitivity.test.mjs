import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {conditionalTrueZeroSensitivity as audit} from '../site/steam-truezero-selection-sensitivity.mjs';
const json=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=json('ontology/steam/steam-two-stage-model-and-frame-zero-sensitivity-2026.json'),d=json('specimens/steam.json'),p=json('plans/steam.json'),q=json('queues/steam.json');
const input={listed:1230,estimated:1211,modeled_zero:412};
test('Public modeled counts alone cannot identify true zero paid orders',()=>{
 const a=audit(input);
 assert.equal(a.missing_estimates,19);
 assert.equal(a.conditional_true_zero_lower,null);
 assert.equal(a.conditional_true_zero_upper,null);
 assert.equal(a.actual_zero_paid_orders_fraction,null);
 assert.equal(a.caps_complete,false);
});
test('Fully specified but unvalidated sensitivity caps produce conditional logical extremes only',()=>{
 const a=audit({...input,assumed_false_zero_cap:100,assumed_missed_zero_cap:100,assumed_omitted_paid_games_cap:400});
 assert.equal(a.conditional_true_zero_lower,312/1630);
 assert.equal(a.conditional_true_zero_upper,931/1630);
 assert.equal(a.sensitivity_min_possible_zeros_in_observed_frame,312);
 assert.equal(a.sensitivity_max_possible_zeros_in_observed_frame,531);
 assert.equal(a.actual_original_paid_frame_size,null);
 assert.equal(a.confidence_interval,false);
 assert.equal(a.empirical_claim,false);
});
test('No model misclassification plus complete assumed frame recovers merely the model missing-value envelope',()=>{
 const a=audit({...input,assumed_false_zero_cap:0,assumed_missed_zero_cap:0,assumed_omitted_paid_games_cap:0});
 assert.equal(a.conditional_true_zero_lower,412/1230);
 assert.equal(a.conditional_true_zero_upper,431/1230);
 assert.equal(a.actual_zero_paid_orders_fraction,null);
});
test('Omitting all model estimates yields vacuous bounds, not a zero rate',()=>{
 const a=audit({listed:9,estimated:0,modeled_zero:0,assumed_false_zero_cap:0,assumed_missed_zero_cap:0,assumed_omitted_paid_games_cap:20});
 assert.equal(a.conditional_true_zero_lower,0);
 assert.equal(a.conditional_true_zero_upper,1);
 assert.equal(a.modeled_zero_share_among_estimated,null);
});
test('Invalid counts and implausible sensitivity caps are rejected',()=>{
 assert.throws(()=>audit({listed:123,estimated:124,modeled_zero:0}),/Contradictory/);
 assert.throws(()=>audit({...input,assumed_false_zero_cap:413}),/exceeds modeled zeros/);
 assert.throws(()=>audit({...input,assumed_missed_zero_cap:800}),/exceeds modeled nonzeros/);
 assert.throws(()=>audit({...input,assumed_omitted_paid_games_cap:-1}),/nonnegative integer/);
 assert.throws(()=>audit({listed:0,estimated:0,modeled_zero:0}),/Contradictory/);
});
test('Study assumptions are explicitly hypothetical and existing task inventory unchanged',()=>{
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,5);
 assert.equal(x.scenarios[0].assumed_omitted_paid_games_cap,400);
 const z=audit({...input,...x.scenarios[0]});
 assert.equal(z.conditional_true_zero_lower,312/1630);
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(s=>[s.id,s]));
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(y=>sources.has(y)),id);}
 const tasks=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(tasks.length,293);
 assert.equal(Math.round(tasks.reduce((n,v)=>n+v,0)/293),p.progress_percent);
 assert(Object.values(x.unknown).every(v=>v===null));
});
