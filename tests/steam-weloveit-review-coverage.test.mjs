import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamReviewRevenueCoverage as audit} from '../site/steam-weloveit-review-coverage.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const snapshot=get('ontology/steam/steam-weloveit-review-revenue-snapshot-2026.json'),dossier=get('specimens/steam.json'),plan=get('plans/steam.json'),queue=get('queues/steam.json');
test('Public review model snapshot reconciles catalogue classes without imputing paid sales',()=>{
 const c=snapshot.catalog,r=audit(c);
 assert.equal(c.priced_with_at_least_one_review+c.paid_with_zero_reviews+c.free_games+c.missing_published_price,c.reported_released_game_listings);
 assert.equal(r.report_catalog_count,142797);
 assert.equal(r.model_measured_priced_reviewed_games,103682);
 assert.equal(r.priced_reviewless_paid_games,9227);
 assert.equal(r.known_priced_games_in_report,112909);
 assert(r.priced_reviewless_share_in_known_priced>0.08&&r.priced_reviewless_share_in_known_priced<0.09);
 assert.equal(r.actual_zero_paid_sale_count,null);
 assert.equal(r.report_headline_median_population_verified,false);
});
test('Unreconciled price exclusions are not silently subtracted a second time',()=>{
 const r=audit(snapshot.catalog);
 assert.equal(r.expensive_exclusion_overlap_unresolved,true);
 assert.throws(()=>audit({...snapshot.catalog,expensive_exclusion_disjointness_attested:true}),/Unsupported/);
 assert.throws(()=>audit({...snapshot.catalog,originally_paid_release_cohort_verified:true}),/Unsupported/);
 assert.throws(()=>audit({...snapshot.catalog,delisted_status_and_release_age_reconciled:true}),/Unsupported/);
});
test('Snapshot counts and private or nonsensical inputs fail closed',()=>{
 const a=snapshot.catalog;
 for(const patch of [{paid_with_zero_reviews:9228},{priced_with_at_least_one_review:-1},
  {reported_released_game_listings:0},{free_games:Number.MAX_SAFE_INTEGER}]){
  assert.throws(()=>audit({...a,...patch}),/counts|reconcile/);
 }
 assert.throws(()=>audit({...a,secret_partner_account:'private'}),/permitted/);
});
test('Lifetime model estimates remain distinct from paid orders and publisher cash',()=>{
 assert.equal(snapshot.published_model.default_sales_per_review_multiplier,35);
 assert.deepEqual(snapshot.published_model.published_selectable_multipliers,[20,35,50]);
 assert.equal(snapshot.published_model.headline_median_inclusion_of_zero_review_paid,'not_explicitly_resolved');
 assert.equal(snapshot.published_model.top_one_percent_estimated_gross_share,.845);
 assert(Object.values(snapshot.unknown).every(value=>value===null));
 assert.equal(audit(snapshot.catalog).actual_publisher_takehome_median,null);
 assert.equal(snapshot.no_private_financial_data,true);
});
test('New primary source and limited claims join original 293-task research inventory',()=>{
 const src=new Map(dossier.evidence.map(item=>[item.id,item])),claims=new Map(dossier.claims.map(item=>[item.id,item]));
 assert.equal(snapshot.source_ids.length,1);assert.equal(snapshot.claim_ids.length,7);
 for(const id of snapshot.source_ids)assert(src.has(id),id);
 for(const id of snapshot.claim_ids){
  assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(s=>src.has(s)),id);
 }
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(q=>q.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
