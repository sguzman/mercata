import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditPublicSteamPriceBins as audit} from '../site/steam-public-price-bin-integrity.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-public-launch-price-bucket-and-cohort-integrity-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const frame={paid_frame_count:111356,whole_dollar_zero_bin:11504,exact_0_99_count:11480,exact_4_99_count:15846};
test('The alleged $0 price bin mostly contains exactly $0.99 prices conditionally',()=>{
 const x=audit(frame);
 assert.equal(x.other_zero_bin_count_at_most,24);
 assert.equal(x.conditional_minimum_share_of_zero_bin_at_0_99,11480/11504);
 assert(x.conditional_minimum_share_of_zero_bin_at_0_99>0.997);
 assert.equal(x.frame_definition_verified,false);
 assert.equal(x.actual_free_game_count,null);
 assert.equal(x.actual_paid_order_count,null);
 assert.equal(x.actual_developer_profit,null);
});
test('A common $4.99 launch price is a catalog frequency, not price elasticity or earnings',()=>{
 const x=audit(frame);
 assert.equal(x.conditional_share_of_frame_at_4_99,15846/111356);
 assert.equal(x.observed_price_elasticity,null);
 assert.equal(study.scope_gates.price_frequency_is_sales_weighted,false);
 assert.equal(study.scope_gates.retail_price_is_observed_checkout,false);
 assert.equal(study.scope_gates.price_anchor_is_optimal_price,false);
 assert(study.annual_summary_usd.some(x=>x.release_year===2026&&x.year_complete===false));
 assert(Object.values(study.unknown).every(v=>v===null));
});
test('Invalid and mismatched public price count frames fail closed',()=>{
 assert.throws(()=>audit({...frame,whole_dollar_zero_bin:-1}),/Invalid/);
 assert.throws(()=>audit({...frame,whole_dollar_zero_bin:0,exact_0_99_count:1}),/Inconsistent/);
 assert.throws(()=>audit({...frame,exact_0_99_count:12000}),/Inconsistent/);
 assert.throws(()=>audit({...frame,exact_4_99_count:111357}),/Inconsistent/);
 assert.throws(()=>audit({...frame,paid_frame_count:3.4}),/Invalid/);
});
test('Source-linked price claims retain original fixed Steam inventory and status',()=>{
 const sources=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((sum,n)=>sum+n,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/competition/model-price-distributions').evidence.includes('ontology/steam/steam-public-launch-price-bucket-and-cohort-integrity-2026.json'));
});
