import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticMonthlyNetModelBuckets as audit} from '../site/steam-residualplay-bucket-scope-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=load('ontology/steam/steam-residualplay-selected-current-monthly-net-vs-lifetime-gross-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({fixture_id:'fixture-monthly-selected',tracked_games:1289,under100:151,from100to500:447,
 from500to2000:338,from2000to10000:230,over10000:123,reported_over2000:353,model_median_usd:590,
 all_original_paid_games_included:false,bank_deposits_verified:false});
test('Five disclosed estimated monthly bins reconstruct the 1289 tracked game denominator',()=>{
 const a=audit(fixture());assert.equal(a.selected_tracked_titles,1289);
 assert.equal(a.fraction_selected_estimated_over2000,353/1289);
 assert.equal(a.model_median_usd_as_reported,590);
 assert.equal(a.all_paid_games_sampled,false);
});
test('Net model/monthly estimate is not lifetime gross or settled publisher cash',()=>{
 const a=audit(fixture());assert.equal(a.modelled_monthly_not_actual_income,true);
 for(const k of ['actual_legal_payee_net_median','actual_zero_sales_fraction',
 'actual_personal_profit','comparable_lifetime_gross_median'])assert.equal(a[k],null);
 assert.equal(doc.comparison.same_earnings_category,false);
 assert(Object.values(doc.unknown).every(x=>x===null));
});
test('Disallow mutated bins, false completeness claims or private financial keys',()=>{
 for(const patch of [{tracked_games:1290},{under100:150},{reported_over2000:354},
 {model_median_usd:-1},{from500to2000:0.25},{all_original_paid_games_included:true},
 {bank_deposits_verified:true},{merchant_id:'secret'},{gross_partner_payout:450}])
  assert.throws(()=>audit({...fixture(),...patch}));
 assert.throws(()=>audit([1289,590]));
});
test('Source attribution and fixed 293 task inventory stay intact',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(doc.source_ids.length,3);assert.equal(doc.claim_ids.length,9);
 for(const id of doc.source_ids)assert(sources.has(id),id);
 for(const id of doc.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>sources.has(x)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
