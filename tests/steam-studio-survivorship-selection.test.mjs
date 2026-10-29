import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticStudioRepeatSelection as audit} from '../site/steam-studio-survivorship-selection.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=load('ontology/steam/steam-studio-survivorship-selection-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const example=()=>audit(doc.synthetic_fixture,doc.synthetic_window);
test('The unmatched survivor sample reverses the matched game-order comparison',()=>{
 const v=example(),x=doc.expected_synthetic;
 assert.equal(v.first_game_review_median_all,x.all_first_median);
 assert.equal(v.first_game_review_median_among_repeaters,x.repeaters_first_median);
 assert.equal(v.second_game_review_median_among_repeaters,x.repeaters_second_median);
 assert.equal(v.naive_unmatched_median_difference,x.naive_unmatched_difference);
 assert.equal(v.matched_repeaters_difference_of_medians,x.within_repeater_difference_of_medians);
 assert.equal(v.matched_repeaters_median_of_gamewise_differences,x.median_paired_change);
 assert(v.naive_unmatched_median_difference>0&&v.matched_repeaters_difference_of_medians<0);
});
test('No second launch remains an observation, never a verdict of failure',()=>{
 const v=example(),x=doc.expected_synthetic;
 assert.equal(v.counts.repeaters,x.repeaters);
 assert.equal(v.counts.no_second_observed_with_followup,x.no_second_observed_with_followup);
 assert.equal(v.no_second_observed_is_not_business_failure,true);
 const young={fixture_studio_id:'fixture-new',first_release_date:'2026-10-01',first_game_reviews:0,second_release_date:null,second_game_reviews:null};
 assert.equal(audit([young],doc.synthetic_window).counts.right_censored_for_second,1);
 assert.equal(audit([young],doc.synthetic_window).second_game_review_median_among_repeaters,null);
});
test('Never invent sales, conversion, profit or causal impact from reviews',()=>{
 const v=example();
 for(const k of ['real_studio_debut_survival_probability','causal_experience_premium','incremental_sales_from_publisher','actual_game_paid_orders','publisher_profit'])assert.equal(v[k],null,k);
 assert.equal(v.age_aligned_review_observation_verified,false);
 assert.equal(doc.playrecon_observation.not_verified_legal_publisher_count,true);
 assert.equal(doc.playrecon_observation.not_independent_paid_order_audit,true);
});
test('Missing dates, real-looking studios, duplicates and private fields fail closed',()=>{
 const first=doc.synthetic_fixture[0];
 assert.throws(()=>audit([first,first],doc.synthetic_window),/synthetic/);
 assert.throws(()=>audit([{...first,fixture_studio_id:'actual-company'}],doc.synthetic_window),/synthetic/);
 assert.throws(()=>audit([{...first,bank_account:'secret'}],doc.synthetic_window),/synthetic/);
 assert.throws(()=>audit([{...first,first_release_date:'2025-02-30'}],doc.synthetic_window),/initial release/);
 assert.throws(()=>audit([{...first,second_game_reviews:2}],doc.synthetic_window),/Second game/);
 assert.throws(()=>audit([{...first,second_release_date:'2025-02-03'}],doc.synthetic_window),/No second/);
});
test('Every source and claim exists in dossier and original 293 tasks remain unchanged',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(doc.source_ids.length,5);assert.equal(doc.claim_ids.length,7);
 for(const id of doc.source_ids)assert(sources.has(id),id);
 for(const id of doc.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert(Object.values(doc.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
