import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditDemoFestivalFrames as audit} from '../site/steam-demo-festival-coverage.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-nextfest-demo-coverage-and-survey-selection-2026.json');
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const f={total2025Games:21222,taggedDemoGames:4663,festivalParticipantMinimum:3501,surveyResponses:182,surveyMedianWishlists:806,participantMedianFollowers:11};
test('Current demo-tag ratio remains descriptive and not original demo launch prevalence',()=>{
 const a=audit(f);
 assert.equal(a.current_demo_tag_share_of_2025_releases,4663/21222);
 assert.equal(a.games_with_demo_on_original_release_share,null);
 assert.equal(a.originally_paid_release_frame_verified,false);
 assert.equal(a.festival_incremental_paid_order_rate,null);
});
test('Self-selected wishlists and full-entry followers are incompatible measures',()=>{
 const a=audit(f);
 assert.equal(a.wishlist_survey_median,806);assert.equal(a.participant_follower_median,11);
 assert.equal(a.two_medians_in_same_units,false);
 assert.equal(a.quantified_survey_selection_bias,null);assert.equal(a.actual_survey_response_rate,null);
 assert(a.survey_responses_over_participant_minimum_ceiling<0.0521);
 assert.equal(a.after_labor_profit,null);
});
test('Invalid denominators and negative or fractional events fail',()=>{
 assert.throws(()=>audit({...f,total2025Games:0}),/Denominators/);
 assert.throws(()=>audit({...f,taggedDemoGames:22000}),/cannot exceed/);
 assert.throws(()=>audit({...f,surveyResponses:4000}),/exceed participants/);
 assert.throws(()=>audit({...f,surveyMedianWishlists:-1}),/nonnegative/);
 assert.throws(()=>audit({...f,participantMedianFollowers:0.5}),/safe integer/);
});
test('Eleven bounded claims, four grounded sources and original 293 research tasks',()=>{
 const src=new Set(d.evidence.map(x=>x.id)),cl=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,4);assert.equal(study.claim_ids.length,11);
 for(const id of study.source_ids)assert(src.has(id),id);
 for(const id of study.claim_ids){assert(cl.has(id),id);assert(cl.get(id).source_ids.every(s=>src.has(s)),id);}
 assert(Object.values(study.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
