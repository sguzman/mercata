import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compareSteamContentRestrictionLists as compare,auditSyntheticSteamContentReviewGate as audit} from '../site/steam-content-eligibility-crosswalk.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-content-eligibility-page-drift-and-ai-disclosure-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Public Steam Direct page lacks the extra onboarding processor/network rule on the recorded review date',()=>{
 const r=compare({landing:x.restriction_keys.steamdirect_landing,onboarding:x.restriction_keys.steamworks_onboarding});
 assert.equal(r.landing_rule_count,14);assert.equal(r.onboarding_rule_count,15);
 assert.deepEqual(r.additional_onboarding_rule_keys,['payment_network_provider_standards']);
 assert.deepEqual(r.landing_only_rule_keys,[]);
 assert.equal(r.effective_policy_change_date,null);assert.equal(r.contractual_precedence,null);
});
test('A completed content survey does not override unsupported advertising-based business model',()=>{
 const r=audit(x.synthetic_cases[1]);
 assert(r.documented_blockers.includes('advertising_business_model'));
 assert.equal(r.approved_for_steam,null);
});
test('Live AI additional guardrails and possible processor restrictions do not establish actual approval or sales',()=>{
 const a=audit(x.synthetic_cases[2]);assert(a.documented_blockers.includes('live_ai_guardrails_not_documented'));
 const b=audit(x.synthetic_cases[3]);assert.equal(b.potential_payment_network_review,true);
 assert.equal(b.no_documented_blockers,true);assert.equal(b.approved_for_steam,null);
 const c=audit({...x.synthetic_cases[0],live_ai:true,live_ai_guardrails_documented:true,live_ai_adult_only_sexual_content:true});
 assert(c.documented_blockers.includes('live_generated_adult_only_sexual_content'));
});
test('Reject sensitive-looking fields, impossible fixtures and duplicate guide keys',()=>{
 assert.throws(()=>audit({...x.synthetic_cases[0],publisher_id:'real-id'}),/synthetic/);
 assert.throws(()=>audit({...x.synthetic_cases[0],payment_network_concern:'approved'}),/explicit/);
 assert.throws(()=>audit({...x.synthetic_cases[0],live_ai_guardrails_documented:true}),/require live AI/);
 const a=x.restriction_keys.steamdirect_landing;
 assert.throws(()=>compare({landing:[...a,a[0]],onboarding:x.restriction_keys.steamworks_onboarding}),/Unique/);
});
test('Public sources and new claims join to original Steam 293 tasks',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,5);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const c of x.claim_ids)assert(claims.has(c)&&claims.get(c).source_ids.every(s=>sources.has(s)),c);
 assert(Object.values(x.unknown).every(v=>v===null));
 const vals=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(vals.length,293);assert.equal(p.progress_percent,Math.round(vals.reduce((s,v)=>s+v,0)/293));
});
