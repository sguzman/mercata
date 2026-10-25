import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildLiveReplayQuery,compareLiveReplay} from '../site/live-replay-observability.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Live playback and on-demand replay are independent activity states of the same livestream video',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/live-replay-observability.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.deepEqual(m.split.values,['LIVE','ON_DEMAND']);
 assert.equal(m.split.video_classification,'LIVE_STREAM');
 assert.equal(m.official_report.disallowed_combined_metric,'averageViewPercentage');
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Cannot request incompatible analytics dimensions or unowned reports',async()=>{
 const m=await load('ontology/youtube/live-replay-observability.json');
 const x={owner_authorized:true,video_id:'VID',start:'2026-01-01',end:'2026-01-31'};
 assert.equal(buildLiveReplayQuery(m,x).valid,true);
 assert.equal(buildLiveReplayQuery(m,{...x,owner_authorized:false}).valid,false);
 assert.equal(buildLiveReplayQuery(m,{...x,metrics:['averageViewPercentage']}).valid,false);
 assert.equal(buildLiveReplayQuery(m,{...x,start:'2026-02-01'}).valid,false);
});
test('Replay view event arithmetic cannot invent returning people or revenue',async()=>{
 const m=await load('ontology/youtube/live-replay-observability.json');
 const a={phase:'LIVE',owner_authorized:true,video_id:'VID',period:'2026-01',country:'US',views:60};
 const b={...a,phase:'ON_DEMAND',views:40};
 const out=compareLiveReplay(m,a,b);
 assert.equal(out.valid,true);assert.equal(out.replay_event_share,0.4);
 assert.equal(out.unique_returning_viewers,null);assert.equal(out.creator_revenue,null);
 assert.equal(compareLiveReplay(m,a,{...b,video_id:'OTHER'}).valid,false);
 assert.equal(compareLiveReplay(m,a,{...b,country:'MX'}).valid,false);
 assert.equal(compareLiveReplay(m,a,{...b,views:1.5}).valid,false);
 assert.equal(compareLiveReplay(m,{...a,views:0},{...b,views:0}).replay_event_share,null);
});
