import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditReputationPortability} from '../site/reputation-portability.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Reputation and portability audit retains source-backed uncertainty',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/reputation-portability.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditReputationPortability(study,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('A transfer claim or invented review metric is rejected',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/reputation-portability.json'),load('specimens/youtube.json')]);
 const copy=structuredClone(study);copy.surfaces.find(x=>x.id==='subscribers').transfer_scope='conditional_content_export';
 copy.surfaces[0].verified_buyer_score=5;
 copy.surfaces[0].source_ids=['not-registered'];
 const result=auditReputationPortability(copy,new Set(dossier.evidence.map(x=>x.id)));
 assert(!result.valid);
 assert(result.errors.includes('false transfer equivalence'));
 assert(result.errors.includes('invented impact/score'));
 assert(result.errors.includes('missing official source'));
});
