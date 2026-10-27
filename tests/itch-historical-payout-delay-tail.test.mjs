import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical payout delay anecdotes preserve June forum resolution and no false current delay rate',()=>{
 const r=get('ontology/itch-io/historical-payout-delay-tail-2025-2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(r.source_ids.every(id=>ids.has(id)));
 assert.equal(r.documented_guidance.typical_review_days_high,14);
 assert.equal(r.documented_guidance.guaranteed_bank_arrival_days,null);
 const forum=r.reported_selected_cases.find(x=>x.id==='june_forum_over100days');
 assert(forum.self_reported_elapsed_days_lower_bound_exclusive>=100);
 assert.equal(forum.all_thread_cases_admin_reported_resolved,true);
 assert.equal(forum.exact_receipt_day,null);
 assert.equal(r.reported_selected_cases.find(x=>x.id==='completed25days_sep').self_reported_elapsed_days,25);
 assert.deepEqual(r.sensitivity.hypothetical_buffer_days,[14,30,100]);
 assert.equal(r.sensitivity.probability_of_over100days,null);
 assert(Object.values(r.current_quantitative_unknowns).every(x=>x===null));
 for(const id of ['risk/dependence','economics/history']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/historical-payout-delay-tail-2025-2026.json','ontology/itch-io/historical-payout-delay-tail-2025-2026.md','tests/itch-historical-payout-delay-tail.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
