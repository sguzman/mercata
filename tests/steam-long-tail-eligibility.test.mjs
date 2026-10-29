import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSelectedLongTailEligibility as check} from '../site/steam-long-tail-eligibility.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/selected-long-tail-eligibility-and-censoring-2026.json');
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Eligible synthetic game passes necessary checks, not profit estimate',()=>{
 const r=check({releaseDate:'2024-01-31',firstMonthCopies:2000,horizonMonths:24});
 assert.equal(r.passes_necessary_selection_and_age_checks,true);
 assert.equal(r.individual_revenue_forecast,null);assert.equal(r.publisher_net_cash,null);
});
test('Zero, low and exactly one thousand sales do not qualify',()=>{
 for(const n of [0,28,370,1000]){
  const r=check({releaseDate:'2024-01-01',firstMonthCopies:n});
  assert.equal(r.passes_necessary_selection_and_age_checks,false);
  assert(r.reasons.includes('excluded_by_first_month_success_threshold'));
 }
});
test('Twelve-month and twenty-four-month ages are independently checked',()=>{
 const young=check({releaseDate:'2025-06-15',firstMonthCopies:2000,horizonMonths:24});
 assert(young.reasons.includes('followup_not_mature'));
 assert.equal(check({releaseDate:'2025-06-15',firstMonthCopies:2000,horizonMonths:12}).passes_necessary_selection_and_age_checks,true);
 assert.equal(check({releaseDate:'2024-01-31',firstMonthCopies:2000,horizonMonths:24}).passes_necessary_selection_and_age_checks,true);
 assert(check({releaseDate:'2025-07-30',firstMonthCopies:2000,horizonMonths:12}).reasons.includes('followup_not_mature'));
});
test('Invalid dates, unknown metric and out-of-window releases cannot pass',()=>{
 assert.throws(()=>check({releaseDate:'2024-02-30',firstMonthCopies:2000}),/Invalid calendar date/);
 assert.throws(()=>check({releaseDate:'2024-01-01',firstMonthCopies:-1}),/Nonnegative/);
 assert.throws(()=>check({releaseDate:'2024-01-01',firstMonthCopies:2000,horizonMonths:18}),/12 or 24/);
 assert(check({releaseDate:'2025-08-01',firstMonthCopies:2000}).reasons.includes('outside_release_frame'));
 assert(check({releaseDate:'2024-01-01',firstMonthCopies:2000,measurementType:'review_estimate'}).reasons.includes('mismatched_sales_measurement'));
});
test('Public source joins, unknowns and inventory are preserved',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cs=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,5);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cs.has(id),id);assert(cs.get(id).source_ids.every(s=>ss.has(s)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
