import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditAudiencePopulation,comparePopulationEvidence} from '../site/audience-population-audit.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Survey and ad reach crosswalk preserves source provenance and distinct denominators',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditAudiencePopulation(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert(Object.values(data.unmeasured).every(x=>x===null));
});
test('Never subtract daily, monthly and ad metrics as if they were one population',async()=>{
 const data=await load('ontology/youtube/audience-population-crosswalk.json');
 for(const [i,j] of [[0,1],[0,2],[2,4],[4,5],[2,3]]){
  const r=comparePopulationEvidence(data.observations[i],data.observations[j]);
  assert.equal(r.status,'incomparable');assert.equal(r.difference,null);
 }
});
test('A mismatched unit or falsely counted global population cannot pass',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 data.observations[0].equivalent_to_global_mau=true;data.unmeasured.global_unique_dau=1;
 const x=auditAudiencePopulation(data,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(x.valid,false);assert(x.errors.includes('false global MAU'));assert(x.errors.includes('invented platform population'));
});
