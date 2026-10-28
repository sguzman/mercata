import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {checkGenreComparability,taggedCountsDoNotDeduplicate} from '../site/steam-genre-compatibility.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=get('ontology/steam/paid-genre-supply-and-model-comparability-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Immutable and GMD genre medians stay in their own dated, distinct frames',()=>{
 assert.equal(r.sources[0].observations.find(x=>x.tag==='Puzzle').modeled_median_gross_usd,2390);
 assert.equal(r.sources[1].puzzle_modeled_first_year_median_gross_usd,421);
 assert.equal(r.sources[0].observations.find(x=>x.tag==='2D Platformer').modeled_median_gross_usd,1040);
 assert.equal(r.sources[1].eligible_launches_across_genres,26291);
 assert.equal(r.actual_genre_profit_median,null);
});
test('Comparable metadata must have matching cohorts, horizons, prices, tags and estimators',()=>{
 const x={population:'all_steam',paid_status:'mixed',age_window_months:'all',outcome_horizon_months:'unfixed',price_basis:'current_us_list',tax_refund_treatment:'not_reconciled',tag_policy:'overlap',sampling:'middle20',estimator:'review_multiplier'};
 const y={...x,population:'newly_paid_12to36mo',paid_status:'paid_only',outcome_horizon_months:12,price_basis:'regional_after_discounts'};
 const v=checkGenreComparability(x,y);
 assert.equal(v.same_statistical_target,false);
 assert(v.mismatches.some(d=>d.field==='population'));
 assert(v.mismatches.some(d=>d.field==='price_basis'));
 assert.equal(v.causal_genre_roi,null);
 assert.equal(checkGenreComparability(x,x).same_statistical_target,true);
});
test('Overlapping tag counts cannot be a number of unique games',()=>{
 const a=taggedCountsDoNotDeduplicate([11366,26452]);
 assert.equal(a.sum_of_tag_assignments,37818);
 assert.equal(a.distinct_appids,null);
 assert.equal(a.can_assume_mutual_exclusivity,false);
});
test('Source and 293-task integrity remains intact',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,4);assert.equal(r.claim_ids.length,16);
 for(const id of r.source_ids)assert(s.has(id),id);
 for(const id of r.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(sid=>s.has(sid)));}
 const nums=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(nums.length,293);assert.equal(p.progress_percent,Math.round(nums.reduce((a,b)=>a+b,0)/293));
});
