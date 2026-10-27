import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Release QA distinguishes artifact upload, OS trust checks and observed game launches',()=>{
 const a=get('ontology/itch-io/windows-macos-release-security-qa-2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 const sources=new Set(s.evidence.map(e=>e.id));
 assert(a.source_ids.every(id=>sources.has(id)));
 assert.deepEqual(a.targets.map(x=>x.id),['windows_downloadable','macos_downloadable','linux_downloadable','html5_browser']);
 for(const t of a.targets){assert(t.store_source_ids.every(id=>sources.has(id)));assert(t.os_source_ids.every(id=>sources.has(id)));assert.equal(t.observed_success,null);}
 assert.equal(a.security_reputation.windows.EV_certificate_auto_bypass,false);
 assert.equal(a.security_reputation.macos.Apple_app_review_equivalent,false);
 assert.equal(a.resource_gate.user_has_not_been_asked_to_buy_or_test_hardware,true);
 assert.equal(a.resource_gate.target_platform_qa_person_hours,null);
 const det=p.detail_tasks.find(x=>x.id==='itch-io/special-games/plan-windows-and-macos-release-qa');
 const fmt=p.detail_tasks.find(x=>x.id==='itch-io/special-games/map-build-formats');
 assert.equal(det.percent,100);assert.equal(det.status,'complete');
 assert.equal(fmt.percent,100);assert.equal(fmt.status,'complete');
 const base=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='special-games/special-1');assert.equal(base.progress,100);
 for(const row of [det,fmt,base])for(const f of ['ontology/itch-io/windows-macos-release-security-qa-2026.json','ontology/itch-io/windows-macos-release-security-qa-2026.md','tests/itch-windows-macos-release-security-qa.test.mjs'])assert(row.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
