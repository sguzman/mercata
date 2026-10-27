import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Currency tax merchant-of-record and bank settlement modes are separated',()=>{
 const d=load('ontology/itch-io/merchant-tax-fx-cash-waterfall-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.direct.merchant_of_record,'publisher');
 assert.equal(d.collected.merchant_of_record,'itch.io');
 assert.equal(d.direct.VAT_remitter,'publisher');assert.equal(d.collected.VAT_remitter,'itch.io');
 assert.equal(d.collected.checkout_currency,'USD');
 assert.equal(d.collected.foreign_seller_default_withholding_percent_without_valid_tax_ID,30);
 assert.equal(d.collected.actual_foreign_seller_withholding_rate,null);
 assert.equal(d.example_only.before_other_deductions_usd,8.41);
 assert.equal(d.example_only.available_cash_after_withholding_and_merchant_FX,null);
 assert.equal(d.direct.stripe_published_country_currency_examples.length,4);
 assert.equal(d.geographic_cases.find(x=>x.country==='Mexico').approved_real_account,null);
 assert.equal(d.direct.not_listed_mexico_stripe_direct_is_verified_unsupported,false);
 assert(Object.values(d.unknown).every(x=>x===null));
 for(const id of ['economics/tax','economics/payout','economics/processing']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const path of ['ontology/itch-io/merchant-tax-fx-cash-waterfall-2026.json','ontology/itch-io/merchant-tax-fx-cash-waterfall-2026.md','tests/itch-merchant-tax-fx-waterfall.test.mjs'])assert(t.evidence.includes(path));
 }
 for(const id of ['itch-io/economics/track-indirect-and-sales-taxes','itch-io/economics/measure-fx-and-withdrawal-costs','itch-io/economics/map-direct-versus-collected-money']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const path of ['ontology/itch-io/merchant-tax-fx-cash-waterfall-2026.json','ontology/itch-io/merchant-tax-fx-cash-waterfall-2026.md','tests/itch-merchant-tax-fx-waterfall.test.mjs'])assert(t.evidence.includes(path));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
