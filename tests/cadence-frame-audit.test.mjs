import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditCadenceFrames} from '../site/cadence-frame-audit.mjs';
const load=async file=>JSON.parse(await fs.readFile(new URL('../'+file,import.meta.url),'utf8'));
test('Different 282, 18k and 10.2m provider samples remain nonpoolable',async()=>{
 const [s,d]=await Promise.all([load('ontology/youtube/publishing-cadence-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditCadenceFrames(s,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(s.additional_study.recommendations.find(x=>x.niche==='education').max_per_week,1.5);
 assert.equal(s.datasets.find(x=>x.id==='air-282-2026').niche_size_groups.find(x=>x.id==='education_medium').median_uploads_month,26);
});
test('Cadence audit rejects invented pooled or causal outcomes',async()=>{
 const [s,d]=await Promise.all([load('ontology/youtube/publishing-cadence-evidence.json'),load('specimens/youtube.json')]),ids=new Set(d.evidence.map(x=>x.id)),clone=()=>structuredClone(s);
 const a=clone();a.additional_study.causal_optimal_frequency=5;assert(!auditCadenceFrames(a,ids).valid);
 const b=clone();b.cross_study_comparability.third_sample_compatible=true;assert(!auditCadenceFrames(b,ids).valid);
 const c=clone();c.additional_study.source_id='fake';assert(!auditCadenceFrames(c,ids).valid);
});

test('Independent 47-channel Korean beauty abstract cannot supply causal upload effects or RPM',async()=>{
 const [s,d]=await Promise.all([load('ontology/youtube/publishing-cadence-evidence.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id)),a=s.peer_reviewed_observational_case;
 assert.deepEqual(auditCadenceFrames(s,ids),{valid:true,errors:[]});
 assert.equal(a.sample_channels,47);
 assert.equal(a.source_access,'publisher_abstract_and_university_bibliography_only');
 assert.deepEqual(a.exposures,['upload_frequency','upload_consistency','shorts_content_type_concentration']);
 assert.equal(a.shorts_to_longform_marginal_effect,null);
 assert.equal(a.upload_rate_median,null);
 assert.equal(a.net_creator_profit,null);
 const fake=structuredClone(s);fake.peer_reviewed_observational_case.qualitative_reported_associations[0].coefficient=0.5;
 assert(auditCadenceFrames(fake,ids).errors.includes('fabricated statistical significance or causal effect'));
 const fake2=structuredClone(s);fake2.cross_study_comparability.can_pool_peer_reviewed_beauty_cohort=true;
 assert(auditCadenceFrames(fake2,ids).errors.includes('invented quantified cadence or pooled revenue'));
});
