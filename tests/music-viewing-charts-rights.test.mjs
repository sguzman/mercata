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
