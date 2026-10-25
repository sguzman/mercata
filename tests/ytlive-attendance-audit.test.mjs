import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateLiveMeasurement,classifyDuration} from '../site/ytlive-attendance-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YTLive records selected 2024 concurrency, not viewers or earnings',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/ytlive-attendance-observations-2026.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(s=>s.id===m.source_id));
 assert.equal(m.sample.number_of_streams,12156);
 assert.equal(m.sample.measurement_records_strictly_greater_than,507000);
 assert.equal(m.sample.sampling_interval_minutes,5);
 assert.equal(m.sample.time_reference,'UTC');
 assert.equal(m.sample.unique_viewer_count_recorded,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('No retention, RPM, total audience or causal scheduling inference from concurrency',async()=>{
 const m=await load('ontology/youtube/ytlive-attendance-observations-2026.json');
 assert.equal(evaluateLiveMeasurement(m,{metric:'sampled_concurrent_viewers',window:'2024-05_to_2024-06'}).allowed,true);
 assert.equal(evaluateLiveMeasurement(m,{metric:'unique_viewers',window:'2024-05_to_2024-06'}).allowed,false);
 assert.equal(evaluateLiveMeasurement(m,{metric:'sampled_concurrent_viewers',window:'2026-10'}).allowed,false);
 assert.equal(evaluateLiveMeasurement(m,{metric:'sampled_concurrent_viewers',window:'2024-05_to_2024-06',claim:'best_upload_time'}).allowed,false);
 assert.equal(evaluateLiveMeasurement(m,{metric:'sampled_concurrent_viewers',window:'2024-05_to_2024-06'}).creator_profit,null);
 assert.equal(classifyDuration(m,119.9),'short');
 assert.equal(classifyDuration(m,120),'medium');
 assert.equal(classifyDuration(m,239.9),'medium');
 assert.equal(classifyDuration(m,240),'long');
});
test('Public site labels the empirical source frame',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderYTLiveAttendance'));
 assert(a.includes('ytlive-attendance-observations-2026.json'));
 assert(a.includes('not unique viewers or earnings'));
});
