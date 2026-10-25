import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessProductionLabor,assessWorkflowRounding} from '../site/photography-production-labor-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Self-logged single creator observation is registered, not a labor census',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/photography-production-time-diary-2025.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(s=>s.id===m.source_id));
 assert.equal(m.subject_count,1);assert.equal(m.published_video_count,61);
 assert.equal(m.time_per_completed_video_hours.arithmetic_mean,9.74);
 assert.equal(m.time_per_completed_video_hours.median,7.37);
 assert.equal(m.time_per_completed_video_hours.maximum,60.92);
 assert(Object.values(m.excluded_or_unobserved).every(x=>x===null));
});
test('Work stages reconcile with author-reported rounding rather than false precision',async()=>{
 const m=await load('ontology/youtube/photography-production-time-diary-2025.json');
 const r=assessWorkflowRounding(m);
 assert.equal(r.rounded_total_hours,9.73);
 assert.equal(r.reported_mean_hours,9.74);
 assert.equal(r.rounding_gap_hours,0.01);
 assert.equal(r.shares_total_percent,100);
 assert.equal(r.consistent_with_component_rounding,true);
 assert.equal(m.hours_per_video_workflow.find(x=>x.phase==='postproduction').pct_work,50);
});
test('No mean creator wage or other genre inference follows from a photography diary',async()=>{
 const m=await load('ontology/youtube/photography-production-time-diary-2025.json');
 const basis={scope:'single_photography_creator_completed_videos'};
 const r=assessProductionLabor(m,'work_minutes_per_published_minute',basis);
 assert.equal(r.valid,true);assert.equal(r.value,169);assert.equal(r.creator_wages,null);
 assert.equal(assessProductionLabor(m,'mean_hours',{scope:'all_youtube_creators'}).valid,false);
 assert.equal(assessProductionLabor(m,'estimated_hourly_income',basis).valid,false);
 assert.equal(assessProductionLabor(m,'industry_average_cost',basis).valid,false);
});
test('Public source panel retains observed units and financial unknowns',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderPhotographyLaborStudy'));
 assert(a.includes('photography-production-time-diary-2025.json'));
 assert(a.includes('not representative creator hourly wages'));
});
