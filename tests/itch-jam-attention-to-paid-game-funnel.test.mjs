import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Conflicting public jam submission counts and real paid game events stay distinct',()=>{
 const d=read('ontology/itch-io/jam-attention-to-paid-game-funnel-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(d.source_ids.every(id=>ids.has(id)));
 for(const row of d.observations)assert(row.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(d.conflicting_submissions_counts,[482,486,495]);
 assert.equal(d.single_reconciled_submission_count,null);
 assert.equal(d.rating_events,10642);
 assert.equal(d.comparability.cannot_calculate_true_entry_rating_coverage_from_mixed_snapshots,true);
 assert.equal(d.mechanisms.filter(x=>x.established_paid_purchase).length,1);
 assert.equal(d.future_authorized_funnel.length,7);
 assert(d.future_authorized_funnel.every(x=>x.actual_count===null));
 assert(Object.values(d.unknown).every(x=>x===null));
 for(const id of ['discovery/funnel','discovery/seasonal']){
  const t=q.queues.flatMap(g=>g.tasks).find(t=>t.id===id);
  assert(t.evidence.includes('ontology/itch-io/jam-attention-to-paid-game-funnel-2026.json'));assert(t.progress>=90);
 }
 for(const id of ['itch-io/discovery/study-game-jam-visibility','itch-io/discovery/distinguish-plays-from-customer-acquisition','itch-io/special-games/model-jam-to-paid-trajectory']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const path of ['ontology/itch-io/jam-attention-to-paid-game-funnel-2026.json','ontology/itch-io/jam-attention-to-paid-game-funnel-2026.md','tests/itch-jam-attention-to-paid-game-funnel.test.mjs'])assert(t.evidence.includes(path));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(g=>g.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
