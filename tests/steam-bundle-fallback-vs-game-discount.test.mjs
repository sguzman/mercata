import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calendarDiscountEligibility as basic} from '../site/steam-sale-date-eligibility.mjs';
import {auditSyntheticSteamDiscountSequence as sequence} from '../site/steam-discount-sequence-cooldown.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/steam-lostinart-bundle-fallback-vs-game-discount-2026.json');
test('June 1 release clears only the release clock by July 1, not partner eligibility',()=>{
 const m=x.model_check,d=x.dated_observations;
 assert.equal(d.release_date,'2026-06-01');
 assert.equal(d.days_since_release_at_intended_start,30);
 assert.equal((Date.parse(d.publisher_intended_start+'T00:00:00Z')-Date.parse(d.release_date+'T00:00:00Z'))/86400000,30);
 assert.equal((Date.parse(d.publisher_block_report_date+'T00:00:00Z')-Date.parse(d.release_date+'T00:00:00Z'))/86400000,31);
 const result=basic({releaseDate:m.sample_release_date,saleStart:m.sample_sale_start,saleEnd:m.sample_sale_end});
 assert.equal(result.release_cooldown_ends,m.first_calendar_eligible_date);
 assert.equal(result.eligible_from_sale_start,true);
 assert.equal(result.actual_partner_discount_permission_verified,false);
});
test('Incomplete prior history remains unresolved even after release calendar cooldown',()=>{
 const r=sequence({fixture_id:'fixture-lostinart-calendar-only',
  first_paid_release_date:'2026-06-01',discount_kind:'official_seasonal',
  discount_start:'2026-07-01',discount_end:'2026-07-09',
  official_seasonal_event_verified:true,
  discount_percent:50,relevant_discount_history_complete:false});
 assert.equal(r.conditional_calendar_rules_pass,null);
 assert.equal(r.calendar_status,'unresolved_prior_discount_history');
 assert.equal(r.actual_partner_eligibility_verified,false);
 assert.equal(x.model_check.technical_issue_cause_identified,false);
});
test('Publisher-reported game discount problem cannot be resolved by treating bundle rate as package price',()=>{
 const d=x.dated_observations,p=x.policy;
 assert.equal(d.base_game_discount_started_by_block_report,false);
 assert.equal(d.increase_bundle_discount_percent_reported,50);
 assert.equal(d.bundle_discount_vs_game_package_discount_identical,false);
 assert.equal(p.bundle_percentage_is_not_direct_package_reduction,true);
 assert.equal(p.bundle_discount_sends_wishlist_notification,false);
 assert.equal(p.bundle_sales_may_allocate_package_units_to_included_games,true);
 assert.equal(x.unknown.triggered_wishlist_alert_recipients,null);
 assert.equal(x.unknown.incremental_base_game_paid_orders_from_bundle,null);
});
test('Unknown incident cause, verified purchases and profit are never manufactured',()=>{
 assert(Object.values(x.unknown).every(v=>v===null));
 assert.equal(x.publication.individual_article_permanent_link_located,false);
 assert.equal(x.publication.private_store_or_steamworks_access,false);
});
test('No new task scope or unregistered source and claim IDs',()=>{
 const d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,6);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const c of x.claim_ids){assert(claims.has(c),c);assert(claims.get(c).source_ids.every(s=>sources.has(s)),c);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
