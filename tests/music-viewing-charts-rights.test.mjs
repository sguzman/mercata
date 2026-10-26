import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Music chart metrics are not folded into one listening or payment denominator',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/music-viewing-charts-rights-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));assert(m.source_ids.every(x=>ids.has(x)));
 assert.equal(m.industry_watch_time.reported_music_videos_share_of_youtube_watch_time_percent,33);
 assert.equal(m.industry_watch_time.unique_listeners,null);
 assert.equal(m.music_charts.find(x=>x.id==='daily_and_weekly_shorts_music').unit,'number_of_shorts_created_using_song');
 assert.equal(m.music_charts.find(x=>x.id==='music_insights').exclude_shorts_certain,true);
 assert(m.creator_content_formats.every(x=>x.measured_net_income===null));
 assert(Object.values(m.unmeasured).every(x=>x===null));
});

test('Music coaching and drum covers are bounded view events, not comparable growth or income',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/music-viewing-charts-rights-2026.json'),load('specimens/youtube.json')]);
 const events=m.selected_music_format_activity.reported_source_events;
 assert.equal(events.length,2);
 assert(events.every(x=>d.evidence.some(s=>s.id===x.source_id)));
 assert.deepEqual(events.map(x=>x.strict_lower_bound_exclusive),[500000000,500000000]);
 assert.deepEqual(events.map(x=>x.predicate_type),['undisclosed_platform_topic_classifier','explicit_title_keyword']);
 assert.deepEqual(events.map(x=>x.start),['2024-01-01','2026-01-01']);
 assert.equal(m.selected_music_format_activity.same_definition_growth_rate,null);
 assert.equal(m.selected_music_format_activity.deduplicated_viewer_union,null);
 assert.equal(m.selected_music_format_activity.creator_median_net_earnings,null);
 assert.equal(m.industry_watch_time.reported_music_videos_share_of_youtube_watch_time_percent,33);
 assert(m.creator_content_formats.every(x=>x.measured_net_income===null));
});
