import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {comparePodcastObservations,inferPodcastAudience,canSumPodcastSurveyFormats} from '../site/podcast-viewing-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Podcast platform and survey frames cite four different source populations',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/podcast-viewing-frames-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.observations.length,5);
 assert.deepEqual(m.observations.slice(0,4).map(x=>x.value),[1e9,4e8,7e8,8e8]);
 assert.equal(m.observations[4].watched_video_percent,82);
 assert.equal(m.observations[4].listened_audio_only_percent,78);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Same living-room October watch hour comparisons are bounded, not exact growth claims',async()=>{
 const m=await load('ontology/youtube/podcast-viewing-frames-2026.json');
 const pair=comparePodcastObservations(m,'oct2024_living_room_hours','oct2025_living_room_hours');
 assert.equal(pair.allowed,true);assert.equal(pair.exact_growth,null);
 assert.equal(comparePodcastObservations(m,'oct2025_living_room_hours','apr2026_premium_podcast_hours').allowed,false);
 assert.equal(comparePodcastObservations(m,'jan2025_global_podcast_viewers','oct2025_living_room_hours').allowed,false);
 assert.equal(comparePodcastObservations(m,'q3_2025_weekly_video_audio_format','jan2025_global_podcast_viewers').allowed,false);
});
test('Video and audio consumer behavior overlap; cannot sum independent viewer counts',async()=>{
 const m=await load('ontology/youtube/podcast-viewing-frames-2026.json');
 assert.equal(canSumPodcastSurveyFormats(m),false);
 for(const claim of ['exclusive_video_podcast_audience','global_podcast_creator_median','premium_podcast_royalties','watch_minutes_per_person'])
  assert.equal(inferPodcastAudience(m,claim).allowed,false);
});
test('Public dossier keeps listening and watch-time measures separate',async()=>{
 const s=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(s.includes('renderPodcastViewingFrames'));
 assert(s.includes('podcast-viewing-frames-2026.json'));
 assert(s.includes('not a unique-person or creator-income comparison'));
});
