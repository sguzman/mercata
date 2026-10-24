import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePublishInstant,auditTimingStudyComparison} from '../site/publish-time-audit.mjs';
test('Ordinary local publication time resolves to a real UTC instant',()=>{
 const r=resolvePublishInstant({local_date:'2026-10-24',local_clock:'12:00',time_zone:'America/Mexico_City'});
 assert.equal(r.status,'resolved');
 assert.equal(r.utc_instant,'2026-10-24T18:00:00.000Z');
});
test('Spring-forward DST gap must not be scheduled as a real instant',()=>{
 const r=resolvePublishInstant({local_date:'2026-03-08',local_clock:'02:30',time_zone:'America/New_York'});
 assert.equal(r.status,'nonexistent_local_time');
 assert.equal(r.utc_instant,null);
});
test('Autumn DST fold requires an explicit UTC instant for reproducible comparison',()=>{
 const opts={local_date:'2026-11-01',local_clock:'01:30',time_zone:'America/New_York'};
 const r=resolvePublishInstant(opts);
 assert.equal(r.status,'ambiguous_local_time');
 assert.equal(r.candidates.length,2);
 assert.equal(resolvePublishInstant({...opts,release_utc:'2026-11-01T05:30:00.000Z'}).status,'resolved');
 assert.equal(resolvePublishInstant({...opts,release_utc:'2026-11-01T07:30:00.000Z'}).status,'invalid');
});
test('Invalid local dates and time zones cannot be silently normalized',()=>{
 assert.equal(resolvePublishInstant({local_date:'2026-02-30',local_clock:'10:00',time_zone:'UTC'}).status,'invalid');
 assert.equal(resolvePublishInstant({local_date:'2026-10-24',local_clock:'10:00',time_zone:'Atlantis/Midnight'}).status,'invalid');
});
const observation=()=>({channel_id:'synthetic-channel',format:'long_form',metric_id:'first_24h_views',
view_definition:'public_play_starts_post_2026_08_24',reporting_window_hours:24,country_scope:'all_reported',owner_authorized:true,
value:50,publish_utc:'2026-10-24T18:00:00.000Z',geo_rows_suppressed:false});
test('Comparable report observations are still not causal evidence',()=>{
 const result=auditTimingStudyComparison(observation(),{...observation(),value:65});
 assert.equal(result.descriptively_comparable,true);
 assert.equal(result.causal_effect_established,false);
});
test('Missing owner authorization, differing formats, or suppressed geography block comparison',()=>{
 for(const change of [{owner_authorized:false},{format:'shorts'},{geo_rows_suppressed:true},{value:null}]){
  assert.equal(auditTimingStudyComparison(observation(),{...observation(),...change}).descriptively_comparable,false);
 }
});
