import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditDemographicCrossTabs,auditNporsYearlyDemographics} from '../site/demographic-cross-tab-audit.mjs';
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

test('2025 and 2026 NPORS subgroup comparisons are checked against both registered survey frames',async()=>{
 const [m,c,d]=await Promise.all(['ontology/youtube/us-demographic-use-2026.json','ontology/youtube/study-frame-crosswalk.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditNporsYearlyDemographics(m,c,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.deepEqual(m.cross_survey_2025_2026.strata.find(x=>x.id==='education').point_delta_pp,[-1,0,1]);
 assert.deepEqual(m.cross_survey_2025_2026.strata.find(x=>x.id==='residence').point_delta_pp,[2,-1,-1]);
 assert.deepEqual(m.cross_survey_2025_2026.strata.find(x=>x.id==='household_income').point_delta_pp,[0,0,-1,1]);
});
test('NPORS two-survey audit refuses false significance, wrong subgroup rates and ATP denominator substitution',async()=>{
 const [m,c,d]=await Promise.all(['ontology/youtube/us-demographic-use-2026.json','ontology/youtube/study-frame-crosswalk.json','specimens/youtube.json'].map(load));
 const sources=new Set(d.evidence.map(x=>x.id));
 const wrongN=structuredClone(m);wrongN.cross_survey_2025_2026.fieldwork[0].sample_n=5123;
 assert(auditNporsYearlyDemographics(wrongN,c,sources).errors.includes('NPORS survey frames confused'));
 const wrongDelta=structuredClone(m);wrongDelta.cross_survey_2025_2026.strata[0].point_delta_pp[0]=8;
 assert(auditNporsYearlyDemographics(wrongDelta,c,sources).errors.includes('stratum values or point changes not reconciled'));
 const wrongSignificance=structuredClone(m);wrongSignificance.cross_survey_2025_2026.comparability.statistical_significance_test_completed=true;
 assert(auditNporsYearlyDemographics(wrongSignificance,c,sources).errors.includes('invented statistical significance or longitudinal panel'));
});
