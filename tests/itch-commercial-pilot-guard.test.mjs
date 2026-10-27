import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateItchPilotGate} from '../site/itch-commercial-pilot-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const checks={rightsVerified:true,qaPassed:true,sellerPaymentEligible:true,taxProfileReviewed:true,dataPermissionVerified:true,securityReviewed:true,accurateListingVerified:true};
const caps={externalCashUsd:10,creatorMinutes:180,calendarDays:30,minPageViewEvents:100,minRetainedOrderEvents:2};
const actual={externalCashUsd:2,creatorMinutes:90,elapsedDays:4,eligiblePageViewEvents:15,paidOrders:1,refundedOrders:0};
test('Unapproved work is blocked and has no authorized cash or commercial time',()=>{
 const a=evaluateItchPilotGate({});
 assert.equal(a.canExecute,false);assert.equal(a.maxUnapprovedExternalCashUsd,0);assert.equal(a.maxUnapprovedCommercialMinutes,0);
 assert.equal(a.successClaimPermitted,false);
});
test('Approved synthetic caps stop overspends, invalid refunds and legal blockers',()=>{
 assert.equal(evaluateItchPilotGate({ownerApproval:true,caps,actual,checks:{...checks,rightsVerified:false}}).decision,'blocked_incomplete');
 assert.equal(evaluateItchPilotGate({ownerApproval:true,caps,actual:{...actual,externalCashUsd:11},checks}).decision,'stop');
 assert.equal(evaluateItchPilotGate({ownerApproval:true,caps,actual:{...actual,creatorMinutes:181},checks}).decision,'stop');
 assert.equal(evaluateItchPilotGate({ownerApproval:true,caps,actual:{...actual,refundedOrders:2},checks}).decision,'stop');
});
test('Experimental threshold counts are never proof of profit, paid buyers or causality',()=>{
 const good=evaluateItchPilotGate({ownerApproval:true,caps,actual:{...actual,eligiblePageViewEvents:200,paidOrders:5},checks});
 assert.equal(good.decision,'thresholds_met_not_profit_verified');
 assert.equal(good.successClaimPermitted,false);
 assert.equal(good.causalLiftVerified,false);
 assert.equal(good.observedMarketIncome,null);
 const partial=evaluateItchPilotGate({ownerApproval:true,caps,actual,checks});
 assert.equal(partial.decision,'continue_within_capped_scope');
 assert.equal(partial.evidenceThresholdMet,false);
});
test('Source-gated policy may close risk documentation but not assert owner-approved experiment',()=>{
 const policy=read('ontology/itch-io/zero-spend-pilot-stop-gates-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));assert(policy.source_ids.every(x=>sources.has(x)));
 assert.equal(policy.observed.owner_approved_execution,false);
 assert.equal(policy.evidence_thresholds.owner_approved_budget_usd,null);
 const r=p.detail_tasks.find(t=>t.id==='itch-io/risk/set-downside-limits');
 const g=p.detail_tasks.find(t=>t.id==='itch-io/strategy/set-stop-conditions');
 assert.equal(r.percent,100);assert.equal(r.status,'complete');
 assert(g.percent<100);assert.equal(g.status,'in_progress');
 for(const t of [r,g])for(const f of ['ontology/itch-io/zero-spend-pilot-stop-gates-2026.json','ontology/itch-io/zero-spend-pilot-stop-gates-2026.md','site/itch-commercial-pilot-guard.mjs','tests/itch-commercial-pilot-guard.test.mjs'])assert(t.evidence.includes(f));
});
