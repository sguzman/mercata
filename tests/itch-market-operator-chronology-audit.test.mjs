import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical operator and economics chronology dates and acquisitions are evidence bounded',()=>{
 const a=read('ontology/itch-io/operator-chronology-and-acquisition-verification-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(a.dated_events.map(e=>e.date),['2013-03-13','2015-01-19','2015-03-04','2018-02-21','2026-03-26','2026-07-02']);
 assert.equal(a.dated_events[2].effective_date,'2015-03-23');
 assert.equal(a.operator_crosscheck.contractual_operator,'Itch Corp.');
 assert.equal(a.acquisition_audit.none_ever_occurred_verified,null);
 assert.equal(a.acquisition_audit.current_beneficial_ownership_verified,null);
 assert.equal(a.acquisition_audit.no_claim_of_publicly_proven_no_acquisition,true);
 assert(Object.values(a.unresolved).every(v=>v===null));
 const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id==='identity/history');
 assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/operator-chronology-and-acquisition-verification-2026.json','ontology/itch-io/operator-chronology-and-acquisition-verification-2026.md','tests/itch-market-operator-chronology-audit.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
