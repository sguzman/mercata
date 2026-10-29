import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {nestedAnnualGameGrossFloor as floor} from '../site/steam-annual-threshold-floor.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-gdc-2025-nested-annual-gross-revenue-floor-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Nested Valve-attributed thresholds give a conditional 2025 annual lower bound',()=>{
 const v=x.observations,r=floor({aboveLow:v.games_over_100k,aboveHigh:v.games_over_500k,lowUSD:v.threshold_low_usd,highUSD:v.threshold_high_usd});
 assert.equal(r.middle_threshold_count,3468);
 assert.equal(r.lower_floor_high_group_usd,1197500000);
 assert.equal(r.lower_floor_middle_group_usd,346800000);
 assert.equal(r.strict_total_revenue_floor_usd,1544300000);
 assert.equal(r.above_low_fraction_also_above_high,2395/5863);
 assert.equal(r.actual_marketwide_annual_gross_usd,null);assert.equal(r.actual_publisher_net_receipts_usd,null);
 assert.equal(r.firstyear_newrelease_success_rate,null);assert.equal(r.developer_after_cost_profit_usd,null);
});
test('Invalid or inconsistent thresholds are rejected',()=>{
 assert.throws(()=>floor({aboveLow:1,aboveHigh:2,lowUSD:100,highUSD:500}),/Inconsistent/);
 assert.throws(()=>floor({aboveLow:1,aboveHigh:1,lowUSD:100,highUSD:100}),/Inconsistent/);
 assert.throws(()=>floor({aboveLow:1,aboveHigh:1,lowUSD:-1,highUSD:100}),/Invalid/);
 assert.throws(()=>floor({aboveLow:2.5,aboveHigh:1,lowUSD:100,highUSD:500}),/Invalid/);
 assert.throws(()=>floor({aboveLow:Number.MAX_SAFE_INTEGER,aboveHigh:Number.MAX_SAFE_INTEGER,lowUSD:100,highUSD:500}),/Unsafe/);
});
test('No revenue probabilities or earned percentiles are imported from a success-selected tail',()=>{
 assert.equal(x.observations.all_release_years,true);
 assert.equal(x.observations.underlying_metric_match_independently_audited,false);
 assert(Object.values(x.not_estimated).every(v=>v===null));
 assert.equal(x.data_limits.not_directly_audited_valve_presentations,true);
});
test('New study remains source-backed within the 293-task research population',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cc.has(id),id);assert(cc.get(id).source_ids.every(s=>ss.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/market/audit-annual-gross-sales-totals').evidence.includes('ontology/steam/steam-gdc-2025-nested-annual-gross-revenue-floor-2026.json'));
});
