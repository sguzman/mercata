import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamFestSnapshotComparability as audit} from '../site/steam-fest-snapshot-comparability.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=read('ontology/steam/steam-october-2026-fest-coverage-and-ccu-snapshots.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture=()=>({early:{
 roster:s.snapshots.early.participant_roster_reported,
 rank_groups:s.snapshots.early.ranked_peak_ccu_segments.map(x=>({count:x.count,median_followers:x.median_followers_pre_fest})),
 rho_followers:s.snapshots.early.spearman_followers_pre_vs_peak_ccu,
 rho_adds:s.snapshots.early.spearman_follower_adds_absolute_vs_peak_ccu,
 rho_growth:s.snapshots.early.spearman_follower_growth_percent_vs_peak_ccu
},final:{
 roster:s.snapshots.final.tracker_demo_roster,
 demos_with_recorded_players:s.snapshots.final.demos_with_recorded_players,
 combined_peak_players:s.snapshots.final.combined_peak_concurrent_players_reported
},frame_match_verified:false});
test('Early peak-CCU rank groups leave 198 of the stated 7,240 games unassigned',()=>{
 const x=audit(fixture());
 assert.equal(x.early_roster_count,7240);
 assert.equal(x.early_rank_group_assigned,7042);
 assert.equal(x.early_rank_group_unclassified,198);
 assert.equal(x.source_rosters_directly_comparable,false);
});
test('Final hourly tracker has 768 without recorded concurrent players, not proven zero users',()=>{
 const x=audit(fixture());
 assert.equal(x.final_monitored_demo_roster,7310);
 assert.equal(x.final_demos_with_recorded_players,6542);
 assert.equal(x.final_no_recorded_player_demo_count,768);
 assert.equal(x.actual_zero_unique_demo_players,null);
 assert.equal(x.verified_newly_admitted_demos,null);
 assert.equal(x.nominal_roster_difference,70);
});
test('Follower signals are rank associations, not paid sales or ranking causality',()=>{
 const x=audit(fixture());
 assert.equal(x.early_spearman_pre_followers_to_peak_ccu,.55);
 assert.equal(x.early_spearman_absolute_adds_to_peak_ccu,.52);
 assert.equal(x.early_spearman_percent_growth_to_peak_ccu,-.13);
 assert.equal(x.final_combined_peak_concurrent_players,297906);
 assert.equal(x.real_demo_to_paid_sale_rate,null);
 assert.equal(x.causal_marketing_or_algorithm_effect,null);
});
test('Invalid source assumptions, sample totals, private identifiers and impossible associations fail',()=>{
 const baseline=fixture();
 assert.throws(()=>audit({...baseline,frame_match_verified:true}),/No aligned/);
 assert.throws(()=>audit({...baseline,early:{...baseline.early,rank_groups:baseline.early.rank_groups.map(x=>({...x,count:9999}))}}),/exceed/);
 assert.throws(()=>audit({...baseline,final:{...baseline.final,demos_with_recorded_players:8000}}),/Invalid/);
 assert.throws(()=>audit({...baseline,early:{...baseline.early,rho_growth:-1.1}}),/Invalid/);
 assert.throws(()=>audit({...baseline,api_token:'private'}),/Unexpected/);
 assert.throws(()=>audit({...baseline,final:{...baseline.final,checkout_id:'private'}}),/Malformed/);
});
test('Bounded primary source joins and original 293-task inventory remain intact',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(s.source_ids.length,2);assert.equal(s.claim_ids.length,7);
 for(const id of s.source_ids)assert(sources.has(id),id);
 for(const id of s.claim_ids){assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(x=>sources.has(x)),id);}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(s.unknown).every(x=>x===null));
});
