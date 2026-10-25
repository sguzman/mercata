import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateContentIDRoute,classifyClaimConsequence} from '../site/content-id-appeal-audit.mjs';
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
