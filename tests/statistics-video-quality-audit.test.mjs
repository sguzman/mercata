import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditStatisticsVideoSample} from '../site/statistics-video-quality-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Relevance-selected statistics tutorial review preserves screening denominator and content formats',async()=>{
 const [x,s]=await Promise.all([load('ontology/youtube/educational-video-format-cohorts-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditStatisticsVideoSample(x,new Set(s.evidence.map(e=>e.id))),{valid:true,errors:[]});
 assert.equal(x.statistics_search_quality_case.eligible_videos,114);
 assert.equal(x.statistics_search_quality_case.content_formats.reduce((n,v)=>n+v.videos,0),114);
});
test('Statistics study sample does not become all-education high-quality rate or actual profit',async()=>{
 const [x,s]=await Promise.all([load('ontology/youtube/educational-video-format-cohorts-2026.json'),load('specimens/youtube.json')]);
 const sources=new Set(s.evidence.map(e=>e.id)),copy=()=>structuredClone(x);
 const a=copy();a.statistics_search_quality_case.eligible_videos=200;assert(!auditStatisticsVideoSample(a,sources).valid);
 const b=copy();b.statistics_search_quality_case.representative_all_educational_video_quality_rate=76.3;assert(!auditStatisticsVideoSample(b,sources).valid);
 const c=copy();c.statistics_search_quality_case.creator_cash_profit=1500;assert(!auditStatisticsVideoSample(c,sources).valid);
});
