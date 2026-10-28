import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditAssetCashFloor} from '../site/itch-asset-cash-floor.mjs';
const get=f=>JSON.parse(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'));
test('First party asset results have separate sellers, identical Akami seller and no paid video game measurements',()=>{
 const x=get("ontology/itch-io/game-asset-creator-cash-labor-break-even-limits-2026.json"),d=get('specimens/itch-io.json');
 assert.equal(x.population.different_publishers,2);assert.equal(x.population.source_reports,3);
 assert.equal(x.population.game_paid_order_count,null);assert.equal(x.boundaries.paid_video_game_demand_inferred,false);
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.akami.eur_reported_revenue_may_to_june30,12.99);
 assert.equal(x.akami.payment_events_reported,3);assert.equal(x.akami.asset_project_pages,13);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Cash and valued labor cost floors require 13 and 46 whole hypothetical gross orders',()=>{
 const a=auditAssetCashFloor({monthlySubscriptionEur:75,assumedGrossEurPerPayment:6,valuedLaborHours:20,assumedLaborEurPerHour:10});
 assert.equal(a.totalModeledMonthlyCostEur,275);assert.equal(a.grossOnlyCashFloorOrders,13);
 assert.equal(a.grossOnlyCashAndLaborFloorOrders,46);assert.equal(a.optimisticLowerBoundOnly,true);
 assert.equal(a.realAfterFeeContributionEur,null);assert.equal(a.actualPaidPlayableGameOrders,null);
 assert.equal(auditAssetCashFloor({monthlySubscriptionEur:75,assumedGrossEurPerPayment:7,valuedLaborHours:20,assumedLaborEurPerHour:10}).grossOnlyCashAndLaborFloorOrders,40);
});
test('Invalid assumptions fail closed; nonpositive gross contribution cannot meet positive costs',()=>{
 const valid={monthlySubscriptionEur:75,assumedGrossEurPerPayment:6,valuedLaborHours:20,assumedLaborEurPerHour:10};
 for(const key of Object.keys(valid))assert.throws(()=>auditAssetCashFloor({...valid,[key]:null}),TypeError);
 assert.throws(()=>auditAssetCashFloor({...valid,monthlySubscriptionEur:-1}),TypeError);
 assert.equal(auditAssetCashFloor({...valid,assumedGrossEurPerPayment:0}).grossOnlyCashFloorOrders,null);
 assert.equal(auditAssetCashFloor({...valid,monthlySubscriptionEur:0,valuedLaborHours:0,assumedGrossEurPerPayment:0}).grossOnlyCashAndLaborFloorOrders,0);
});
test('Current fixed task score remains below completion',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/strategy/set-stop-conditions');
 assert(t&&t.percent>=96&&t.percent<100&&t.status==='in_progress');
 for(const file of ["ontology/itch-io/game-asset-creator-cash-labor-break-even-limits-2026.json","ontology/itch-io/game-asset-creator-cash-labor-break-even-limits-2026.md","site/itch-asset-cash-floor.mjs","tests/itch-asset-cash-floor.test.mjs"])assert(t.evidence.includes(file));
});
