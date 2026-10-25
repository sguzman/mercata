import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditQualityCrosswalk} from '../site/video-quality-audit.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Four bounded production/attention cohorts cannot become a synthetic quality census',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/video-quality-production-crosswalk-2026.json'),load('specimens/youtube.json')]);
 const sources=new Set(record.evidence.map(e=>e.id));
 assert.deepEqual(auditQualityCrosswalk(d,sources),{valid:true,errors:[]});
 assert.equal(d.dimensions.length,6);
 assert.deepEqual(d.bounded_observations.map(x=>x.sampled_video_count),[61,124,139,126]);
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
