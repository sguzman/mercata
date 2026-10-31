import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSteamLensePublicCatalogSnapshot as audit} from '../site/steam-steamlense-release-reviews-crosscheck.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-steamlense-release-reviews-crosscheck-2026.json');
const fixture=()=>({observed_at:study.observed_at,provider:study.provider,
 provider_release_year_rows:structuredClone(study.provider_release_year_rows),
 provider_review_count_row:structuredClone(study.provider_review_count_row)});
test('Public current-catalog paid/free annual totals reconcile without turning into an origin census',()=>{
 const a=audit(fixture());
 assert.deepEqual(a.years.map(x=>x.provider_reported_current_catalog_total),[17804,20632]);
 assert.equal(a.provider_reported_catalog_game_count_increase_2024_to_2025,2828);
 assert.equal(a.provider_reported_paid_category_count_increase_2024_to_2025,3070);
 assert.equal(a.originally_paid_first_public_launch_verified,false);
 assert.equal(a.delisted_historical_games_fully_included,false);
 for(const k of ['actual_zero_paid_sale_rate','verified_paid_units','legal_publisher_income'])assert.equal(a[k],null);
});
test('The 2025 61 percent under-ten-reviews is not 61 percent zero-order paid launches',()=>{
 const a=audit(fixture());
 assert.equal(a.fraction_of_2025_current_catalog_under_ten_public_reviews,0.61);
 assert.equal(a.share_is_all_paid_and_free_games_combined,true);
 assert.equal(a.measured_at_fixed_age_after_first_paid_release,false);
 assert.equal(a.shares_are_transaction_weighted,false);
 assert.equal(study.unknown.share_of_originally_paid_releases_below_ten_reviews,null);
 assert.equal(study.unknown.paid_2025_games_with_exactly_zero_orders,null);
});
test('Malformed captured calendar date, changed denominators, hidden app rows and recast review windows fail closed',()=>{
 const change=[
  x=>x.provider_release_year_rows[1].reported_all_games++,
  x=>x.provider_release_year_rows[0].year=2025,
  x=>x.provider_release_year_rows[1].reported_paid_games=-1,
  x=>x.provider_release_year_rows[0].game_ids=[123],
  x=>x.provider_review_count_row.reported_share_below_ten_reviews_percent=101,
  x=>x.provider_review_count_row.observation_window='exact first 30 days',
  x=>x.provider_review_count_row.denominator='paid-games-only',
  x=>x.observed_at='2026-02-30',
  x=>x.financial_api_key='private',
  x=>x.provider='Unknown'
 ];
 for(const f of change){const x=fixture();f(x);assert.throws(()=>audit(x));}
});
test('Source registration, three linked claims and existing 293-task inventory are preserved',()=>{
 const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)),id);}
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 for(const id of ['steam/market/assess-steam-catalog-growth','steam/competition/study-early-review-count-concentration']){
  const task=all.find(t=>t.id===id);assert(task,id);
  for(const path of ['ontology/steam/steam-steamlense-release-reviews-crosscheck-2026.md',
   'ontology/steam/steam-steamlense-release-reviews-crosscheck-2026.json',
   'site/steam-steamlense-release-reviews-crosscheck.mjs',
   'tests/steam-steamlense-release-reviews-crosscheck.test.mjs'])assert(task.evidence.includes(path),path);
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((sum,t)=>sum+(t.percent??t.progress),0)/293));
});
