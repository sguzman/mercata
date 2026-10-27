import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('es-419 localization pilot is a measurement plan, not invented translated orders',()=>{
 const a=load('ontology/itch-io/es419-localization-measurement-plan-2026.json'),s=load('specimens/itch-io.json'),p=load('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(a.source_ids.every(id=>ids.has(id)));
 assert.equal(a.target_locale,'es-419');assert.equal(a.prior_public_filter.observed_listings,174);
 assert.equal(a.prior_public_filter.paid_orders,null);
 assert.equal(a.translation_worklog_contract.actual_measured_minutes,null);
 assert.equal(a.translation_worklog_contract.translations_completed,false);
 assert.equal(a.experimental_control.causal_conversion_claim_allowed,false);
 assert.equal(a.acceptance.commercial_experiment_executed,false);
 assert.equal(a.acceptance.causal_paid_conversion_lift,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/strategy/plan-localization-pilot');assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/es419-localization-measurement-plan-2026.json','ontology/itch-io/es419-localization-measurement-plan-2026.md','tests/itch-es419-localization-plan.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});
