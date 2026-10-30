import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticCatalogProfileFreshness as audit} from '../site/steam-catalog-profile-freshness-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/gamerevenuedata-sept16-catalog-profile-revenue-freshness-frame-2026.json'),
 d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const f=()=>({fixture_id:'fixture-public-aggregate',catalog_entries:157684,published_profiles:23189,
 revenue_freshness:{recent:0,stale:20371,unknown:2818},
 player_freshness:{recent:0,stale:1069,unknown:22120},capture_is_atomic:false});
test('Published September 16 profile freshness buckets reconcile separately to 23,189 profiles',()=>{
 const a=audit(f()),b=study.data_release;
 assert.equal(b.catalog_entries,157684);assert.equal(b.published_profiles,23189);
 assert.equal(a.revenue_profile_freshness_total,23189);
 assert.equal(a.player_profile_freshness_total,23189);
 assert.equal(a.all_profile_revenue_freshness_recent,false);
 assert.equal(study.published_method.revenue_rank_minimum_reviews,10);
 assert.equal(study.published_method.top_reviewed_minimum_reviews,100);
 assert.equal(study.published_method.ranking_display_limit,1000);
 assert.equal(study.data_release.upstream_capture_is_atomic,false);
});
test('No source catalog or profile size becomes actual paid-order zero fraction or bank cash',()=>{
 const a=audit(f());
 assert(Math.abs(a.profile_to_catalog_ratio-23189/157684)<1e-12);
 assert.equal(a.profile_coverage_is_market_coverage,false);
 assert.equal(a.metric_observation_time_proven_by_export_timestamp,false);
 for(const k of ['actual_full_historical_first_paid_game_frame','actual_verified_merchant_paid_orders',
 'zero_paid_sale_app_fraction','representative_legal_publisher_bank_income'])assert.equal(a[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Rankings and profiles have distinct review thresholds and current no-revenue exclusions',()=>{
 assert.equal(study.published_method.delisted_games_included,false);
 assert.equal(study.published_method.tracked_catalog_includes_unestimated_games,true);
 assert.equal(study.published_method.confidence_score_is_calibrated_probability,false);
 assert.equal(study.published_method.net_modeled_not_legal_partner_cash,true);
});
test('Bad counts, fake personal data, missing buckets and catalog/profile swaps fail closed',()=>{
 const base=f();
 for(const patch of [{account_id:'secret'},{appid:12345},{fixture_id:'real title'},{published_profiles:157685},
  {catalog_entries:0},{published_profiles:-1},{capture_is_atomic:'false'},
  {revenue_freshness:{recent:0,stale:20371,unknown:2817}},
  {player_freshness:{recent:0,stale:1069,unknown:22120,users:[1]}}])
  assert.throws(()=>audit({...base,...patch}));
 assert.throws(()=>audit([157684,23189]));
});
test('Source-linked claims and unchanged 293 original Steam research tasks',()=>{
 const sids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,13);
 for(const id of study.source_ids)assert(sids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sids.has(s)));}
 const pts=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(y=>y.tasks.map(x=>x.progress))];
 assert.equal(pts.length,293);assert.equal(p.progress_percent,Math.round(pts.reduce((a,b)=>a+b,0)/293));
});
