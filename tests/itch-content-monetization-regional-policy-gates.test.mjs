import test from 'node:test';
import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Content eligibility, marketplace visibility, payment acceptance and buyer geography remain distinct',()=>{
 const d=load('ontology/itch-io/content-monetization-regional-policy-gates-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(id=>sources.has(id)));
 for(const x of [...d.rules,...d.enforcement_channels])assert(x.source_ids.every(id=>sources.has(id)));
 assert.equal(d.enforcement_channels.length,4);
 assert.equal(d.historical_case.operator_notice_date,'2025-07-27');
 assert.equal(d.historical_case.current_october_2026_enforcement_status_independently_verified,null);
 assert.equal(d.severity.does_not_imply_every_moderation_event_irreversible,true);
 assert(Object.values(d.unknown).every(x=>x===null));
 const a=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='risk/geo');
 const b=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='risk/change');
 assert.equal(a.progress,100);assert.equal(b.progress,100);
 for(const id of ['itch-io/access/audit-prohibited-content','itch-io/rights/study-game-content-restrictions']){
  const x=p.detail_tasks.find(x=>x.id===id);assert.equal(x.percent,100,id);assert.equal(x.status,'complete',id);
  assert(x.evidence.includes('ontology/itch-io/content-monetization-regional-policy-gates-2026.json'));
 }
 assert.equal(q.queues.flatMap(x=>x.tasks).find(x=>x.id==='access/country').progress,90);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});
