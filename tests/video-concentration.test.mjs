import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {videoSampleConcentration,auditVideoConcentration} from '../site/video-concentration.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const sample={topic_id:'synthetic_four_videos',period_start:'2026-09-01',period_end:'2026-09-30',selection_method:'fully_synthetic_fixture_not_observed',metric:'view_events',video_rows:[{video_id:'a',value:50},{video_id:'b',value:30},{video_id:'c',value:10},{video_id:'d',value:10}]};
test('Top share, Herfindahl and Gini are video-based and scoped to the sample',()=>{
 const r=videoSampleConcentration(sample,{topFraction:0.25});
 assert.equal(r.sample_size,4);assert.equal(r.top_video_count,1);assert.equal(r.top_share_percent,50);
 assert(Math.abs(r.video_share_hhi-0.36)<1e-10);assert(Math.abs(r.video_share_gini-0.35)<1e-10);
 assert.equal(r.creator_profit,null);assert.equal(r.all_niche_video_share,null);
});
test('Reject duplicate video IDs, missing selection criteria, and invalid metrics',()=>{
 const x=structuredClone(sample);x.video_rows[1].video_id='a';assert.throws(()=>videoSampleConcentration(x),/unique/);
 const y=structuredClone(sample);y.video_rows[0].value=-2;assert.throws(()=>videoSampleConcentration(y),/nonnegative/);
 const z=structuredClone(sample);z.video_rows.forEach(x=>x.value=0);assert.throws(()=>videoSampleConcentration(z),/denominator/);
 assert.throws(()=>videoSampleConcentration(sample,{topFraction:0}),/fraction/);
 const w=structuredClone(sample);w.metric='estimated_creators';assert.throws(()=>videoSampleConcentration(w),/supported/);
});
test('Original Omdia 91/9 observation is not a new niche or earnings sample',async()=>{
 const [m,a,d]=await Promise.all(['ontology/youtube/video-concentration-2026.json','ontology/youtube/video-attention-culture-2026.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditVideoConcentration(m,a,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(m.measured_niche_samples.length,0);
});
