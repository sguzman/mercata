import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {evaluateIncomeInterval,auditNicheUncertainty} from '../site/niche-uncertainty.mjs';
import {evaluateIncomeScenario} from '../site/scenario.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
const ranges={currency:'USD',watch_views:{min:1000,max:2000},watch_ad_only_rpm:{min:1,max:2},shorts_engaged_views:{min:0,max:3000},shorts_ad_only_rpm:{min:0,max:0.2},net_other_receipts:{min:0,max:10},cash_costs:{min:5,max:15},labor_hours:{min:1,max:3}};
test('Assumption envelope bounds both profits and negative hourly outcomes without fabricated confidence',()=>{
 const result=evaluateIncomeInterval(ranges);
 assert.deepEqual(result.watch_ad_receipts,{min:1,max:4});
 assert.deepEqual(result.shorts_ad_receipts,{min:0,max:0.6});
 assert.deepEqual(result.cash_profit_before_tax,{min:-14,max:9.6});
 assert.equal(result.cash_profit_per_hour.min,-14);
 assert.equal(result.cash_profit_per_hour.max,9.6);
 assert.equal(result.verified_confidence_percent,null);
 assert.equal(result.actual_creator_earnings,null);
});
test('Degenerate interval exactly matches existing tested scenario math',()=>{
 const point=Object.fromEntries(Object.entries(ranges).map(([key,value])=>[key,key==='currency'?value:value.min]));
 const exact=evaluateIncomeScenario(point);
 const same=Object.fromEntries(Object.entries(ranges).map(([key,value])=>[key,key==='currency'?value:{min:value.min,max:value.min}]));
 const bounded=evaluateIncomeInterval(same);
 assert.equal(bounded.cash_profit_before_tax.min,exact.cash_profit_before_tax);
 assert.equal(bounded.cash_profit_before_tax.max,exact.cash_profit_before_tax);
 assert.equal(bounded.cash_profit_per_hour.min,exact.cash_profit_per_hour);
});
test('Reject reversed ranges, zero labor and fractional view events',()=>{
 const a=structuredClone(ranges);a.cash_costs.min=20;assert.throws(()=>evaluateIncomeInterval(a),/ordered/);
 const b=structuredClone(ranges);b.labor_hours.min=0;assert.throws(()=>evaluateIncomeInterval(b),/Positive/);
 const c=structuredClone(ranges);c.watch_views.min=1.5;assert.throws(()=>evaluateIncomeInterval(c),/integers/);
});
test('Machine record has no default empirical niche forecast',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/niche-uncertainty-ranges-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditNicheUncertainty(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
