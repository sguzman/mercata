import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First publisher entry separates free page publication, merchant eligibility and labor costs',()=>{
 const r=read('ontology/itch-io/first-publisher-entry-and-zero-cash-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(r.source_ids.every(id=>ids.has(id)));
 assert.equal(r.eligibility.account_signup_platform_fee_usd,0);
 assert.equal(r.eligibility.publisher_age_minimum_if_no_authorized_parental_guardian_consent_years,18);
 assert.equal(r.free_game_steps.length,6);
 for(const step of r.free_game_steps)assert(step.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(r.commercial_gate_by_mode.map(x=>x.merchant_of_record),['seller','itch_io']);
 assert.equal(r.collected_payout.one_time_tax_identity_account_adjustment_usd,3);
 assert.equal(r.collected_payout.not_separate_upfront_listing_fee,true);
 assert.equal(r.indexing.public_page_is_search_indexed_automatically,false);
 assert.equal(r.hypothetical_zero_new_cash_scenario.cash_listing_charge_usd,0);
 assert.equal(r.hypothetical_zero_new_cash_scenario.game_labour_hours_actual,null);
 assert.equal(r.hypothetical_zero_new_cash_scenario.real_game_published,false);
 assert(r.minimum_effort_register.every(x=>x.actual===null));
 assert(Object.values(r.missing_market_data).every(v=>v===null));
 const base=q.queues.flatMap(g=>g.tasks);
 for(const id of ['access/signup','access/requirements','access/gates']){
  const x=base.find(x=>x.id===id);assert.equal(x.progress,100,id);assert.equal(x.status,'complete',id);
  for(const file of ['ontology/itch-io/first-publisher-entry-and-zero-cash-2026.json','ontology/itch-io/first-publisher-entry-and-zero-cash-2026.md','tests/itch-first-publisher-entry-zero-cash.test.mjs'])assert(x.evidence.includes(file));
 }
 for(const id of ['itch-io/access/map-account-onboarding','itch-io/access/create-zero-cash-entry-scenario']){
  const x=p.detail_tasks.find(x=>x.id===id);assert.equal(x.percent,100,id);assert.equal(x.status,'complete',id);
  for(const file of ['ontology/itch-io/first-publisher-entry-and-zero-cash-2026.json','ontology/itch-io/first-publisher-entry-and-zero-cash-2026.md','tests/itch-first-publisher-entry-zero-cash.test.mjs'])assert(x.evidence.includes(file));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((base.reduce((a,x)=>a+x.progress,0)+p.detail_tasks.reduce((a,x)=>a+x.percent,0))/244));
});
