import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditRecommendationEvidence} from '../site/recommendation-evidence-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official recommendation surfaces have citations, no synthetic ranks or earnings',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/recommendation-surface-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditRecommendationEvidence(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Fabricated coefficients and first-year reach violate the research boundary',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/recommendation-surface-evidence.json'),load('specimens/youtube.json')]);
 data.surfaces[0].ranking_weight=0.8;
 data.unmeasured.first_year_new_channel_reach=80;
 const errors=auditRecommendationEvidence(data,new Set(dossier.evidence.map(x=>x.id))).errors;
 assert(errors.includes('invented effect'));assert(errors.includes('invented ranking weights'));
});
