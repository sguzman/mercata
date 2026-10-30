import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/luckyest-two-checkpoint-net-stage-correction-2026.json'),
 dossier=load('specimens/steam.json'),registry=load('ontology/steam/source-families.json'),
 plan=load('plans/steam.json'),queue=load('queues/steam.json');
test('Two public reports cover one app and the later observation is cumulative',()=>{
 const p=study.public_author_reports;
 assert.equal(study.same_underlying_game_and_author,true);
 assert.equal(study.public_store.app_id,3803930);
 assert.equal(study.public_store.first_paid_release_at,'2025-09-23');
 assert.equal(p.first_day.cumulative_paid_units_lower_bound_exclusive,100);
 assert.equal(study.early_units_not_exactly_100,true);
 assert.equal(p.later.cumulative_units_reported,10525);
 assert.equal(p.later.days_from_official_release,89);
 assert(p.later.cumulative_units_reported>p.first_day.cumulative_paid_units_lower_bound_exclusive);
 assert.equal(study.public_store.store_confirms_sales,false);
});
test('The corrected 16500 net excludes Steam fee and is never treated as personal take home',()=>{
 const later=study.public_author_reports.later;
 assert.equal(later.gross_usd_approx,20000);
 assert.equal(later.net_usd_author_label,16500);
 assert.equal(later.net_stage_corrected_in_author_comment,'after_returns_and_some_taxes_before_steam_share');
 assert.equal(later.author_suggested_ultimate_gross_retention_pct_approx,55);
 assert.equal(later.actual_bank_deposits_verified,false);
 for(const [k,v] of Object.entries(study.unknown))assert.equal(v,null,k);
});
test('Register two publisher-authored URLs as one selected game, not independent incomes',()=>{
 const family=registry.families.find(x=>x.id===study.source_family_id);
 assert(family);
 assert.equal(family.documented_selected_games,1);
 assert.deepEqual(family.source_ids,study.source_ids.slice(0,2));
 assert.equal(family.independence.includes('not two independent'),true);
});
test('All claims remain linked to public sources without changing the 293 original tasks',()=>{
 const sources=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,4);
 assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
