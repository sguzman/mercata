import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSteamReviewGrossModelDisagreement as audit} from '../site/steam-review-gross-model-disagreement.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-two-review-gross-models-2026.json');
const sample=()=>structuredClone(study.providers);
test('Published seven PureGameStats outcome bins reconcile to reviewed priced game count',()=>{
 const a=audit(sample());
 const p=sample()[0];
 assert.equal(p.outcome_tier_counts.reduce((x,n)=>x+n,0),99015);
 assert.equal(a.reported_count_difference_b_minus_a,4761);
 assert.equal(a.providers[0].modeled_median_lifetime_gross_usd,1436);
 assert.equal(a.providers[1].modeled_median_lifetime_gross_usd,3493);
 assert(Math.abs(a.reported_model_median_ratio_b_to_a-2.43245)<.0001);
 assert.equal(a.model_disagreement_is_empirical_error_interval,false);
});
test('Two sites model gross only; no zero-paid-order or publisher after-cost inference',()=>{
 const a=audit(sample());
 assert.equal(a.provider_b_reported_reviewless_priced_games,9300);
 assert.equal(a.provider_b_headline_median_reviewless_inclusion_verified,false);
 assert.equal(a.provider_b_headline_median_includes_reviewless,null);
 assert.equal(study.scope.weloveit_headline_median_includes_zero_review_class,null);
 for(const k of ['actual_zero_paid_order_count','actual_paid_order_distribution',
  'verified_legal_publisher_income_median','verified_studio_net_profit_median',
  'total_paid_games_historically_launched'])assert.equal(a[k],null,k);
 assert.equal(a.compared_game_rosters_matched,false);
 assert.equal(a.top_one_percent_measures_verified_actual_revenue,false);
 assert.equal(study.privacy.appid_rows_imported,0);
});
test('Reject invented revenue partitions, mismatched tier counts, duplicate providers and private rows',()=>{
 const changes=[
  a=>a[0].outcome_tier_counts[0]+=1,
  a=>a[0].outcome_tiers_usd.reverse(),
  a=>a[0].priced_zero_review_games=100,
  a=>a[1].priced_reviewed_games=0,
  a=>a[1].outcome_tier_counts=[1],
  a=>a[1].publisher_income_known=true,
  a=>a[0].model_top_one_percent_share=2,
  a=>a[0].observed_on='2026-02-30',
  a=>a[1].id=a[0].id,
  a=>a[0].merchant_api_key='private'
 ];
 for(const change of changes){const a=sample();change(a);assert.throws(()=>audit(a));}
});
test('Evidence joins the existing WeLoveIt record and preserves original 293 tasks',()=>{
 const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const src=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of study.source_ids)assert(src.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>src.has(s)));}
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 const task=all.find(x=>x.id==='steam/income/estimate-median-developer-proceeds');assert(task);
 for(const path of ['ontology/steam/steam-two-review-gross-models-2026.md',
 'ontology/steam/steam-two-review-gross-models-2026.json',
 'site/steam-review-gross-model-disagreement.mjs',
 'tests/steam-review-gross-model-disagreement.test.mjs'])assert(task.evidence.includes(path));
 assert.equal(p.progress_percent,Math.round(all.reduce((s,t)=>s+(t.percent??t.progress),0)/293));
});
