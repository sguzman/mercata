import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamFirstReleaseConflict as audit} from '../site/steam-firstrelease-conflict-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-first-release-source-conflict-and-concurrent-approval-gates-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture={feePaidOn:'2026-11-01',comingSoonPublicOn:'2026-11-15',storeReviewSubmittedOn:'2026-11-12',storeReviewApprovedOn:'2026-11-14',buildReviewSubmittedOn:'2026-11-19',buildReviewApprovedOn:'2026-11-27'};
test('Conflicting 21/30 day public policy produces two conditional first-release dates',()=>{
 const result=audit(fixture);
 assert.equal(result.fee_wait_source_conflict,true);
 assert.equal(result.earliest_across_public_texts,'2026-11-29');
 assert.equal(result.latest_across_public_texts,'2026-12-01');
 assert.equal(result.earliest_candidates_by_public_texts.length,2);
 assert.equal(result.guaranteed_release_date,null);assert.equal(result.actual_partner_release_gate,null);
 assert.equal(result.real_paid_game_orders,null);assert.equal(result.developer_after_cost_profit,null);
});
test('A late Coming Soon page can dominate both fee wait statements',()=>{
 const r=audit({...fixture,comingSoonPublicOn:'2026-12-10'});
 assert.equal(r.earliest_across_public_texts,'2026-12-24');
 assert.equal(r.latest_across_public_texts,'2026-12-24');
 assert.equal(r.guaranteed_release_date,null);
});
test('Review and publication events must be structurally coherent',()=>{
 assert.throws(()=>audit({...fixture,storeReviewSubmittedOn:'2026-11-20'}),/Store review/);
 assert.throws(()=>audit({...fixture,storeReviewApprovedOn:'2026-11-10'}),/Approval before/);
 assert.throws(()=>audit({...fixture,comingSoonPublicOn:'2026-11-10'}),/Coming Soon/);
 assert.throws(()=>audit({...fixture,feePaidOn:'2026-11-31'}),/Invalid/);
 assert.throws(()=>audit({...fixture,bankAndTaxVerified:'yes'}),/boolean/);
});
test('Self-attested partner prerequisites do not imply authorization or sales',()=>{
 const r=audit({...fixture,bankAndTaxVerified:true,releasePermissionsGranted:true});
 assert.equal(r.account_prerequisites_attested_for_fixture,true);
 assert.equal(r.guaranteed_release_date,null);assert.equal(r.verified_labor_hours,null);
 assert.equal(study.first_release.universal_signatory_minimum_age_verified,false);
 assert.equal(study.primary_conflict.private_partner_rule_verified,false);
 assert(Object.values(study.unknown).every(v=>v===null));
});
test('Claims and independent public source states preserve the fixed Steam task inventory',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,6);assert.equal(study.claim_ids.length,12);
 for(const id of study.source_ids)assert(src.has(id),id);
 for(const id of study.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(s=>src.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((s,x)=>s+x,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/access/model-first-release-setup-workload').evidence.includes('ontology/steam/steam-first-release-source-conflict-and-concurrent-approval-gates-2026.json'));
});
