import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modelGameBreakEven} from '../site/itch-break-even.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Low-price games with nonpositive contribution never get finite break-even orders',()=>{
 const d=load('ontology/itch-io/low-price-game-unit-break-even-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(x=>ids.has(x)));
 assert.equal(d.assumptions.these_are_operator_guaranteed_fee_rates,false);
 assert.equal(d.output_rows.length,7);
 for(const row of d.output_rows){
  const r=modelGameBreakEven({priceUsd:row.price_usd,itchShareRate:d.assumptions.revenue_share_rate,processorPercentRate:d.assumptions.processor_rate,processorFixedUsd:d.assumptions.processor_fixed_usd,cashDevelopmentCostsUsd:d.assumptions.cash_development_costs_usd,valuedLaborHours:d.assumptions.valued_labor_hours,valuedLaborHourlyUsd:d.assumptions.valued_labor_per_hour_usd,additionalFixedCashCostsUsd:0,targetPretaxSurplusUsd:d.assumptions.target_pretax_surplus_usd});
  assert.equal(r.preTaxContributionPerSuccessfulSaleUsd,row.per_settled_sale_contribution_usd);
  assert.equal(r.platformFeePerSaleUsd,row.platform_share_usd);
  assert.equal(r.processingPerSaleUsd,row.processing_fee_usd);
  assert.equal(r.cashBreakEvenPaidOrders,row.cash_cost_break_even_paid_orders);
  assert.equal(r.fullCostBreakEvenPaidOrders,row.valued_labor_break_even_paid_orders);
  assert.equal(r.paidOrdersForTargetPretaxSurplus,row.target_surplus_paid_orders);
  assert.equal(row.real_conversion_probability,null);
 }
 assert.equal(d.output_rows[0].valued_labor_break_even_paid_orders,null);
 assert.equal(d.output_rows[1].target_surplus_paid_orders,null);
 assert.equal(d.output_rows.at(-1).target_surplus_paid_orders,119);
 assert(Object.values(d.unobserved).every(x=>x===null));
 for(const id of ['economics/unit','economics/fees']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/low-price-game-unit-break-even-2026.json','ontology/itch-io/low-price-game-unit-break-even-2026.md','tests/itch-low-price-game-unit-break-even.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/economics/model-low-priced-game-units','itch-io/economics/build-break-even-model','itch-io/economics/verify-payment-processing']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/low-price-game-unit-break-even-2026.json','ontology/itch-io/low-price-game-unit-break-even-2026.md','tests/itch-low-price-game-unit-break-even.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
