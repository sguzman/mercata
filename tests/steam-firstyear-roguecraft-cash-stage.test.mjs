import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamFirstYearSelfReport as audit} from '../site/steam-firstyear-selfreport-stage-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-roguecraft-firstyear-refund-net-stage-and-review-observation-2026.json'),d=read('specimens/steam.json');
const p=read('plans/steam.json'),q=read('queues/steam.json');
const caseFixture=()=>({fixture_id:'fixture-game',release_date:'2025-07-22',post_date:'2026-07-28',
 reported_units:1674,reported_refunds:220,gross_usd_cents:1499200,author_net_usd_cents:1188800,
 reported_players:1578,prelaunch_wishlists:1166,later_wishlists:4105,demo_players:900});
test('The public source is one formerly registered author case, plus official product identity',()=>{
 assert.equal(study.game.appid,3470340);
 assert.equal(study.disclosure.published_at,'2026-07-28');
 assert.equal(study.game.store_release_date,'2025-07-22');
 assert.equal(study.original_author_post_is_previously_cited_same_case,true);
 assert.equal(study.source_ids.length,2);
});
test('The reported 13.1 percent refund label is compatible with 220 over 1674, not matched-ledger proof',()=>{
 const x=audit(caseFixture());
 assert.equal(x.calendar_days_between_release_and_post,371);
 assert.equal(x.illustrative_period_refunds_over_reported_units,220/1674);
 assert(Math.abs(100*x.illustrative_period_refunds_over_reported_units-13.1)<0.1);
 assert.equal(x.illustrative_units_less_refunds_if_matched,1454);
 assert.equal(x.matched_original_purchase_cohort_refund_fraction,null);
 assert.equal(x.observed_net_retained_units_verified,null);
});
test('Gross less net is an unallocated reported stage difference, not bank receipts',()=>{
 const x=audit(caseFixture());
 assert.equal(x.gross_minus_author_net_usd_cents,310400);
 assert.equal(x.deducted_components_reconciled,false);
 assert.equal(x.platform_fee_included_in_author_net,null);
 assert.equal(x.publisher_remittance_verified,null);
 assert.equal(x.developer_profit_after_labor,null);
 assert.equal(x.actual_steam_financial_data_accessed,false);
});
test('Players, wishlists and demo participation cannot be converted to sales',()=>{
 const x=audit(caseFixture());
 assert.equal(x.reported_player_events,1578);
 assert.equal(x.player_events_are_paid_customers,false);
 assert.equal(x.launch_wishlist_stock,1166);
 assert.equal(x.later_outstanding_wishlist_stock,4105);
 assert.equal(x.reported_demo_players,900);
 assert.equal(x.matched_demo_or_wishlist_paid_conversion,null);
});
test('A different period refund count may exceed new purchases without implying impossible fraud',()=>{
 const f=caseFixture();f.reported_units=3;f.reported_refunds=4;
 const x=audit(f);
 assert.equal(x.illustrative_period_refunds_over_reported_units,4/3);
 assert.equal(x.illustrative_units_less_refunds_if_matched,null);
 assert.equal(x.matched_original_purchase_cohort_refund_fraction,null);
});
test('Explicit fictional scope rejects private or game-level account input and malformed dates',()=>{
 for(const change of [{appid:3470340},{partner_account:'secret'},{fixture_id:'real-game'},
  {reported_units:-1},{gross_usd_cents:1.5},{release_date:'2025-02-30'},
  {post_date:'2025-07-21'},{developer_steamid:'private'}])
  assert.throws(()=>audit({...caseFixture(),...change}),/Bounded fictional/);
});
test('New claims are linked to public sources with no verified population income',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids)assert(claims.has(id)&&claims.get(id).source_ids.every(s=>sources.has(s)),id);
 assert(Object.values(study.unknown).every(x=>x===null));
 assert.equal(study.disclosure.authorized_financial_export_provided,false);
 assert.equal(study.arithmetic.net_reported_is_publisher_bank_receipts,false);
});
test('Existing 293 tasks only and progress ledger remains consistent after case extension',()=>{
 const tasks=[...p.detail_tasks,...q.queues.flatMap(x=>x.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(t=>t.id)).size,293);
 for(const id of ["steam/income/study-refund-adjusted-sold-units","steam/income/analyze-first-game-versus-established-earnings","steam/income/estimate-median-developer-proceeds","income/profit"]){
  const t=tasks.find(t=>t.id===id);
  assert(t.evidence.includes('ontology/steam/steam-roguecraft-firstyear-refund-net-stage-and-review-observation-2026.md'));
  assert(t.evidence.includes('ontology/steam/steam-roguecraft-firstyear-refund-net-stage-and-review-observation-2026.json'));
 }
 const exact=tasks.reduce((s,t)=>s+(t.percent??t.progress),0)/293;
 assert.equal(p.progress_percent,Math.round(exact));
});
