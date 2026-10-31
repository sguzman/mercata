import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticReviewlessEstimation as audit} from '../site/steam-reviewless-estimator-denominator-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-crane-game-master-five-reported-copies-reviewless-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const day=s=>Date.parse(s+'T00:00:00Z');
test('Public Steam identity and first-party low-sales figure retain distinct evidence roles',()=>{
 assert.equal(study.game.appid,4825270);
 assert.equal(study.game.store_release_date,'2026-06-30');
 assert.equal(study.author_public_report.approximate_copies_sold,5);
 assert.equal(study.author_public_report.precision,'about');
 assert.equal(study.author_public_report.steamworks_ledger_authenticated,false);
 assert.equal(study.game.legal_payment_partner_identified,null);
});
test('Publication-date gap is calendar arithmetic, not an authenticated financial observation window',()=>{
 assert.equal((day(study.author_public_report.published_on)-day(study.game.store_release_date))/86400000,9);
 assert.equal(study.author_public_report.days_since_store_release_calendar,9);
 assert(study.observed_store_display.observed_on>study.author_public_report.published_on);
 assert.equal(study.observed_store_display.review_display_same_date_as_sales_report,false);
 assert.equal(study.author_public_report.first_commercial_steam_game_selfreported,true);
 assert.equal(study.author_public_report.solo_project_selfreported,true);
});
test('No-user-reviews label cannot be imputed as zero paid checkout orders',()=>{
 assert.equal(study.observed_store_display.review_display,'No user reviews');
 assert.equal(study.observed_store_display.exact_submitted_review_count,null);
 assert.equal(study.observed_store_display.paid_checkout_count,null);
 const r=audit({fixture_id:'fixture-unreviewed',reviews:0,release_year:2026,
  price_usd_cents:399,positive_pct:null,studio_size:'solo',genre:'casual'});
 assert.equal(r.estimator_status,'excluded_no_reviews');
 assert.equal(r.synthetic_estimated_units,null);
 assert.equal(r.authenticated_paid_orders,null);
 assert.equal(study.interpretation.missing_review_signal_does_not_prove_zero_paid_sales,true);
});
test('Unknown finance, population and profitability fields stay unknown',()=>{
 assert(Object.values(study.unknown).every(v=>v===null));
 assert.equal(study.interpretation.merchant_verified_five_copies,false);
 assert.equal(study.interpretation.representative_income_or_zero_sales_sample,false);
 assert.equal(study.private_records_accessed,false);
});
test('Two public sources and eight claims are present and joined in the Steam dossier',()=>{
 const ids=new Set(d.evidence.map(x=>x.id));
 const claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);
 assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){
  const c=claims.get(id);assert(c,id);
  assert(c.source_ids.every(id=>ids.has(id)));
 }
 // Global source totals can grow as independent studies are added.
 assert(d.evidence.length>=study.source_ids.length);
 assert(d.claims.length>=study.claim_ids.length);
});
test('Original Steam task inventory and updated source-linked progress remain coherent',()=>{
 const tasks=[...p.detail_tasks,...q.queues.flatMap(x=>x.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(t=>t.id)).size,293);
 for(const id of ['steam/income/measure-exact-zero-sale-fraction','income/zeros','sales/reputation']){
  const x=tasks.find(t=>t.id===id);
  assert(x.evidence.includes('ontology/steam/steam-crane-game-master-five-reported-copies-reviewless-2026.md'));
  assert(x.evidence.includes('ontology/steam/steam-crane-game-master-five-reported-copies-reviewless-2026.json'));
 }
 const exact=tasks.reduce((sum,t)=>sum+(t.percent??t.progress),0)/293;
 assert.equal(p.progress_percent,Math.round(exact));
});
