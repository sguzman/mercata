import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {summarizeTopicCoverage,compareTopicObservations,validateCategoryChange,auditTopicMetricCoverage} from '../site/topic-observation-coverage-audit.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Every topic and each source-selected observation is mapped without audience imputation',async()=>{
 const [m,t,o]=await Promise.all([load('ontology/youtube/topic-observation-coverage-2026.json'),load('ontology/youtube/taxonomy.json'),load('ontology/youtube/topic-observations.json')]);
 const v=summarizeTopicCoverage(m);assert.equal(v.valid,true);assert.equal(v.topics,t.topics.length);
 assert.equal(v.observations,o.observations.length);assert(v.missing>0);
 for(const x of m.topics){assert.equal(x.unique_people,null);assert.equal(x.topic_total_views,null);assert.equal(x.active_creator_count,null);
  for(const y of x.observations)assert(o.observations.some(z=>z.id===y.id&&z.topic_id===x.id&&z.source_url===y.source_url));}
});
test('Incompatible denominators cannot be compared or summed into unique viewers',async()=>{
 const m=await load('ontology/youtube/topic-observation-coverage-2026.json');
 const all=m.topics.flatMap(x=>x.observations);
 const mine=all.find(x=>x.id==='minecraft-cumulative-2024');
 const roblox=all.find(x=>x.id==='roblox-cumulative-2025');
 const news=all.find(x=>x.id==='news-watch-hours-2025');
 assert.equal(compareTopicObservations(mine,roblox,'descriptive_metric_comparison').allowed,false);
 assert.equal(compareTopicObservations(mine,news,'descriptive_metric_comparison').allowed,false);
 assert.equal(compareTopicObservations(mine,mine,'descriptive_metric_comparison').additive,false);
 assert.equal(compareTopicObservations(mine,roblox,'unique_topic_audience').allowed,false);
});
test('Category drift requires explicit versions and never reclassifies old rows silently',async()=>{
 const m=await load('ontology/youtube/topic-observation-coverage-2026.json');
 const x={old_topic:'gaming',new_topic:'esports',effective_date:'2026-11-01',source_version:'2026-10',destination_version:'2026-11',reason:'illustrative narrower category'};
 assert.equal(validateCategoryChange(m,x).allowed,true);
 assert.equal(validateCategoryChange(m,x).retroactively_reclassified,false);
 assert.equal(validateCategoryChange(m,{...x,reason:''}).allowed,false);
 assert.equal(validateCategoryChange(m,{...x,old_topic:'not_real'}).allowed,false);
});

test('Metric-family audit exposes selected source coverage without claiming complete genre audiences',async()=>{
 const [m,o]=await Promise.all([load('ontology/youtube/topic-observation-coverage-2026.json'),load('ontology/youtube/topic-observations.json')]);
 assert.deepEqual(auditTopicMetricCoverage(m,o),{valid:true,errors:[]});
 const a=m.metric_family_coverage_audit;
 assert.equal(a.topics_with_two_or_more_metric_families,3);
 assert.equal(a.topics_with_two_or_more_distinct_source_documents,6);
 assert.deepEqual(a.selected_multi_metric_topic_ids,['crafts','sports-general','football-soccer']);
 assert.equal(a.observations_by_metric_family.video_views,23);
 assert.equal(Object.values(a.observations_by_metric_family).reduce((s,x)=>s+x,0),36);
 assert.equal(a.topics_with_both_full_topic_unique_viewers_and_creators,0);
 assert.equal(a.topics_with_verified_disjoint_independent_sample_frames,0);
 assert(a.topic_metric_coverage.every(x=>x.verified_full_topic_unique_viewers===null&&
   x.verified_full_topic_active_creators===null&&x.independent_sampling_frames_verified===false));
});
test('Metric audit rejects invented audience populations and reclassified metric counts',async()=>{
 const [m,o]=await Promise.all([load('ontology/youtube/topic-observation-coverage-2026.json'),load('ontology/youtube/topic-observations.json')]);
 const x=structuredClone(m);x.metric_family_coverage_audit.topic_metric_coverage[0].verified_full_topic_unique_viewers=25000;
 assert(auditTopicMetricCoverage(x,o).errors.includes('invented full-topic audience or source independence'));
 const y=structuredClone(m);y.metric_family_coverage_audit.observations_by_metric_family.video_views=55;
 assert(auditTopicMetricCoverage(y,o).errors.includes('metric family counts not reconciled'));
 const z=structuredClone(m);z.metric_family_coverage_audit.verification_gate.can_rank_total_topic_audience=true;
 assert(auditTopicMetricCoverage(z,o).errors.includes('unverified population inference'));
});
