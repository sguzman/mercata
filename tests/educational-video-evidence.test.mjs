import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inspectEducationCohort,compareEducationStudies} from '../site/educational-video-evidence.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Three public education studies have distinct channel-specific samples and documented sources',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/educational-video-format-cohorts-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.deepEqual(m.studies.map(x=>x.selected_videos),[124,139,126]);
 assert.equal(m.studies[1].sampling_frame_videos,218);
 assert.equal(m.studies.every(x=>x.no_causal_assignment&&x.creator_cash_profit_observed===false),true);
 assert.equal(m.actual_mercata_channel_observations.length,0);
 assert.equal(m.global_education_watch_minutes,null);
});
test('Retention metrics and public video engagement do not share a denominator',async()=>{
 const m=await load('ontology/youtube/educational-video-format-cohorts-2026.json');
 assert.equal(inspectEducationCohort(m,'spanish_stem_exercise_vs_dissemination','audience_retention_after_30_seconds').allowed,true);
 assert.equal(inspectEducationCohort(m,'spanish_stem_exercise_vs_dissemination','likes').allowed,false);
 assert.equal(inspectEducationCohort(m,'turkish_highly_viewed_mathematics','views').allowed,true);
 assert.equal(inspectEducationCohort(m,'turkish_highly_viewed_mathematics','average_view_duration').allowed,false);
 assert.equal(inspectEducationCohort(m,'indonesian_instruction_vs_test','watch_time').allowed,true);
});
test('Study selection does not establish universal optimal video duration, earning distributions or causal effects',async()=>{
 const m=await load('ontology/youtube/educational-video-format-cohorts-2026.json');
 const selected=compareEducationStudies(m,m.studies[0].id,m.studies[1].id,'distinct_selected_video_counts');
 assert.equal(selected.allowed,true);
 assert.equal(selected.combined_representative_sample,null);
 assert.equal(compareEducationStudies(m,m.studies[0].id,m.studies[2].id,'universal_best_minutes').allowed,false);
 assert.equal(compareEducationStudies(m,m.studies[1].id,m.studies[2].id,'typical_youtube_education_income').allowed,false);
 assert.equal(inspectEducationCohort(m,m.studies[0].id,'average_view_duration').all_youtube_typical_income,null);
});
test('Public research website distinguishes the three observational video cohorts',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderEducationalVideoStudies'));
 assert(app.includes('educational-video-format-cohorts-2026.json'));
 assert(app.includes('not a universal best video length or typical creator earnings'));
});
