import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Documented payment risks, TOTP and buyer privacy are distinct from actual account incidents',()=>{
 const r=read('ontology/itch-io/merchant-payment-security-and-cash-exposure-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(e=>e.id));assert(r.source_ids.every(id=>sources.has(id)));
 assert.equal(r.merchant_modes[0].seller_is_merchant_of_record,true);
 assert.equal(r.merchant_modes[1].operator_is_merchant_of_record,true);
 assert.equal(r.collected_mode_guards.possible_chargeback_account_adjustment,true);
 assert.equal(r.collected_mode_guards.available_balance_min_usd,5);
 assert.deepEqual(r.collected_mode_guards.staff_review_typical_days_range,[10,14]);
 assert(r.financial_events.some(e=>e.id==='refund_after_payout'));
 assert(r.financial_events.every(e=>e.known_population_count===null));
 assert.equal(r.security.totp_available,true);
 assert.equal(r.security.totp_code_rotation_seconds,30);
 assert.equal(r.security.recovery_codes_digits,8);
 assert.equal(r.security.sms_2fa_offered,false);
 assert.equal(r.privacy_rules.publisher_may_publish_buyer_emails,false);
 assert.equal(r.privacy_rules.mailing_list_opt_in_required,true);
 assert.equal(r.downside_register.experiment_live,false);
 for(const id of ['risk/fraud','risk/privacy','risk/resilience']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/merchant-payment-security-and-cash-exposure-2026.json','ontology/itch-io/merchant-payment-security-and-cash-exposure-2026.md','tests/itch-merchant-payment-security-and-cash-exposure.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/risk/map-payment-dependency','itch-io/risk/assess-chargeback-impact','itch-io/risk/audit-account-security']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/merchant-payment-security-and-cash-exposure-2026.json','ontology/itch-io/merchant-payment-security-and-cash-exposure-2026.md','tests/itch-merchant-payment-security-and-cash-exposure.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.detail_tasks.find(x=>x.id==='itch-io/risk/set-downside-limits').percent,90);
 assert.equal(q.queues.flatMap(x=>x.tasks).find(x=>x.id==='risk/dependence').progress,94);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
