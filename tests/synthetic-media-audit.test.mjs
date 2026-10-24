import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyAIDisclosureExample,auditSyntheticMediaStudy} from '../site/synthetic-media-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official AI-use source and authenticity, copyright and privacy gates remain distinct',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/synthetic-media-rights-policy.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditSyntheticMediaStudy(study,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(study.policy_axes.length,4);
});
test('Realistic alteration and AI music illustrations require labels, not automatic demonetization',()=>{
 for(const flags of [
 {ai_used:true,meaningful_realistic_alteration:true,ai_music_main_focus:false,minor_or_non_realistic_only:false},
 {ai_used:true,meaningful_realistic_alteration:false,ai_music_main_focus:true,minor_or_non_realistic_only:false}
 ]){
  const x=classifyAIDisclosureExample(flags);
  assert.equal(x.disclosure,'disclosure_required_under_examples');
  assert.equal(x.monetization_allowed,null);assert.equal(x.copyright_ownership,null);
 }
});
test('Nonrealistic AI assistance alone does not establish violation or copyright title',()=>{
 const x=classifyAIDisclosureExample({ai_used:true,meaningful_realistic_alteration:false,ai_music_main_focus:false,minor_or_non_realistic_only:true});
 assert.equal(x.disclosure,'not_required_under_examples');assert.equal(x.copyright_ownership,null);
});
test('Mutually inconsistent or unknown case information cannot produce a deterministic compliance answer',()=>{
 assert.equal(classifyAIDisclosureExample({ai_used:true,meaningful_realistic_alteration:true,ai_music_main_focus:false,minor_or_non_realistic_only:true}).status,'insufficient_case_information');
 assert.equal(classifyAIDisclosureExample({ai_used:false,meaningful_realistic_alteration:true,ai_music_main_focus:false,minor_or_non_realistic_only:false}).status,'insufficient_case_information');
 assert.equal(classifyAIDisclosureExample({ai_used:true}).status,'insufficient_case_information');
});
