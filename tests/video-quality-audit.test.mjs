import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditQualityCrosswalk} from '../site/video-quality-audit.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Five separately bounded production, attention, and expert-rated quality cohorts cannot become a synthetic quality census',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/video-quality-production-crosswalk-2026.json'),load('specimens/youtube.json')]);
 const sources=new Set(record.evidence.map(e=>e.id));
 assert.deepEqual(auditQualityCrosswalk(d,sources),{valid:true,errors:[]});
 assert.equal(d.dimensions.length,8);
 assert.deepEqual(d.bounded_observations.map(x=>x.sampled_video_count),[61,124,139,126,114]);
 assert(Object.values(d.unknowns).every(x=>x===null));
});
test('Quality protocol blocks unsourced groups, lost denominators, invented earnings and universal hour thresholds',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/video-quality-production-crosswalk-2026.json'),load('specimens/youtube.json')]);
 const sources=new Set(record.evidence.map(e=>e.id)),copy=()=>structuredClone(d);
 const a=copy();a.bounded_observations[1].source_id='invented';assert(!auditQualityCrosswalk(a,sources).valid);
 const b=copy();b.bounded_observations[2].sampling_frame_videos=139;assert(!auditQualityCrosswalk(b,sources).valid);
 const c=copy();c.bounded_observations[0].reported_stage_mean_hours.postproduction=9.3;assert(!auditQualityCrosswalk(c,sources).valid);
 const e=copy();e.unknowns.creator_net_profit=100;assert(!auditQualityCrosswalk(e,sources).valid);
 const f=copy();f.dimensions[0].universal_quality_cutoff=9;assert(!auditQualityCrosswalk(f,sources).valid);
});

test('Search-selected expert quality scores cannot be presented as global video quality or learning improvements',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/video-quality-production-crosswalk-2026.json'),load('specimens/youtube.json')]);
 const s=new Set(record.evidence.map(e=>e.id)),p=d.bounded_observations.find(x=>x.id==='english_statistics_search_expert_ratings');
 assert.equal(p.source_id,'j-korean-med-sci-statistics-video-quality-2026');
 assert.deepEqual([p.search_results_initial_urls,p.duplicate_urls_excluded,p.other_language_excluded,p.off_topic_excluded,p.sampled_video_count],[200,41,22,23,114]);
 assert.deepEqual([p.low_quality_videos,p.intermediate_quality_videos,p.high_quality_videos],[12,15,87]);
 assert.deepEqual(p.presentation_formats.map(x=>x.selected_videos),[45,24,29,16]);
 assert.equal(p.creator_labor_hours,null);assert.equal(p.measured_educational_outcome,null);
 assert.deepEqual(auditQualityCrosswalk(d,s),{valid:true,errors:[]});
 const fake=structuredClone(d);fake.bounded_observations[4].high_quality_videos=110;
 assert(auditQualityCrosswalk(fake,s).errors.includes('Expert GQS category results corrupted'));
 const fake2=structuredClone(d);fake2.bounded_observations[4].viewer_learning_improvement=0.7;
 assert(auditQualityCrosswalk(fake2,s).errors.includes('Expert ratings falsely converted to people, labor or learner outcomes'));
});
