import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Product categories, content gates, feedback and portability follow official sources without sales inferences',()=>{
 const a=read('ontology/itch-io/project-categories-reputation-portability-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(a.source_ids.every(id=>ids.has(id)));
 for(const collection of [a.project_classes,a.commercial_units,a.content_gates,a.reputation_and_moderation,a.portability])for(const row of collection)assert(row.source_ids.every(id=>ids.has(id)));
 assert(a.project_classes.some(x=>x.id==='video_games'&&x.game_population_candidate===true));
 assert(a.project_classes.some(x=>x.id==='comics_and_books'&&x.game_population_candidate===false));
 assert(a.content_gates.some(x=>x.id==='adult_tagging'));
 assert(a.reputation_and_moderation.some(x=>x.id==='rating_portability'));
 assert(a.portability.some(x=>x.id==='buyer_emails'&&x.actual_export_tested===false));
 assert(Object.values(a.unknown).every(x=>x===null));
 for(const id of ['identity/goods','competition/switching','rights/moderation','rights/export','sales/reputation']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);
  assert(t,id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const path of ['ontology/itch-io/project-categories-reputation-portability-2026.json','ontology/itch-io/project-categories-reputation-portability-2026.md','tests/itch-project-categories-reputation-portability.test.mjs','specimens/itch-io.json'])assert(t.evidence.includes(path),id+': '+path);
 }
 const dt=p.detail_tasks.find(x=>x.id==='itch-io/identity/define-product-populations');
 assert.equal(dt.percent,100);assert.equal(dt.status,'complete');
 const dg=p.detail_tasks.find(x=>x.id==='itch-io/rights/study-game-content-restrictions');
 assert.equal(dg.percent,100);assert.equal(dg.status,'complete');
 assert(dg.evidence.includes('ontology/itch-io/content-monetization-regional-policy-gates-2026.json'));
 assert(dg.evidence.includes('tests/itch-content-monetization-regional-policy-gates.test.mjs'));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
