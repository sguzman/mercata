import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamIndieXpSelection as audit} from '../site/steamindiexp-selection-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const record=read('ontology/steam/steamindiexp-october-2026-cohort-selection.json'),d=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
const snapshot=()=>({frame:{
 reported_recent_indie_games:record.frame.reported_recent_indie_games,
 major_publishers_explicitly_excluded:record.frame.major_publishers_explicitly_excluded,
 recent_window_calendar_days:record.frame.recent_window_calendar_days,
 original_paid_release_frame_complete:false,early_access_initial_paid_release_reconciled:false},
 review_milestone:{
 minimum_lifetime_reviews:100,minimum_release_age_days:21,maximum_release_age_days:120,
 reported_theme_coded_hits:311,sampled_nonhits:881,sampled_nonhit_expansion_approx:5,
 mature_21_120_population_count:null,actual_paid_game_sales:null,calculated_full_indie_hit_fraction:null},
 ai_disclosure_sample:{
 sampled_games:220,reported_disclosure_games:104,source_rounded_share_percent:47,
 approximate_uncertainty_percentage_points:7,disclosure_self_reported:true,
 independently_verified_ai_use_fraction:null},
 next_fest_roster:{
 source_count_october_slopdodge:7236,source_count_october_steamdb:7164,
 same_inclusion_rules_verified:false,actual_demo_player_total:null}});
test('Review hit sample never yields a total Indie or paid-release success rate',()=>{
 const r=audit(snapshot());
 assert.equal(r.recent_indie_tagged_game_count,5483);
 assert.equal(r.sampled_theme_games,1192);
 assert.equal(r.selected_hits_in_theme_sample,311);
 assert.equal(r.entire_indie_frame_hit_rate,null);
 assert.equal(r.full_paid_release_hit_rate,null);
 assert.equal(r.actual_indie_or_publisher_income,null);
});
test('AI disclosure is a 104/220 self-report sample, not actual AI use',()=>{
 const r=audit(snapshot());
 assert.equal(r.observed_ai_disclosure_fraction_in_random_sample,104/220);
 assert.equal(r.source_ai_disclosure_uncertainty_approx_pp,7);
 assert.throws(()=>audit({...snapshot(),ai_disclosure_sample:{
  ...snapshot().ai_disclosure_sample,reported_disclosure_games:221}}),/Inconsistent/);
 assert.throws(()=>audit({...snapshot(),ai_disclosure_sample:{
  ...snapshot().ai_disclosure_sample,independently_verified_ai_use_fraction:104/220}}),/No original/);
});
test('Unmatched festival rosters are not sales and must not be equated',()=>{
 const r=audit(snapshot());assert.equal(r.cross_provider_festival_roster_difference,72);
 assert.equal(r.full_october_demo_player_count,null);
 assert.throws(()=>audit({...snapshot(),next_fest_roster:{
  ...snapshot().next_fest_roster,same_inclusion_rules_verified:true}}),/No original/);
});
test('Wrong cohort ages, invalid counts, fabricated permission and private fields fail',()=>{
 const s=snapshot();
 assert.throws(()=>audit({...s,frame:{...s.frame,recent_window_calendar_days:20}}),/Inconsistent/);
 assert.throws(()=>audit({...s,review_milestone:{...s.review_milestone,reported_theme_coded_hits:6000}}),/Inconsistent/);
 assert.throws(()=>audit({...s,frame:{...s.frame,original_paid_release_frame_complete:true}}),/No original/);
 assert.throws(()=>audit({...s,hidden_account_id:'secret'}),/unpermitted/);
 assert.throws(()=>audit({...s,ai_disclosure_sample:{...s.ai_disclosure_sample,source_rounded_share_percent:90}}),/conflicts/);
});
test('Public source, bounded claims, and original 293-task inventory remain intact',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(record.source_ids.length,1);assert.equal(record.claim_ids.length,7);
 for(const id of record.source_ids)assert(sources.has(id),id);
 for(const id of record.claim_ids){assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
