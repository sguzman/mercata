import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateIncomeScenario} from '../site/scenario.mjs';

const example={currency:'USD',watch_views:1000,watch_ad_only_rpm:2,shorts_engaged_views:2000,shorts_ad_only_rpm:1,net_other_receipts:5,cash_costs:6,labor_hours:3};
test('Scenario calculator computes user inputs without assuming a platform RPM',()=>{
  const result=evaluateIncomeScenario(example);
  assert.equal(result.watch_ad_receipts,2);
  assert.equal(result.shorts_ad_receipts,2);
  assert.equal(result.net_receipts,9);
  assert.equal(result.cash_profit_before_tax,3);
  assert.equal(result.cash_profit_per_hour,1);
  assert.equal(result.actual_earnings,null);
});
test('Scenario calculator refuses omitted, negative and undefined inputs',()=>{
  for(const key of Object.keys(example)){
    const missing={...example};delete missing[key];
    assert.throws(()=>evaluateIncomeScenario(missing));
  }
  assert.throws(()=>evaluateIncomeScenario({...example,watch_views:-1}));
  assert.throws(()=>evaluateIncomeScenario({...example,labor_hours:0}));
  assert.throws(()=>evaluateIncomeScenario({...example,watch_views:1.5}));
  assert.throws(()=>evaluateIncomeScenario({...example,net_other_receipts:Infinity}));
});
test('Scenario calculator distinguishes genuine negative profit and zero revenue',()=>{
  const p=evaluateIncomeScenario({...example,watch_views:0,shorts_engaged_views:0,net_other_receipts:0});
  assert.equal(p.cash_profit_before_tax,-6);
  assert.equal(p.cash_profit_per_hour,-2);
  assert.equal(p.kind,'hypothetical_user_inputs');
});

import {evaluateBreakEvenScenario} from '../site/scenario.mjs';
const breakEvenSynthetic={currency:'USD',gross_order_price:10,refund_probability:0.1,processor_rate:0.05,processor_fixed_fee:0.5,refund_extra_cost:1,variable_nonpayment_cost:2,fixed_cash_cost:100,creator_hours:10,target_hourly_compensation:5};
test('User-entered synthetic order scenarios include fees, refunds, and labor',()=>{
 const x=evaluateBreakEvenScenario(breakEvenSynthetic);
 assert.equal(x.contribution_per_attempted_order,5.9);
 assert.equal(x.cash_break_even_orders,17);
 assert.equal(x.labor_compensated_break_even_orders,26);
 assert.equal(x.actual_creator_earnings,null);
});
test('Negative contribution makes nonzero break even unattainable',()=>{
 const x=evaluateBreakEvenScenario({...breakEvenSynthetic,variable_nonpayment_cost:12});
 assert.equal(x.cash_break_even_orders,null);
 assert.equal(x.labor_compensated_break_even_orders,null);
});
test('No required costs means zero target, not invented sales',()=>{
 const x=evaluateBreakEvenScenario({...breakEvenSynthetic,fixed_cash_cost:0,creator_hours:0,variable_nonpayment_cost:12});
 assert.equal(x.cash_break_even_orders,0);
 assert.equal(x.labor_compensated_break_even_orders,0);
});
test('Rejects omitted and implausible user fees or refund assumptions',()=>{
 for(const key of Object.keys(breakEvenSynthetic)){
  const t={...breakEvenSynthetic};delete t[key];assert.throws(()=>evaluateBreakEvenScenario(t));
 }
 assert.throws(()=>evaluateBreakEvenScenario({...breakEvenSynthetic,refund_probability:1.2}));
 assert.throws(()=>evaluateBreakEvenScenario({...breakEvenSynthetic,processor_rate:-0.1}));
});
