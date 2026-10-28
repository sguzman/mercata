import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateSteamAnnualThresholds,describeAggregateSteamRevenueShare} from '../site/steam-annual-threshold-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/valve-2025-platform-and-gdc-2026-aggregate-bounds.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Revenue weighted 76 percent cannot establish publisher or individual share',()=>{
 const a=describeAggregateSteamRevenueShare(x.calendar_2025.nonvalve_revenue_weighted_share);
 assert.equal(a.all_nonvalve_aggregate_revenue_share,0.76);
 assert.equal(a.typical_indie_contract_share,null);assert.equal(a.actual_developer_profit,null);
});
test('Valve all-age annual game thresholds do not yield a first-game hit rate',()=>{
 const a=validateSteamAnnualThresholds({over100k:x.valve_gdc.games_above_100k_usd,over500k:x.valve_gdc.games_above_500k_usd,dailyDealBuyers:x.daily_deals.reported_distinct_buyers});
 assert.equal(a.annual_all_age_games_over100k,5863);
 assert.equal(a.annual_all_age_games_over500k,2395);
 assert.equal(a.first_paid_release_success_rate,null);
 assert.equal(a.total_steam_annual_buyers,null);
 assert.throws(()=>validateSteamAnnualThresholds({over100k:2,over500k:4,dailyDealBuyers:1}),/out of order/);
});
test('All claims have public source attribution; original 293 research tasks persist',()=>{
 const src=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,16);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(id=>src.has(id)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
