import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {publicFirstReleaseFloor} from '../site/steam-release-floor.mjs';
import {auditSyntheticSteamFirstReleaseConflict} from '../site/steam-firstrelease-conflict-guards.mjs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=j('ontology/steam/current-first-release-wait-recheck-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json'),entry=j('ontology/steam/entry-review-and-reporting-2026.json');
test('October 28 30-day source snapshot and concurrent 14-day Coming Soon are historical, not current universal terms',()=>{
 const f=publicFirstReleaseFloor({feePaidOn:'2026-10-01',comingSoonPublicOn:'2026-10-01',storeReviewApprovedOn:'2026-10-15',buildReviewApprovedOn:'2026-10-20'});
 assert.equal(f.fee_floor,'2026-10-31');assert.equal(f.coming_soon_floor,'2026-10-15');assert.equal(f.earliest_candidate_calendar_date,'2026-10-31');
 assert.equal(f.guaranteed_release_date,null);
 assert.equal(f.historical_snapshot_only,true);
 assert.equal(f.current_public_wait_rule_conflicted_as_of,'2026-10-29');
});
test('Late reviews and late public store pages extend earliest hypothetical candidate',()=>{
 const f=publicFirstReleaseFloor({feePaidOn:'2026-10-01',comingSoonPublicOn:'2026-11-02',storeReviewApprovedOn:'2026-11-05',buildReviewApprovedOn:'2026-11-12'});
 assert.equal(f.earliest_candidate_calendar_date,'2026-11-16');
 assert.throws(()=>publicFirstReleaseFloor({feePaidOn:'2026-02-30',comingSoonPublicOn:'2026-10-01',storeReviewApprovedOn:'2026-10-01',buildReviewApprovedOn:'2026-10-01'}));
});
test('October 28 same-text snapshot must not erase the October 29 official 21-versus-30-day conflict',()=>{
 assert.equal(r.source_read.earlier_observed_onboarding_english_wait_days,21);
 assert.equal(r.source_read.official_steam_direct_wait_days,30);
 assert.equal(r.source_read.official_onboarding_english_wait_days,30);
 assert.equal(r.source_read.operative_partner_account_tested,false);
 assert.equal(entry.documented.waiting_period_minimum_days_conflict.resolved_operational_rule,null);
 assert.equal(entry.documented.waiting_period_current_public_recheck_days,30);
 assert.equal(entry.documented.waiting_period_recheck_date,'2026-10-28');
 const now=j('ontology/steam/steam-first-release-source-conflict-and-concurrent-approval-gates-2026.json');
 assert.equal(now.primary_conflict.same_observation_date,'2026-10-29');
 assert.equal(now.primary_conflict.english_onboarding_wait_days,21);
 assert.equal(now.primary_conflict.steam_direct_landing_wait_days,30);
 assert.equal(now.primary_conflict.private_partner_rule_verified,false);
 const scenario=auditSyntheticSteamFirstReleaseConflict({
  feePaidOn:'2026-11-01',comingSoonPublicOn:'2026-11-15',
  storeReviewSubmittedOn:'2026-11-12',storeReviewApprovedOn:'2026-11-14',
  buildReviewSubmittedOn:'2026-11-19',buildReviewApprovedOn:'2026-11-27'
 });
 assert.notEqual(scenario.earliest_across_public_texts,scenario.latest_across_public_texts);
 assert.equal(scenario.actual_partner_release_gate,null);
});
test('Evidence and 293 task inventory remain verifiable',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,6);assert.equal(r.claim_ids.length,6);
 for(const id of r.source_ids)assert(sources.has(id),id);
 for(const id of r.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const ss=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(ss.length,293);assert.equal(p.progress_percent,Math.round(ss.reduce((s,x)=>s+x,0)/293));
});
