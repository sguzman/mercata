import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundGrossPaidGameLowerMedian} from '../site/steam-gross-median-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/nonresponse-gross-median-identification-bounds-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Synthetic complete observed cohort gives a point identified lower median',()=>{
 const r=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[100,0,50,20,10],frameComplete:true});
 assert.equal(r.lower_median_dollars_lower_bound,20);assert.equal(r.lower_median_dollars_upper_bound,20);assert.equal(r.median_point_identified,true);
});
test('Missing outcomes yield ordered partial identification intervals, not imputations',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30],frameComplete:true});
 assert.equal(a.lower_median_dollars_lower_bound,0);assert.equal(a.lower_median_dollars_upper_bound,30);assert.equal(a.exact_zero_sale_fraction,null);
 const b=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30,40],frameComplete:true});
 assert.equal(b.lower_median_dollars_lower_bound,20);assert.equal(b.lower_median_dollars_upper_bound,30);
});
test('Three missing out of five has unbounded upper median; does not assert infinity in dollars',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20],frameComplete:true});
 assert.equal(a.lower_median_dollars_lower_bound,0);assert.equal(a.lower_median_dollars_upper_bound,null);assert.equal(a.upper_is_unbounded,true);
 assert.equal(a.developer_net_payout_median,null);
});
test('An incomplete frame cannot report even conditional population bounds',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30,40,50]});
 assert.equal(a.lower_median_dollars_lower_bound,null);assert.equal(a.lower_median_dollars_upper_bound,null);
 assert.throws(()=>boundGrossPaidGameLowerMedian({eligibleFrameSize:1,observedGrossUsd:[-1],frameComplete:true}),/nonnegative/);
 assert.throws(()=>boundGrossPaidGameLowerMedian({eligibleFrameSize:1,observedGrossUsd:[1,2],frameComplete:true}),/frame/);
});
test('No empirical claims are created and original 293 tasks remain unchanged',()=>{
 const sourceIds=new Set(d.evidence.map(e=>e.id)),claimIds=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(sourceIds.has(id),id);
 for(const id of x.claim_ids){assert(claimIds.has(id),id);assert(claimIds.get(id).source_ids.every(s=>sourceIds.has(s)));}
 assert.equal(x.unknown.actual_steam_median_gross,null);
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
