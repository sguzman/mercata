import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {modeledZeroMissingnessBounds} from '../site/steam-modeled-zero-bounds.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/january-2026-modeled-zero-missingness-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json'),original=get('ontology/steam/january-2026-modeled-paid-release-distribution.json');
test('Valid missing-estimate sensitivity, unchanged reported inputs',()=>{
 const r=modeledZeroMissingnessBounds({listed:1230,estimated:1211,modeled_zero:412});
 assert.equal(r.missing,19);
 assert(Math.abs(r.among_estimated-412/1211)<1e-12);
 assert(Math.abs(r.lower_fraction_among_listed-412/1230)<1e-12);
 assert(Math.abs(r.upper_fraction_among_listed-431/1230)<1e-12);
 assert.deepEqual(x.input,{cohort_listed_titles:1230,models_with_estimates:1211,modeled_zero_copy_entries:412,missing_model_estimates:19});
 assert.equal(original.zero_estimation.observed_exact_zero_paid_steam_units_fraction,null);
});
test('Missing estimates and zero estimates cannot infer actual merchant zeroes',()=>{
 const r=modeledZeroMissingnessBounds({listed:5,estimated:0,modeled_zero:0});
 assert.equal(r.among_estimated,null);
 assert.equal(r.lower_fraction_among_listed,0);
 assert.equal(r.upper_fraction_among_listed,1);
 assert.equal(r.actual_zero_paid_orders_fraction,null);
 assert.throws(()=>modeledZeroMissingnessBounds({listed:3,estimated:4,modeled_zero:1}),/Inconsistent/);
});
test('Seven grounded model claims, fixed 293 tasks',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.claim_ids.length,7);
 for(const id of x.source_ids)assert(sources.has(id));
 for(const id of x.claim_ids){assert(claims.has(id));assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const v=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(v.length,293);assert.equal(Math.round(v.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});
