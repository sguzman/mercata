import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {compareCreatorFormatAttemptCosts,auditFormatAttemptProtocol} from '../site/format-attempt-costs.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
const stageKeys=['research_ideation','writing_storyboarding','filming_capture','art_animation','audio_music_clearance','editing_accessibility','thumbnail_metadata','distribution_promotion','community_moderation','business_admin_revision'];
const stages=h=>Object.fromEntries(stageKeys.map((k,i)=>[k,i===0?h:0]));
const attempt=(id,status,cash,gear,work)=>({attempt_id:id,disposition:status,finalized_on:'2026-09-20',new_cash_paid_cents:cash,owned_gear_allocation_cents:gear,personal_creator_hours_by_stage:stages(work)});
const example=()=>({country:'US',currency:'USD',topic_scope:'synthetic_matched_education_example',creator_experience_band:'test_only',
 period_start:'2026-09-01',period_end:'2026-09-30',all_attempts_accounted:true,owner_permission_or_synthetic:true,
 groups:[{format:'animated_video',attempts:[attempt('a1','published',500,100,2),attempt('a2','abandoned',300,50,3)]},
 {format:'horizontal_video',attempts:[attempt('b1','published',200,40,1),attempt('b2','published',300,40,1)]}]});
test('Abandoned attempts remain in cost and hours per published video denominators',()=>{
 const r=compareCreatorFormatAttemptCosts(example());
 assert.equal(r.groups[0].attempts,2);assert.equal(r.groups[0].published,1);assert.equal(r.groups[0].abandoned,1);
 assert.equal(r.groups[0].new_cash_per_published_output_cents,800);
 assert.equal(r.groups[0].total_gear_inclusive_cost_per_published_cents,950);
 assert.equal(r.groups[0].personal_hours_per_published_output,5);
 assert.equal(r.groups[1].new_cash_per_published_output_cents,250);
 assert.equal(r.market_median_cost,null);assert.equal(r.causal_format_effect,null);
});
test('Zero published outputs are undefined cost per completion, not zero or infinity',()=>{
 const a=example();a.groups[0].attempts.forEach(x=>x.disposition='abandoned');
 const r=compareCreatorFormatAttemptCosts(a);assert.equal(r.groups[0].new_cash_per_published_output_cents,null);
 assert.equal(r.groups[0].personal_hours_per_published_output,null);
});
test('Reject omitted creator work stages, missing abandoned attempts and invalid consent',()=>{
 const a=example();delete a.groups[0].attempts[0].personal_creator_hours_by_stage.art_animation;assert.throws(()=>compareCreatorFormatAttemptCosts(a),/stage/);
 const b=example();b.all_attempts_accounted=false;assert.throws(()=>compareCreatorFormatAttemptCosts(b),/Complete/);
 const c=example();c.groups[0].attempts[0].attempt_id='b2';assert.throws(()=>compareCreatorFormatAttemptCosts(c),/duplicated/);
 const d=example();d.groups[0].attempts[0].finalized_on='2026-10-01';assert.throws(()=>compareCreatorFormatAttemptCosts(d),/outside/);
});
test('Public research record has no actual matched cost data',async()=>{
 const [data,spec]=await Promise.all([load('ontology/youtube/video-production-cost-register.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditFormatAttemptProtocol(data,new Set(spec.evidence.map(e=>e.id))),{valid:true,errors:[]});
});
