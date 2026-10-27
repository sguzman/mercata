import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First-game decision keeps paid units and owner gates explicit',()=>{
 const d=load('ontology/itch-io/first-game-commercial-decision-2026.json'),s=load('specimens/itch-io.json'),p=load('plans/itch-io.json'),q=load('queues/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));
 assert(d.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(d.offers.map(x=>x.id),['html5_free_donation','premium_download','demo_plus_premium']);
 assert.equal(d.hypothetical_game.example_10_usd_gross_after_platform_and_processor_before_other_costs,8.41);
 assert.equal(d.hypothetical_game.profit_probability,null);
 assert.equal(d.go_no_go.find(x=>x.id==='authorization').pass,false);
 assert.equal(d.stop_conditions.no_auto_spending,true);
 assert.equal(d.retrospective.include_zero_sale_games,true);
 assert.deepEqual(d.retrospective.days,[30,90,365]);
 assert(Object.values(d.unobserved).every(v=>v===null));
 for(const id of ['strategy/comparison','strategy/scenarios','strategy/decision']){
  const x=q.queues.flatMap(y=>y.tasks).find(t=>t.id===id);assert.equal(x.progress,100,id);assert.equal(x.status,'complete',id);
  for(const f of ['ontology/itch-io/first-game-commercial-decision-2026.json','ontology/itch-io/first-game-commercial-decision-2026.md','tests/itch-first-game-commercial-decision.test.mjs'])assert(x.evidence.includes(f));
 }
 for(const id of ['itch-io/strategy/plan-first-game-commercial-pilot','itch-io/strategy/compare-free-donation-and-premium-hypotheses','itch-io/strategy/define-retrospective-reporting']){
  const x=p.detail_tasks.find(t=>t.id===id);assert.equal(x.percent,100,id);assert.equal(x.status,'complete',id);
  for(const f of ['ontology/itch-io/first-game-commercial-decision-2026.json','ontology/itch-io/first-game-commercial-decision-2026.md','tests/itch-first-game-commercial-decision.test.mjs'])assert(x.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});
