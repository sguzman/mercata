import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticOneDayWishlistReport as audit} from '../site/steam-short-launch-wishlist-metric-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/crazy-city-golf-dayone-four-sales-wishlist-conversion-denominators-2026.json'),
 dossier=load('specimens/steam.json'),plan=load('plans/steam.json'),queue=load('queues/steam.json');
const f=()=>({fixture_id:'fixture-sample',total_reported_sales:4,wishlist_stock_lower_bound_exclusive:300,dashboard_conversion_pct_label:0.3,is_paid_release:true,demo_is_free:true});
test('Free demo AppID is not paid game first launch and first-day positive sales are right-censored',()=>{
 assert.equal(study.identity.free_demo_app_id,5382250);assert.equal(study.identity.main_paid_game_app_id,5347600);
 assert(study.identity.free_demo_release<study.identity.main_paid_release);
 assert.equal(study.identity.main_first_paid_game_count,1);
 assert.equal(study.public_report.copies_sold_after_more_than_one_day_reported,4);
 assert.equal(study.interpretation.short_one_day_window_not_lifetime,true);
});
test('Reported wishlist dashboard percentage cannot be computed from all purchases divided by rounded wishlist stock',()=>{
 const r=audit(f());assert.equal(r.reported_total_units,4);assert.equal(r.reported_dashboard_conversion_pct,0.3);
 assert(Math.abs(r.total_sales_to_wishlist_threshold_upper_bound-4/300)<1e-12);
 assert.notEqual(r.total_sales_to_wishlist_threshold_upper_bound*100,0.3);
 for(const key of ['authentic_matched_wishlist_buyer_count','authentic_wishlist_cohort_denominator','independently_validated_dashboard_conversion_pct','merchant_paid_orders','merchant_gross_usd','developer_profit_usd','exact_zero_paid_sale_app_fraction','causal_press_incremental_sales'])assert.equal(r[key],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Zero store reviews, first-week promotion and second-person reporting do not establish receipts or profitability',()=>{
 assert.equal(study.contemporary_store_snapshot.public_reviews_at_retrieval,0);
 assert.equal(study.contemporary_store_snapshot.zero_reviews_proves_zero_sales,false);
 assert.equal(study.contemporary_store_snapshot.temporary_launch_discount_pct,40);
 assert.equal(study.public_report.reporter_role,'friend_of_game_developer_not_authenticated_merchant');
});
test('Reject seller identity, paid demo and malformed hypothetical values',()=>{
 for(const change of [{account_id:'private'},{steam_app_id:5347600},{price:5.99},{is_paid_release:false},{demo_is_free:false},{total_reported_sales:-1},{dashboard_conversion_pct_label:101},{wishlist_stock_lower_bound_exclusive:3.1},{fixture_id:'real game'}])assert.throws(()=>audit({...f(),...change}));
 assert.throws(()=>audit([4,300,0.3]));
});
test('All source-linked claims and unchanged 293 original tasks preserve progress integrity',()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,4);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
