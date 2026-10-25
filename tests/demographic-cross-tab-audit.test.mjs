import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditDemographicCrossTabs} from '../site/demographic-cross-tab-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const paths=['ontology/youtube/demographic-cross-tab-availability-2026.json','ontology/youtube/us-demographic-use-2026.json','ontology/youtube/us-news-demographic-crosswalk.json','ontology/youtube/demographic-identity-uncertainty.json','specimens/youtube.json'];
test('Pew 2026 adult survey marginal group rates remain separate from joint people counts',async()=>{
 const [a,b,c,d,e]=await Promise.all(paths.map(load));
 assert.deepEqual(auditDemographicCrossTabs(a,b,c,d,new Set(e.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(a.npors.whole_sample_n,5511);
 assert.equal(a.atp_news.whole_sample_n,5166);
 assert.equal(a.unavailable_joint_tables.length,7);
 assert(a.unavailable_joint_tables.every(x=>x.intersection_prevalence_percent===null));
});
test('Join validator rejects made-up cell n, multiplied rates and Asian population mislabel',async()=>{
 const [a,b,c,d,e]=await Promise.all(paths.map(load)),sources=new Set(e.evidence.map(x=>x.id)),copy=()=>structuredClone(a);
 const x=copy();x.unavailable_joint_tables[0].intersection_prevalence_percent=40;assert(!auditDemographicCrossTabs(x,b,c,d,sources).valid);
 const y=copy();y.published_marginal_rates[0].cells[0].subgroup_n=5511;assert(!auditDemographicCrossTabs(y,b,c,d,sources).valid);
 const z=copy();z.npors.english_only_asian_estimate=false;assert(!auditDemographicCrossTabs(z,b,c,d,sources).valid);
});
