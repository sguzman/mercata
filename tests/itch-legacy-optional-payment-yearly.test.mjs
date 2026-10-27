import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical year-labeled payment events mismatch both lifetime counts while rounded gross almost matches',()=>{
 const x=read('ontology/itch-io/legacy-optional-payment-yearly-reconciliation-2015-2019.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.deepEqual(x.years.map(y=>y.reported_payment_events),[10,139,356,361,301]);
 assert.deepEqual(x.years.map(y=>y.reported_rounded_gross_usd),[34,139,2306,3016,1782]);
 assert.equal(x.years.reduce((s,y)=>s+y.reported_payment_events,0),1167);
 assert.equal(x.reconciliation.annual_sum_minus_first_report,95);
 assert.equal(x.reconciliation.annual_sum_minus_later_report,94);
 assert.equal(x.reconciliation.year_rounded_gross_total_usd,7277);
 assert.equal(x.reconciliation.rounded_sum_minus_precise_usd,0.3);
 assert.equal(x.reconciliation.year_event_totals_reconciled,false);
});
test('One historical PWYW creator never supplies representative market volatility',()=>{
 const x=read('ontology/itch-io/legacy-optional-payment-yearly-reconciliation-2015-2019.json'),p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(x.partial_time_coverage.first_and_last_years_not_full_twelve_months,true);
 assert.equal(x.comparability.free_optional_payments_not_mandatory_paid_units,true);
 assert.equal(x.comparability.causal_publicity_or_seasonality_measured,false);
 assert(Object.values(x.unknown).every(v=>v===null));
 assert.equal(p.total_tracked_tasks,244);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/risk/study-sales-volatility');
 assert(t.percent>=88&&t.percent<=100);
 for(const path of ['ontology/itch-io/legacy-optional-payment-yearly-reconciliation-2015-2019.json','ontology/itch-io/legacy-optional-payment-yearly-reconciliation-2015-2019.md','tests/itch-legacy-optional-payment-yearly.test.mjs'])assert(t.evidence.includes(path));
});
