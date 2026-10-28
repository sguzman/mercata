import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundedModelZeros,withinSnapshotShare,compareSnapshots} from '../site/steam-model-bounds.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json'),r=get('ontology/steam/model-validation-and-low-end-bounds-2026.json');
test('Model-zero bounds preserve 19 missing estimates and avoid inferring true zero sale',()=>{
 const x=boundedModelZeros({listed:1230,estimated:1211,modelZeros:412});
 assert.equal(x.missing,19);assert.equal(x.lower_model_zero_share,412/1230);
 assert.equal(x.upper_model_zero_share,431/1230);assert.equal(x.exact_zero_paid_order_fraction,null);
 assert.equal(r.partial_identification.actual_zero_copy_fraction,null);
});
test('Invalid cohort arithmetic is rejected rather than interpreted as zero',()=>{
 for(const x of [{listed:12,estimated:13,modelZeros:1},{listed:12,estimated:3,modelZeros:4},{listed:0,estimated:0,modelZeros:0}])assert.throws(()=>boundedModelZeros(x));
 assert.equal(boundedModelZeros({listed:2,estimated:0,modelZeros:0}).observed_model_zero_share_among_estimated,null);
});
test('Different dated Gamalytic source snapshots are never pooled',()=>{
 const a=withinSnapshotShare({num:8388,den:12732,snapshotId:'Oct2025-GamesRadar'});
 const b=withinSnapshotShare({num:8502,den:12875,snapshotId:'Oct2025-GamingNews'});
 assert(a.share>0.65&&a.share<0.67);assert(b.share>0.65&&b.share<0.67);
 assert.equal(compareSnapshots(a,b).can_combine_counts,false);
 assert.equal(compareSnapshots(a,a).can_combine_counts,true);
});
test('Accuracy validation excluded under-1000 sellers and wishlist panel excluded low review games',()=>{
 assert.equal(r.model_validation.excludes_below_actual_units,1000);
 assert.equal(r.model_validation.model_accuracy_claim_validated_on_true_zeroes,false);
 assert.equal(r.wishlist_study.filtered_more_than_20_reviews,true);
 assert.equal(r.wishlist_study.reported_sample_size,5744);
 assert.equal(r.no_merchant_data_accessed,true);
});
test('New bounded claims and original task denominator are fully grounded',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(r.source_ids.length,7);assert.equal(r.claim_ids.length,21);
 for(const s of r.source_ids)assert(sources.has(s),s);
 for(const id of r.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
