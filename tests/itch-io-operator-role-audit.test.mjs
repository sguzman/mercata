import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Itch operator and merchant roles remain distinct with official attribution and no invented sales',()=>{
 const x=load('ontology/itch-io/operator-legal-identity-and-roles-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const sources=new Set(s.evidence.map(e=>e.id));
 assert.equal(x.operator.name,'Itch Corp.');
 assert.equal(x.founding.year,2013);
 assert(x.source_ids.every(id=>sources.has(id)));
 for(const part of x.functional_roles)assert(part.source_ids.length&&part.source_ids.every(id=>sources.has(id)));
 assert.deepEqual(new Set(x.functional_roles.map(x=>x.function)),new Set(['publication','hosting','discovery','purchase','delivery','contracting']));
 assert.deepEqual(x.merchant_of_record_by_mode.map(x=>x.merchant_of_record),['seller','itch.io']);
 assert.equal(x.boundaries.live_checkout_verified,false);
 for(const k of ['actual_purchaser_population','platform_revenue','active_paid_sellers'])assert.equal(x.boundaries[k],null);
 for(const id of ['identity/operator','identity/roles']){
  const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);assert(t);
  assert.equal(t.progress,100);assert.equal(t.status,'complete');
  for(const file of ['ontology/itch-io/operator-legal-identity-and-roles-2026.json','ontology/itch-io/operator-legal-identity-and-roles-2026.md','tests/itch-io-operator-role-audit.test.mjs'])assert(t.evidence.includes(file));
 }
 const dt=p.detail_tasks.find(x=>x.id==='itch-io/identity/differentiate-store-roles');assert(dt);
 assert.equal(dt.percent,100);assert.equal(dt.status,'complete');
 for(const file of ['ontology/itch-io/operator-legal-identity-and-roles-2026.json','ontology/itch-io/operator-legal-identity-and-roles-2026.md','tests/itch-io-operator-role-audit.test.mjs'])assert(dt.evidence.includes(file));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 for(const id of ['itch-legal-operator-2026','itch-founder-distinct-operator-2026','itch-merchant-mode-not-operator-identity'])assert(s.claims.some(x=>x.id===id));
});
