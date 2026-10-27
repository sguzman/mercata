import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modelGamePortfolio} from '../site/itch-portfolio-economics.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Portfolio arithmetic retains explicit work, costs and zero-order scenario without forecasting sales',()=>{
 const d=read('ontology/itch-io/game-portfolio-unit-cost-scenarios-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const src=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(x=>src.has(x)));
 const x=modelGamePortfolio(d.example_inputs);
 assert.equal(x.totalRetainedOrders,0);
 assert.equal(x.beforeAdditionalCostsContributionUsd,0);
 assert(x.totalValuedLaborCostsUsd>0);
 assert(x.hypotheticalPretaxSurplusUsd<0);
 assert(x.additionalSurplusNeededUsd>500);
 assert(x.games[0].additionalRetainedPaidOrdersIfOnlyThisGameGrows>x.games[1].additionalRetainedPaidOrdersIfOnlyThisGameGrows);
 assert.equal(x.realWorldProjection,false);
 for(const k of ['actualObservedPurchasers','actualSalesProbability','representativeMarketIncome','refundRate','taxLiability','currencyConversionFees'])assert.equal(x[k],null);
 assert.throws(()=>modelGamePortfolio({...d.example_inputs,games:[]}),TypeError);
 assert.throws(()=>modelGamePortfolio({...d.example_inputs,games:[d.example_inputs.games[0],d.example_inputs.games[0]]}),TypeError);
 for(const id of ['itch-io/strategy/evaluate-mini-game-portfolio','itch-io/strategy/plan-post-launch-budget','itch-io/strategy/estimate-viable-monthly-income-threshold','itch-io/strategy/model-alternative-prices']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/game-portfolio-unit-cost-scenarios-2026.json','ontology/itch-io/game-portfolio-unit-cost-scenarios-2026.md','site/itch-portfolio-economics.mjs','tests/itch-game-portfolio-economics.test.mjs'])assert(t.evidence.includes(f));
 }
 const main=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='strategy/break-even');
 assert.equal(main.progress,100);assert.equal(main.status,'complete');
 assert.equal(p.detail_tasks.find(x=>x.id==='itch-io/strategy/plan-localization-pilot').percent,92);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
