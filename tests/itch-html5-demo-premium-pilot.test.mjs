import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('HTML5 free browser demo and paid downloadable game are separate offers with unknown experiment outcomes',()=>{
 const a=read('ontology/itch-io/html5-demo-premium-pilot-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(id=>sources.has(id)));
 assert.equal(a.implementation.automatic_cross_project_purchase_link,false);
 assert.equal(a.effort_examples[0].person_hours,null);
 assert.equal(a.effort_examples[1].reported_solo_person_hours_approx,140);
 assert.equal(a.effort_examples[2].total_team_person_hours,null);
 assert.equal(a.effort_measurement.actual_demo_build_hours,null);
 assert.equal(a.funnel.demo_play_is_order,false);
 assert.equal(a.funnel.actual_paid_order_lift,null);
 assert.equal(a.state.authorization_received,false);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/strategy/plan-html5-demo-experiment');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/html5-demo-premium-pilot-2026.json','ontology/itch-io/html5-demo-premium-pilot-2026.md','tests/itch-html5-demo-premium-pilot.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
