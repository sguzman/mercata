import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Review schedule has grounded future dates and event triggers without claiming monitoring',()=>{
 const d=get('ontology/itch-io/policy-payment-research-review-calendar-2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.review_calendar.length,5);
 for(const row of d.review_calendar){
  assert(row.proposed_review_date>'2026-10-27');
  assert(row.source_ids.every(id=>ids.has(id)));
  assert(typeof row.event_trigger==='string'&&row.event_trigger.length>12);
  assert.equal(row.rechecked,false);assert.equal(row.outcomes_observed,null);
 }
 assert.equal(d.mechanism.scheduled_automation_created,false);
 assert.equal(d.mechanism.monitoring_active,false);
 assert(Object.values(d.unknown).every(x=>x===null));
 const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='review/refresh');assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const path of ['ontology/itch-io/policy-payment-research-review-calendar-2026.json','ontology/itch-io/policy-payment-research-review-calendar-2026.md','tests/itch-policy-payment-research-review-calendar.test.mjs'])assert(t.evidence.includes(path));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
