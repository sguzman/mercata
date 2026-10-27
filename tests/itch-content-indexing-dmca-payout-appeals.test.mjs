import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Copyright counters, geo appeals, search-index reviews and payouts remain distinct remedies',()=>{
 const r=read('ontology/itch-io/content-indexing-dmca-payout-appeals-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(r.source_ids.every(id=>ids.has(id)));
 assert.equal(r.restrictions.length,6);
 for(const x of r.restrictions)assert(x.source_ids.every(id=>ids.has(id))&&x.automatic_appeal_success===null);
 assert.equal(r.dmca_terms.potential_replacement_business_days_low,10);
 assert.equal(r.dmca_terms.potential_replacement_business_days_high,14);
 assert.equal(r.dmca_terms.replacement_guaranteed,false);
 assert.deepEqual(r.timing_boundaries.DMCA_counter_notice_potential_replacement_business_days,[10,14]);
 assert.equal(r.financial_exposure.real_held_cash,null);
 assert(Object.values(r.unmeasured).every(v=>v===null));
 for(const id of ['rights/appeal','risk/suspension']){
  const t=q.queues.flatMap(g=>g.tasks).find(x=>x.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/content-indexing-dmca-payout-appeals-2026.json','ontology/itch-io/content-indexing-dmca-payout-appeals-2026.md','tests/itch-content-indexing-dmca-payout-appeals.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/rights/review-takedowns-and-appeals','itch-io/risk/study-review-and-account-holds']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/content-indexing-dmca-payout-appeals-2026.json','ontology/itch-io/content-indexing-dmca-payout-appeals-2026.md','tests/itch-content-indexing-dmca-payout-appeals.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(g=>g.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
