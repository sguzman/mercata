import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateSearchStudyFrame,bucketVideoAge,inferEvergreenFromTrends,auditInstructionalVideoSurveyContext} from '../site/evergreen-search-window-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Evergreen research is an authorized source-tagged video cohort, not observed creator profit',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/evergreen-search-window-protocol.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.official_features[1].observed_period_days,28);
 assert.equal(m.official_features[1].search_volume_absolute,null);
 assert.equal(m.official_features[2].query_complexity_video_count_times_days_max,50000);
 assert.equal(m.protocol.no_live_test_executed,true);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Disjoint video-age windows prevent raw lifetime count comparisons',async()=>{
 const m=await load('ontology/youtube/evergreen-search-window-protocol.json');
 assert.deepEqual([-1,0,30,31,180,181,365,366].map(x=>bucketVideoAge(m,x)),
  [null,'initial','initial','middle','middle','later','later',null]);
});
test('Owner query must have explicit target and keep within published API video-day budget',async()=>{
 const m=await load('ontology/youtube/evergreen-search-window-protocol.json');
 const a={ownerAuthorized:true,videoIds:['video1','video2'],queriedDays:365,
  contentType:'stepwise_tutorial',topic:'versioned task',language:'es',observationCutoff:'2026-10-25'};
 const ok=validateSearchStudyFrame(m,a);
 assert.equal(ok.valid,true);assert.equal(ok.query_video_days,730);
 assert.equal(ok.observed_search_share,null);assert.equal(ok.creator_profit,null);
 assert.equal(validateSearchStudyFrame(m,{...a,ownerAuthorized:false}).valid,false);
 assert.equal(validateSearchStudyFrame(m,{...a,videoIds:['same','same']}).valid,false);
 assert.equal(validateSearchStudyFrame(m,{...a,queriedDays:30000}).valid,false);
 assert.equal(validateSearchStudyFrame(m,{...a,contentType:'unknown'}).valid,false);
});
test('Recent Studio Trends signals never become forecasts or absolute keyword search volume',async()=>{
 const m=await load('ontology/youtube/evergreen-search-window-protocol.json');
 const x=inferEvergreenFromTrends(m,{rank:'high',periodDays:28});
 assert.equal(x.supported,false);assert.equal(x.absolute_search_volume,null);assert.equal(x.creator_profit,null);
});
test('Site renders evergreen search method and unknown owner observations',async()=>{
 const src=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(src.includes('renderEvergreenSearchWindows'));
 assert(src.includes('evergreen-search-window-protocol.json'));
 assert(src.includes('not absolute keyword search volume or creator earnings'));
});

test('Kantar instructional preferences are an attitudinal sample, not repeated owner search traffic',async()=>{
 const [m,d,s]=await Promise.all([load('ontology/youtube/evergreen-search-window-protocol.json'),load('specimens/youtube.json'),load('ontology/youtube/shopping-funnel-evidence-2025.json')]);
 assert.deepEqual(auditInstructionalVideoSurveyContext(m,new Set(d.evidence.map(x=>x.id)),s),{valid:true,errors:[]});
 assert.equal(m.instructional_video_survey_context.full_sample_n,2160);
 assert.deepEqual(m.instructional_video_survey_context.observations.map(x=>x.value_percent),[69,70,63,91]);
 assert.equal(m.instructional_video_survey_context.question_specific_sample_n,null);
 assert.equal(m.instructional_video_survey_context.actual_evergreen_search_queries,null);
 assert.equal(m.instructional_video_survey_context.income_from_tutorials,null);
});
test('The survey cannot supply missing keyword volumes or actual returning people',async()=>{
 const [m,d,s]=await Promise.all([load('ontology/youtube/evergreen-search-window-protocol.json'),load('specimens/youtube.json'),load('ontology/youtube/shopping-funnel-evidence-2025.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.instructional_video_survey_context.verified_repeat_search_users=123;
 assert(auditInstructionalVideoSurveyContext(a,ids,s).errors.includes('invented tutorial repeat search or earnings outcome'));
 const b=structuredClone(m);b.instructional_video_survey_context.observations[0].value_percent=95;
 assert.equal(auditInstructionalVideoSurveyContext(b,ids,s).valid,false);
 const c=structuredClone(m);c.instructional_video_survey_context.question_specific_sample_n=2160;
 assert(auditInstructionalVideoSurveyContext(c,ids,s).errors.includes('survey population or question-level precision distorted'));
});
