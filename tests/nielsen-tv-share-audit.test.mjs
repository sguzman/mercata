import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compareNielsenTelevisionShare,assessNielsenDeviceInference,isNestedStreamingShare} from '../site/nielsen-tv-share-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Nielsen three release dates and comparable TV viewing share units are registered',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/nielsen-us-tv-youtube-share-2026.json'),read('specimens/youtube.json')]);
 assert(m.sources.every(id=>d.evidence.some(x=>x.id===id)));
 assert.deepEqual(m.observations.map(x=>x.period),['2026-05','2026-07','2026-08']);
 assert.deepEqual(m.observations.map(x=>x.youtube_share_total_tv_percent),[13.8,14.2,15.8]);
 assert.deepEqual(m.observations.map(x=>x.streaming_share_total_tv_percent),[48.6,49.0,49.6]);
 assert(m.observations.every(isNestedStreamingShare));
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('July-to-August change is a TV percentage point difference, not mobile audience growth',async()=>{
 const m=await read('ontology/youtube/nielsen-us-tv-youtube-share-2026.json');
 const c=compareNielsenTelevisionShare(m,'2026-07','2026-08');
 assert.equal(c.allowed,true);assert.equal(c.change,1.6);
 assert.equal(c.unit,'percentage_points_of_total_us_tv_watch_time');
 assert.equal(c.mobile_watch_share,null);
 assert.equal(c.creator_cash_income,null);
 assert.equal(compareNielsenTelevisionShare(m,'2026-08','2026-07').allowed,false);
 assert.equal(compareNielsenTelevisionShare(m,'2026-06','2026-07').allowed,false);
});
test('Reject unsupported global, mobile, person and income inference',async()=>{
 const m=await read('ontology/youtube/nielsen-us-tv-youtube-share-2026.json');
 for(const id of ['global_user_share','mobile_watch_time_share','cross_device_unique_people','creator_hourly_income','creator_profit'])
  assert.equal(assessNielsenDeviceInference(m,id).allowed,false);
 assert.equal(assessNielsenDeviceInference(m,'within_month_us_total_tv_watch_time_share').allowed,true);
 assert.equal(isNestedStreamingShare({youtube_share_total_tv_percent:49.9,streaming_share_total_tv_percent:48}),false);
});
test('Site includes the device denominator boundary and sources',async()=>{
 const code=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(code.includes('renderNielsenTelevisionShare'));
 assert(code.includes('nielsen-us-tv-youtube-share-2026.json'));
 assert(code.includes('not a mobile viewing share or total unique viewers'));
});
