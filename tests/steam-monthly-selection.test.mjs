import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {monthlyDistributionEligibility,compareEarlyAccessWindows} from '../site/steam-monthly-coverage.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/multi-month-leaderboards-and-early-access-selection-2026.json'),d=get('specimens/steam.json'),plan=get('plans/steam.json'),queue=get('queues/steam.json');
test('All top-seller months lack representative full-market medians',()=>{
 assert.equal(x.monthly_source_coverage.length,5);
 for(const month of x.monthly_source_coverage.filter(m=>m.month!=='2026-01')){
  assert.equal(month.all_reported_games,null);assert.equal(month.has_unsuccessful_and_missing_estimates,false);
  const check=monthlyDistributionEligibility({frame:month.source_frame,denominator:month.all_reported_games,includes_low_and_zero_sellers:false,horizon_days:null,measure:'attributed_model_gross'});
  assert.equal(check.eligible_for_bounded_distribution,false);
 }
 assert.equal(x.source_comparison.multi_month_paid_steam_median,null);
});
test('Even a claimed full modeled cohort is not an audited merchant ledger',()=>{
 const good=monthlyDistributionEligibility({frame:'all_paid_first_releases',denominator:1230,includes_low_and_zero_sellers:true,horizon_days:240,measure:'attributed_model_gross'});
 assert.equal(good.eligible_for_bounded_distribution,true);assert.equal(good.merchandise_sales_verified,false);
});
test('Early Access survivor comparisons are not first-paid launches or net profit',()=>{
 assert.equal(x.early_access_graduates.n_tracked,91);
 assert.equal(x.early_access_graduates.median_months_in_early_access,15);
 assert.equal(x.early_access_graduates.selection_includes_zero_sellers,false);
 const c=compareEarlyAccessWindows({ea_first30:5000,v1_first30:6000});
 assert.equal(c.v1_greater_than_ea,true);assert.equal(c.developer_profit,null);
 assert.equal(x.early_access_graduates.causal_second_launch_uplift,null);
});
test('Every claim has a source; denominator stays 293',()=>{
 const sources=new Set(d.evidence.map(x=>x.id));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,13);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const id of x.claim_ids){const c=d.claims.find(x=>x.id===id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)));}
 const t=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(t.length,293);assert.equal(Math.round(t.reduce((a,b)=>a+b,0)/293),plan.progress_percent);
});
