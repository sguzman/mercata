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
