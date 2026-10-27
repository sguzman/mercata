import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Country payout matrix keeps platform integration distinct from processor support',()=>{
 const a=get('ontology/itch-io/seller-jurisdiction-onboarding-matrix-oct2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(a.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(a.jurisdictions.map(x=>x.country),['United States','Canada','Ireland','United Kingdom','Mexico']);
 assert.equal(a.jurisdictions[4].direct_stripe_itch_documented,false);
 assert.equal(a.jurisdictions[4].stripe_country_available_general,true);
 assert.equal(a.jurisdictions[4].mexico_itcho_direct_stripe_integration_eligibility,null);
 assert(a.jurisdictions.every(x=>x.guaranteed_individual_merchant_approval===false));
 assert.equal(a.merchant_modes.collected_by_itch.min_available_balance_usd,5);
 assert.equal(a.merchant_modes.collected_by_itch.transaction_wait_days_standard,7);
 assert.equal(a.merchant_modes.collected_by_itch.payouts_in_progress_max,3);
 assert(Object.values(a.unknown).every(x=>x===null));
 for(const t of [q.queues.flatMap(g=>g.tasks).find(t=>t.id==='access/country'),p.detail_tasks.find(t=>t.id==='itch-io/access/map-seller-countries')]){
  assert.equal(t.status,'complete');assert.equal(t.progress??t.percent,100);
  for(const f of ['ontology/itch-io/seller-jurisdiction-onboarding-matrix-oct2026.json','ontology/itch-io/seller-jurisdiction-onboarding-matrix-oct2026.md','tests/itch-seller-jurisdiction-matrix.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);
});
