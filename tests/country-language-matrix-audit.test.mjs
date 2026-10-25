import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditCountryLanguageMatrix} from '../site/country-language-matrix-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const paths=['ontology/youtube/country-language-matrix-2026.json','ontology/youtube/audience-population-crosswalk.json','ontology/youtube/country-ad-reach-comparisons.json','ontology/youtube/language-audience-api-crosswalk-2026.json','specimens/youtube.json'];
test('Seven sourced advertising markets cannot be converted into national language-speaking people',async()=>{
 const [matrix,a,c,l,s]=await Promise.all(paths.map(load));
 assert.deepEqual(auditCountryLanguageMatrix(matrix,a,c,l,new Set(s.evidence.map(e=>e.id))),{valid:true,errors:[]});
 assert.deepEqual(matrix.countries.map(x=>x.code),['MX','US','BR','IN','ID','JP','PH']);
 assert.deepEqual(matrix.countries.map(x=>x.ad_reach_millions),[85,254,150,500,151,78.5,59.6]);
 assert(matrix.countries.every(x=>x.viewer_first_language_count===null&&x.language_participation_rate===null));
});
test('The source-frame validator rejects invented languages, people, and reach changes',async()=>{
 const [m,a,c,l,s]=await Promise.all(paths.map(load)),ids=new Set(s.evidence.map(e=>e.id)),clone=()=>structuredClone(m);
 const invented=clone();invented.countries[0].language_participation_rate=0.85;assert(!auditCountryLanguageMatrix(invented,a,c,l,ids).valid);
 const reach=clone();reach.countries[3].ad_reach_millions=505;assert(!auditCountryLanguageMatrix(reach,a,c,l,ids).valid);
 const speaker=clone();speaker.countries[1].tag_is_observed_population=true;assert(!auditCountryLanguageMatrix(speaker,a,c,l,ids).valid);
});
