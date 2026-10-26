import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditFourLanguageVideoCohorts,compareHistoricalVideoLanguages} from '../site/four-language-video-cohorts-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Study preserves 246381-video sampling, calibrated audio languages and unknown people',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/four-language-video-cohorts-2025.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditFourLanguageVideoCohorts(m,new Set(d.evidence.map(e=>e.id))),{valid:true,errors:[]});
 assert.deepEqual(m.language_cohorts.map(x=>x.median_duration_seconds),[119,148,29,98]);
 assert.equal(m.extra_hindi_study_values.shorts_sample_percent,58.31);
 assert.equal(m.source_sampling.exact_calibrated_sample_n_by_language,null);
});
test('Across-language video medians cannot become person participation or creator earnings',async()=>{
 const m=await load('ontology/youtube/four-language-video-cohorts-2025.json');
 const x=compareHistoricalVideoLanguages(m,'es','hi');
 assert.deepEqual(x.median_views,[39,37]);
 assert.deepEqual(x.median_duration_seconds,[148,29]);
 assert.equal(x.unique_viewer_difference,null);
 assert.equal(x.commenting_people_difference,null);
 assert.equal(x.net_income_difference,null);
 assert.equal(compareHistoricalVideoLanguages(m,'en','fr').allowed,false);
});
test('Audit rejects invented viewers, manipulated medians and fake sample counts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/four-language-video-cohorts-2025.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.language_cohorts[0].median_duration_seconds=100;
 assert(auditFourLanguageVideoCohorts(a,ids).errors.some(x=>x.includes('Durations')));
 const b=structuredClone(m);b.language_cohorts[1].creator_net_income=100;
 assert(auditFourLanguageVideoCohorts(b,ids).errors.some(x=>x.includes('income')));
 const c=structuredClone(m);c.source_sampling.exact_calibrated_sample_n_by_language=4200;
 assert(auditFourLanguageVideoCohorts(c,ids).errors.some(x=>x.includes('person sample')));
});
