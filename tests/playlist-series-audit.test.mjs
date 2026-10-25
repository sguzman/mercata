import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessPlaylistMetricClaim,buildSeriesStudyFrame} from '../site/playlist-series-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official playlist metrics preserve context, web-only measures and source IDs',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/playlist-series-observability.json'),read('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.metric_definitions.length,9);
 assert.deepEqual(m.metric_definitions.filter(x=>x.web_only).map(x=>x.id),['playlistStarts','viewsPerPlaylistStart','averageTimeInPlaylist']);
 assert.equal(m.authorized_api_calls_performed,false);
 assert.equal(m.official_sample_query.executed,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('No mixing owner video views, web playlist depth, people or sales',async()=>{
 const m=await read('ontology/youtube/playlist-series-observability.json');
 assert.equal(assessPlaylistMetricClaim(m,['estimatedMinutesWatched'],'owner_video_minutes').allowed,true);
 assert.equal(assessPlaylistMetricClaim(m,['playlistEstimatedMinutesWatched'],'owner_video_minutes').allowed,false);
 assert.equal(assessPlaylistMetricClaim(m,['playlistEstimatedMinutesWatched'],'in_playlist_minutes').allowed,true);
 assert.equal(assessPlaylistMetricClaim(m,['playlistStarts','viewsPerPlaylistStart'],'web_view_events_per_start').allowed,true);
 assert.equal(assessPlaylistMetricClaim(m,['playlistViews','viewsPerPlaylistStart'],'web_view_events_per_start').allowed,false);
 for(const claim of ['unique_people','returning_people','full_series_completion','buyer_conversion','creator_profit'])
  assert.equal(assessPlaylistMetricClaim(m,['playlistViews'],claim).allowed,false);
 assert.equal(assessPlaylistMetricClaim(m,['playlistViews','playlistViews'],'web_view_events_per_start').allowed,false);
});
test('Study setup is distinct from collected observations',async()=>{
 const m=await read('ontology/youtube/playlist-series-observability.json');
 const frame={playlistId:'PL123',episodes:5,start:'2026-09-01',end:'2026-09-30',ownerAuthorized:true};
 assert.equal(buildSeriesStudyFrame(m,{...frame,ownerAuthorized:false}).ready,false);
 assert.equal(buildSeriesStudyFrame(m,frame).ready,true);
 assert.equal(buildSeriesStudyFrame(m,frame).observed_count,0);
 assert.equal(buildSeriesStudyFrame(m,frame).unique_returners,null);
});
test('Public site exposes playlist scope',async()=>{
 const source=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(source.includes('renderPlaylistSeriesStudy'));
 assert(source.includes('playlist-series-observability.json'));
 assert(source.includes('not unique returning viewers'));
});
