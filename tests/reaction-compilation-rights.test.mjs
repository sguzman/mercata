import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditReactionRights} from '../site/reaction-rights-audit.mjs';
const read=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Reaction and compilation policy matrix keeps copyright independent',async()=>{
 const [model,d]=await Promise.all([read('ontology/youtube/reaction-compilation-rights.json'),read('specimens/youtube.json')]);
 assert.deepEqual(auditReactionRights(model,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(model.published_example_cases.filter(x=>x.platform_reused_content_example.startsWith('permitted')).length,4);
 assert.equal(model.published_example_cases.filter(x=>x.platform_reused_content_example.startsWith('ineligible')).length,3);
});
test('Claims of automatic legal clearance and quantified profit are rejected',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/reaction-compilation-rights.json'),read('specimens/youtube.json')]);
 m.published_example_cases[0].copyright_clearance=true;
 m.economic_observability.net_cash_profit=500;
 m.historical_note.reused_content_policy_changed=true;
 const e=auditReactionRights(m,new Set(d.evidence.map(x=>x.id))).errors;
 assert(e.includes('false rights assurance'));assert(e.includes('invented economic observation'));assert(e.includes('false 2025 rule change'));
});

test('2026 Shorts reupload recommendation gate remains independent of YPP, copyright and paid outcomes',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/reaction-compilation-rights.json'),read('specimens/youtube.json')]);
 const u=m.shorts_recommendation_originality;
 assert.equal(m.axes.length,5);
 assert(d.evidence.some(x=>x.id===u.source_id));
 assert.equal(u.announced_at,'2026-10-01');
 assert.equal(u.blanket_no_clips_allowed,false);
 assert.equal(u.proof_of_YPP_approval,false);
 assert.equal(u.proof_of_copyright_fair_use,false);
 assert.equal(u.observed_loss_of_recommendation_impressions,null);
 assert.equal(u.measured_incremental_creator_income,null);
 assert.deepEqual(auditReactionRights(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 m.shorts_recommendation_originality.proof_of_YPP_approval=true;
 assert(auditReactionRights(m,new Set(d.evidence.map(x=>x.id))).errors.includes('false Short discovery or copyright entitlement'));
});
