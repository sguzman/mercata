import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Access-delay acceptance uses published payout hold and review rules, not a promised first payout time',()=>{
 const rules=read('ontology/itch-io/commercial-rules-2026.json');
 const dossier=read('specimens/itch-io.json');
 const q=read('queues/itch-io.json');
 const plan=read('plans/itch-io.json');
 const x=rules.collected_payout_conditions;
 assert(x.source_ids.includes('itch-payments'));
 assert(dossier.evidence.some(s=>s.id==='itch-payments'&&s.evidence_class==='official'));
 assert.equal(x.transaction_wait_days,7);
 assert.equal(x.payout_review_minimum_days,7);
 assert.equal(x.typical_review_days_low,10);
 assert.equal(x.typical_review_days_high,14);
 assert.equal(x.minimum_available_usd,5);
 assert.equal(x.extended_wait_possible,true);
 assert.equal(x.universal_first_payment_date,null);
 assert.equal(rules.payment_modes.find(m=>m.id==='direct').payout_request_required,false);
 assert.equal(rules.payment_modes.find(m=>m.id==='collected').payout_request_required,true);
 const timeClaims=['payout-review','payout-cash-wait-compound'];
 for(const id of timeClaims){
  const c=dossier.claims.find(x=>x.id===id);assert(c);assert(c.source_ids.includes('itch-payments'));assert(c.limitations.length>15);
 }
 const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='access/delay');
 assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const path of ['ontology/itch-io/commercial-rules-2026.json','ontology/itch-io/commercial-rules-2026.md','specimens/itch-io.json','tests/itch-io-access-delay-acceptance.test.mjs'])assert(t.evidence.includes(path));
 assert.equal(plan.total_tracked_tasks,244);
 assert.equal(plan.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,x)=>a+x.progress,0)+plan.detail_tasks.reduce((a,x)=>a+x.percent,0))/244));
});
