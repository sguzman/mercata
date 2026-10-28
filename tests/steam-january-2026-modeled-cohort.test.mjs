import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/january-2026-modeled-paid-release-distribution.json'),d=read('specimens/steam.json');
test('January modeled cohort thresholds are nested and use provider list denominator',()=>{
 const t=x.revenue_thresholds.thresholds;
 assert.equal(x.population.reported_listed_game_count,1230);
 assert.deepEqual(t.map(z=>z.games),[619,248,88,16]);
 assert(t.every((z,i)=>i===0||z.games<=t[i-1].games));
 assert.equal(x.revenue_thresholds.reference_denominator,1230);
 assert.equal(x.population.first_paid_release_status_independently_verified,false);
 assert.equal(x.source_lineage.independent_paid_order_truth,false);
});
test('Model zeros are not actual zeros and missing estimate rows remain counted',()=>{
 const z=x.zero_estimation;
 assert.equal(z.secondary_model_zero_copies,412);
 assert.equal(z.secondary_copies_estimated_records,1211);
 assert.equal(z.listed_release_total,1230);
 assert.equal(z.missing_copies_estimate_count,z.listed_release_total-z.secondary_copies_estimated_records);
 assert(Math.abs(z.modeled_zero_fraction_of_with_estimates-(412/1211))<1e-10);
 assert.equal(z.observed_exact_zero_paid_steam_units_fraction,null);
 assert.equal(z.observed_zero_earning_publishers,null);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Different top-tail group sizes are not interchangeable and no profit is inferred',()=>{
 assert(x.approximate_statistics.modeled_top_1pct_gross_share_reported<x.approximate_statistics.modeled_top_16_gross_share_approximately);
 assert.equal(x.hypothetical_budget_scenarios.length,3);
 assert(x.hypothetical_budget_scenarios.every(s=>Object.hasOwn(s,'actual_costs_observed')?s.actual_costs_observed===false:s.actual_contracts_observed===false));
 assert.equal(x.unknown.developer_after_cost_profit,null);
 assert.equal(x.population.legal_publisher_deduplication_available,false);
});
test('Every new source and claim has a real reference in the Steam dossier',()=>{
 const sourceIds=new Set(d.evidence.map(s=>s.id));const claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,6);
 assert.equal(x.claim_ids.length,21);
 assert(x.source_ids.every(id=>sourceIds.has(id)));
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>sourceIds.has(x)));}
 const plan=read('plans/steam.json'),queue=read('queues/steam.json');
 const v=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(v.length,293);
 assert.equal(Math.round(v.reduce((a,b)=>a+b,0)/293),plan.progress_percent);
});
