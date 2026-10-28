import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=read('ontology/steam/executive-economic-evidence-and-decision-gates-2026.json'),p=read('plans/steam.json'),q=read('queues/steam.json'),d=read('specimens/steam.json');
const cohort=read('ontology/steam/january-2026-modeled-paid-release-distribution.json');
const budget=read('ontology/steam/synthetic-first-game-break-even-scenarios-2026.json');
const sourceIds=new Set(d.evidence.map(s=>s.id)),claimIds=new Map(d.claims.map(c=>[c.id,c]));
test('Executive metrics cross-check prior modeled cohort and hypothetical costs',()=>{
 assert.equal(r.observations.january2026_provider_model.reported_games,cohort.population.reported_listed_game_count);
 assert.equal(r.observations.january2026_provider_model.missing_copy_estimates,cohort.zero_estimation.missing_copies_estimate_count);
 assert.equal(r.observations.synthetic_first_game.assumed_cash_break_even_orders,budget.example.cash_break_even_orders);
 assert.equal(r.observations.synthetic_first_game.assumed_labor_inclusive_break_even_orders,budget.example.economic_break_even_orders);
});
test('The executive synthesis does not invent partner gross, profits or first-game survivorship odds',()=>{
 assert(Object.values(r.unknown).every(v=>v===null));
 assert(r.evidence_layers.find(x=>x.level==='unobserved_private_ground_truth'));
 assert.equal(r.no_real_merchant_data,true);
 assert.equal(r.no_game_published,true);
});
test('Every claim has real sources and the fixed inventory remains exactly 293 tasks',()=>{
 assert.equal(r.claim_ids.length,10);
 for(const id of r.source_ids)assert(sourceIds.has(id),id);
 for(const id of r.claim_ids){assert(claimIds.has(id),id);assert(claimIds.get(id).source_ids.every(x=>sourceIds.has(x)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((sum,v)=>sum+v,0)/293));
});
