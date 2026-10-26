import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateContentIDRoute,classifyClaimConsequence,auditCopyrightStrikeAccumulation} from '../site/content-id-appeal-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Appeal, dispute and scheduled removal have separate documented response windows',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/content-id-appeal-routes-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(m.stages.map(s=>s.id),['initial_dispute','appeal_reinstated_claim','escalate_block_to_appeal','scheduled_removal_after_appeal']);
 assert.deepEqual(m.stages.slice(0,3).map(x=>x.claimant_response_days),[30,7,7]);
 assert.equal(m.stages[3].creator_cancel_appeal_window_days,7);
 assert(Object.values(m.unmeasured).every(v=>v===null));
});
test('Escalating to appeal is restricted to eligible blocks, not monetize/track claims',async()=>{
 const m=await load('ontology/youtube/content-id-appeal-routes-2026.json');
 assert.equal(evaluateContentIDRoute(m,{route:'escalate_block_to_appeal',claim_policy:'block',appeal_eligible:true}).valid,true);
 assert.equal(evaluateContentIDRoute(m,{route:'escalate_block_to_appeal',claim_policy:'monetize',appeal_eligible:true}).valid,false);
 assert.equal(evaluateContentIDRoute(m,{route:'escalate_block_to_appeal',claim_policy:'block'}).valid,false);
 assert.equal(evaluateContentIDRoute(m,{route:'appeal_reinstated_claim',claim_policy:'track'}).valid,false);
 const x=evaluateContentIDRoute(m,{route:'appeal_reinstated_claim',claim_policy:'track',prior_reinstatement:true});
 assert.equal(x.valid,true);assert.equal(x.response_days,7);assert.equal(x.creator_bank_received,null);
});
test('Ordinary claim does not automatically imply strike, damages, or income',async()=>{
 const m=await load('ontology/youtube/content-id-appeal-routes-2026.json');
 assert.equal(classifyClaimConsequence(m,'content_id_claim').is_copyright_strike,false);
 assert.equal(classifyClaimConsequence(m,'reinstated_claim').can_cause_strike,false);
 assert.equal(classifyClaimConsequence(m,'valid_copyright_removal_request').can_cause_strike,true);
 assert.equal(classifyClaimConsequence(m,'valid_copyright_removal_request').observed_creator_cash,null);
 assert.equal(evaluateContentIDRoute(m,{route:'initial_dispute',claim_policy:'monetize'}).estimated_creator_earnings,null);
});
test('Website shows appeals and held revenue boundaries',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderContentIDAppealRoutes'));
 assert(a.includes('content-id-appeal-routes-2026.json'));
 assert(a.includes('not creator payout or automatic copyright strikes'));
});

test('Actual copyright strikes accumulate differently from Content ID matches',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/content-id-appeal-routes-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id)),p=m.copyright_strike_accumulation;
 assert.deepEqual(auditCopyrightStrikeAccumulation(m,ids),{valid:true,errors:[]});
 assert.equal(p.source_id,'music-copyright-strikes');
 assert.deepEqual(p.strikes.map(x=>x.active_strikes),[1,2,3]);
 assert.deepEqual(p.strikes.map(x=>x.expiry_after_days_if_condition_met),[90,90,null]);
 assert.equal(p.termination_threshold_active_strikes,3);
 assert.equal(p.strike_expiry_requires_copyright_school,true);
 assert.equal(p.scheduled_removal_days_to_avoid_strike,7);
 assert.equal(p.ordinary_video_deletion_removes_strike,false);
 assert.equal(p.content_id_claim_typically_is_copyright_strike,false);
 assert.equal(p.counter_notification_success_rate,null);
 assert.equal(p.creator_lost_revenue_distribution,null);
});
test('Strike audit rejects automatic claim-to-strike promotion and imaginary legal outcome rates',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/content-id-appeal-routes-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.copyright_strike_accumulation.content_id_claim_typically_is_copyright_strike=true;
 assert(auditCopyrightStrikeAccumulation(a,ids).errors.includes('copyright procedural boundaries invalid'));
 const b=structuredClone(m);b.copyright_strike_accumulation.strikes[2].termination_status='automatic_termination';
 assert(auditCopyrightStrikeAccumulation(b,ids).errors.includes('copyright strike consequences distorted'));
 const c=structuredClone(m);c.copyright_strike_accumulation.probability_three_strikes=.05;
 assert(auditCopyrightStrikeAccumulation(c,ids).errors.includes('invented copyright economic or legal outcome'));
});
