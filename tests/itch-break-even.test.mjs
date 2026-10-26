import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modelGameBreakEven} from '../site/itch-break-even.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const input={priceUsd:10,itchShareRate:0.1,processorPercentRate:0.029,processorFixedUsd:0.3,
 cashDevelopmentCostsUsd:100,valuedLaborHours:20,valuedLaborHourlyUsd:20,
 additionalFixedCashCostsUsd:0,targetPretaxSurplusUsd:500};
test('Break-even excludes observed earnings and requires explicit input',()=>{
 const r=modelGameBreakEven(input);
 assert.equal(r.preTaxContributionPerSuccessfulSaleUsd,8.41);
 assert.equal(r.cashBreakEvenPaidOrders,12);
 assert.equal(r.fullCostBreakEvenPaidOrders,60);
 assert.equal(r.paidOrdersForTargetPretaxSurplus,119);
 assert.equal(r.empiricalDemandSupport,false);
 for(const k of ['revenueForecast','conversionRate','salesProbability','refundRate','taxLiability','merchantPayoutFees'])assert.equal(r[k],null);
 for(const field of Object.keys(input))assert.throws(()=>modelGameBreakEven({...input,[field]:null}),field);
 assert.throws(()=>modelGameBreakEven({...input,itchShareRate:1.2}));
 assert.throws(()=>modelGameBreakEven({...input,priceUsd:-4}));
});
test('Nonpositive contribution cannot imply attainable commercial break-even',()=>{
 const r=modelGameBreakEven({...input,priceUsd:0.25});
 assert(r.preTaxContributionPerSuccessfulSaleUsd<=0);
 assert.equal(r.cashBreakEvenPaidOrders,null);
 assert.equal(r.fullCostBreakEvenPaidOrders,null);
 assert.equal(r.paidOrdersForTargetPretaxSurplus,null);
});
test('Scenario file records only declared mathematical inputs',()=>{
 const d=read('ontology/itch-io/break-even-scenarios-2026.json');
 assert.equal(d.kind,'hypothetical_pretax_break_even_worksheet');
 assert.deepEqual(d.input_scenarios.map(s=>s.priceUsd),[2,5,10,20]);
 assert.equal(d.source_guarantees_specific_fee_rates,false);
 assert(Object.values(d.unobserved).every(v=>v===null));
});
