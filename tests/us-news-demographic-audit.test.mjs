import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditNewsDemographicCrosswalk,compareSurveySubgroups} from '../site/us-news-demographic-audit.mjs';
const load=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Two source-backed Pew 2026 survey frames retain subgroup evidence and unknown joint cells',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/us-news-demographic-crosswalk.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditNewsDemographicCrosswalk(study,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(study.regular_news_us_adult_series.length,7);
 assert.equal(study.strata.length,8);
 assert(Object.values(study.unmeasured).every(x=>x===null));
});
test('Men and women or age groups cannot be subtracted as if same stratum',async()=>{
 const study=await load('ontology/youtube/us-news-demographic-crosswalk.json');
 assert.equal(compareSurveySubgroups(study.strata[0],study.strata[1]).status,'different_population_or_survey');
 assert.equal(compareSurveySubgroups(study.strata[2],study.strata[5]).status,'different_population_or_survey');
});
test('Audit refuses manufactured biological sex, sample n or party intersections',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/us-news-demographic-crosswalk.json'),load('specimens/youtube.json')]);
 study.categorical_semantics.biological_sex_specific_news_use=27;
 study.strata[0].subgroup_n=400;
 study.unmeasured.gender_by_party_joint_youtube_news=0.23;
 const x=auditNewsDemographicCrosswalk(study,new Set(dossier.evidence.map(x=>x.id)));
 assert(!x.valid);
 assert(x.errors.includes('unverified biological sex'));
 assert(x.errors.includes('invented composition or precision'));
 assert(x.errors.includes('invented missing data'));
});
