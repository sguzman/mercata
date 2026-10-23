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
