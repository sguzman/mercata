import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticTop500SteamMonth as audit} from '../site/steam-month-revenue-top500-scope-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/alinea-september-2026-platform-gross-top500-vs-newcomer-income.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const f=()=>({fixture_id:'fixture-mixed-revenue',ranked_games:500,
 top500_platform_share:.75,new_ip_revenue_share:.205,established_ip_revenue_share:.795,
 f2p_revenue_share:.256,f2p_title_fraction:.16,
 released_2026_revenue_share:.336,released_2025_revenue_share:.087,released_2024_revenue_share:.093,
 full_year_has_ended:false});
test('Top 500 selected titles share and IP partition never become platformwide first-release counts',()=>{
 const x=audit(f());assert.equal(x.ranked_games,500);
 assert.equal(x.top_ranked_platform_revenue_share,.75);
 assert(Math.abs(x.other_release_years_revenue_share_if_disjoint-.484)<1e-12);
 assert.equal(x.first_paid_release_cohort_complete,false);
});
test('F2P revenue in ranked top 500 does not establish F2P zero sales or paid title median',()=>{
 const x=audit(f());assert.equal(x.reported_f2p_title_fraction,.16);
 assert.equal(x.reported_f2p_revenue_fraction_within_top_ranked,.256);
 for(const k of ['observed_calendar_year_2026_gross','actual_publisher_bank_remittances',
 'representative_paid_first_release_median','actual_zero_sale_fraction'])assert.equal(x[k],null,k);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('No model total is promoted to verified full-year amount',()=>{
 assert.equal(study.platform_modelled_revenue_usd.full_year_2026_actual,null);
 assert.equal(study.platform_modelled_revenue_usd.full_year_above_20b_is_prediction_only,true);
 assert.equal(audit(f()).observed_calendar_year_2026_gross,null);
});
test('Inconsistent IP categories, extra transaction fields or finished-year claims fail closed',()=>{
 for(const bad of [{ranked_games:0},{new_ip_revenue_share:.25},{released_2026_revenue_share:.95},
  {top500_platform_share:1.05},{f2p_title_fraction:-.1},{full_year_has_ended:true},
  {private_partner_id:'secret'},{actual_bank_usd:16500000000}])
  assert.throws(()=>audit({...f(),...bad}));
 assert.throws(()=>audit([500,.75,.256]));
});
test('Primary-model source and 10 claims preserve original fixed 293-task inventory',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,1);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(ids.has(id));
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>ids.has(x)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
