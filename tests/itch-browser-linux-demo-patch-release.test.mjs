import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('HTML5/Linux release, demo rights, and patch rules do not fabricate measured testing or purchases',()=>{
 const r=get('ontology/itch-io/browser-linux-demo-patch-release-2026.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json'),s=get('specimens/itch-io.json');
 const sources=new Set(s.evidence.map(e=>e.id));
 assert(r.source_ids.every(x=>sources.has(x)));
 assert.equal(r.html5.max_extracted_file_count,1000);
 assert.equal(r.html5.max_extracted_bytes,500000000);
 assert.equal(r.html5.mobile_launch_forced_fullscreen,true);
 assert.equal(r.html5.donation_only_in_native_HTML5_embed,true);
 assert(r.html5.checks.every(x=>x.observation===null));
 assert.equal(r.linux.actual_game_tested,false);
 assert(r.linux.tests.every(x=>x.passed===null));
 assert(r.linux.avoid_bundling.includes('glibc'));
 assert.equal(r.demo_paid_entitlements.key_may_be_manually_given_without_money,true);
 assert(r.demo_paid_entitlements.validation_checks.every(x=>x.result===null));
 assert.equal(r.patching.same_channel_push_replaces_channel_build,true);
 assert.equal(r.patching.rollback_automatic_guarantee,false);
 assert.equal(r.patching.actual_channel_pushed,false);
 assert(Object.values(r.economics).every(x=>x===null));
 const expected={
  'itch-io/special-games/plan-browser-compatibility-testing':100,
  'itch-io/special-games/plan-linux-compatibility-testing':100,
  'itch-io/special-games/distinguish-demo-and-paid-full-game':100,
  'itch-io/special-games/map-patch-delivery':100,
  'itch-io/special-games/study-drm-and-offline-play':100
 };
 for(const [id,value] of Object.entries(expected)){const t=p.detail_tasks.find(x=>x.id===id);assert(t,id);assert.equal(t.percent,value,id);assert.equal(t.status,'complete',id);for(const path of ['ontology/itch-io/browser-linux-demo-patch-release-2026.json','ontology/itch-io/browser-linux-demo-patch-release-2026.md','tests/itch-browser-linux-demo-patch-release.test.mjs'])assert(t.evidence.includes(path));}
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
