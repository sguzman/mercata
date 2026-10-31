import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticLaunchDisclosureWindows as audit} from '../site/steam-mismatched-disclosure-window-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/first-commercial-mismatched-disclosure-windows-2026.json');
const dossier=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
const fixture=()=>[
 {fixture_id:'fixture-a',window:'about_one_month',units:49,returns:4,revenue_cents:32100,revenue_stage:'author_label_net_undefined_stage'},
 {fixture_id:'fixture-b',window:'first_week',units:279,returns:9,revenue_cents:130000,revenue_stage:'total_revenue_not_including_returns_chargebacks_vat'},
 {fixture_id:'fixture-c',window:'a_little_over_two_weeks',units:40,returns:null,revenue_cents:null,revenue_stage:'not_disclosed'}
];
test('Three actual self-reports have official initial paid dates but incompatible financial windows',()=>{
 assert.equal(study.cases.length,3);
 assert.equal(study.cohort_observation.distinct_initial_paid_appids,3);
 assert.deepEqual(study.cases.map(c=>c.first_paid_release),['2026-04-29','2026-02-27','2026-01-27']);
 assert.equal(study.cases[1].days_between_store_date_and_post,10);
 assert.equal(study.cases[2].reported_revenue_usd,null);
 assert.equal(study.cohort_observation.reporting_windows_harmonized,false);
});
test('Synthetic mismatched windows and financial stages block pooled revenue and representative median',()=>{
 const a=audit(fixture());
 assert.equal(a.number_of_selected_fixtures,3);
 assert.equal(a.same_reporting_window,false);
 assert.equal(a.same_reported_financial_stage,false);
 for(const k of ['descriptive_total_units_if_same_window','descriptive_total_revenue_cents_if_same_window_and_financial_stage',
  'representative_first_paid_game_median','representative_developer_bank_income',
  'actual_zero_paid_sale_fraction','matched_wishlist_conversion'])assert.equal(a[k],null,k);
 assert(Object.values(study.missing).every(x=>x===null));
});
test('Even a harmonized synthetic observation is not a random population estimate',()=>{
 let rows=fixture().slice(0,2).map((r,i)=>({...r,window:'first_week',revenue_stage:'author_label_net_undefined_stage'}));
 const z=audit(rows);
 assert.equal(z.same_reporting_window,true);
 assert.equal(z.same_reported_financial_stage,true);
 assert.equal(z.descriptive_total_units_if_same_window,328);
 assert.equal(z.descriptive_total_revenue_cents_if_same_window_and_financial_stage,162100);
 assert.equal(z.representative_first_paid_game_median,null);
 assert.equal(z.actual_zero_paid_sale_fraction,null);
});
test('Reject real game identifiers, unknown financial stages and malformed synthetic observations',()=>{
 for(const change of [
  {app_id:3752960},{fixture_id:'real-game'},{window:'lifetime'},{units:-1},
  {returns:-1},{revenue_cents:2.3},{revenue_stage:'bank_receipt'},
  {revenue_cents:null},{fixture_id:'fixture-b'}
 ])assert.throws(()=>audit([{...fixture()[0],...change},...fixture().slice(1)]));
 assert.throws(()=>audit([]));
 assert.throws(()=>audit([{...fixture()[0],returns:2.5},...fixture().slice(1)]));
});
test('Period refund events need not be a subset of same-window sales units',()=>{
 const f=fixture();f[0].returns=50;
 const x=audit(f);
 assert.equal(x.period_refunds_may_include_other_purchase_cohorts,true);
 assert.equal(x.matched_original_purchase_cohort_refund_rate,null);
 assert.equal(x.representative_developer_bank_income,null);
});
test('Hypothetically aligned unit and cash aggregates reject unsafe integer overflow',()=>{
 const a=fixture().slice(0,2).map(x=>({...x,window:'first_week',
  revenue_stage:'author_label_net_undefined_stage'}));
 a[0].units=Number.MAX_SAFE_INTEGER;
 a[1].units=1;
 assert.throws(()=>audit(a),/Unsafe synthetic units total/);
 const b=fixture().slice(0,2).map(x=>({...x,window:'first_week',
  revenue_stage:'author_label_net_undefined_stage'}));
 b[0].revenue_cents=Number.MAX_SAFE_INTEGER;
 b[1].revenue_cents=1;
 assert.throws(()=>audit(b),/Unsafe synthetic revenue_cents total/);
});
test('Sources, claims and 293 fixed original tasks retain integrity',()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,7);
 assert.equal(study.claim_ids.length,14);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)),id);}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(q=>q.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
