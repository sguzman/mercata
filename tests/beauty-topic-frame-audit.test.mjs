import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditBeautyTopicFrames} from '../site/beauty-topic-frame-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Three dated beauty-related primary observations have mutually incompatible topics and periods',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/fashion-lifestyle-content-signals-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditBeautyTopicFrames(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.deepEqual(m.beauty_subtopic_frames.map(x=>x.lower_bound),[5000000000,2000000000,1000000000]);
 assert(m.beauty_subtopic_frames.every(x=>x.unique_people===null&&x.verified_creator_profit===null));
});
test('Beauty signals reject invented audience duplication, a period change, and unsupported financial ranking',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/fashion-lifestyle-content-signals-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(m);
 const a=copy();a.beauty_subtopic_frames[1].unique_people=2000000000;assert(!auditBeautyTopicFrames(a,ids).valid);
 const b=copy();b.beauty_subtopic_frames[2].window_end='2025-12-31';assert(!auditBeautyTopicFrames(b,ids).valid);
 const c=copy();c.beauty_subtopic_comparability.estimated_niche_revenue_per_view=0.01;assert(!auditBeautyTopicFrames(c,ids).valid);
});
