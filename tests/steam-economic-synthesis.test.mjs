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
test('Public first-party accounts do not become authenticated payouts or market medians',()=>{
 const selected=r.evidence_layers.find(x=>x.level==='voluntary_first_party_developer_cash_disclosures');
 assert(selected);assert.match(selected.does_not_measure,/representative/);
 const examples=r.observations.public_self_disclosure_examples;
 assert.equal(examples.loki_firstgame_2025.actual_bank_deposit_usd,null);
 assert.equal(examples.mixolumia_steam_2021.matched_time_window_verified,false);
 assert.equal(examples.onlyway_launch_2025.after_cost_profit_usd,null);
 assert.equal(examples.water_tastes_like_wine_2018.positive_sales_reported,true);
 assert.equal(examples.water_tastes_like_wine_2018.author_claimed_personal_proceeds_usd_at_early_snapshot,0);
 assert(Object.values(r.unknown).every(v=>v===null));
});
test('Recent self-reports retain inconsistent currency and payment definitions',()=>{
 const v=r.observations.public_self_disclosure_examples;
 assert.equal(v.studio_ortica_2026.one_studio_three_titles,true);
 assert.equal(v.studio_ortica_2026.bank_statement_verified,false);
 assert.equal(v.roguecraft_2026.after_cost_profit,null);
 assert.equal(v.roguecraft_2026.steam_platform_cut_explicitly_in_net_label,false);
 assert.equal(v.rainswept_2019.by_store_sum_net_usd-v.rainswept_2019.headline_author_reported_net_usd,20);
 assert.equal(v.rainswept_2019.april_steam_net_estimated_not_settled,true);
 assert.equal(v.starcom_2020.verified_personal_net_salary,null);
});
test('Every claim has real sources and the fixed inventory remains exactly 293 tasks',()=>{
 assert.equal(r.claim_ids.length,22);
 for(const id of r.source_ids)assert(sourceIds.has(id),id);
 for(const id of r.claim_ids){assert(claimIds.has(id),id);assert(claimIds.get(id).source_ids.every(x=>sourceIds.has(x)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((sum,v)=>sum+v,0)/293));
});
