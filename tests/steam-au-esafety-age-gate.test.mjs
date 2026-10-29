import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamAustraliaR18AgeGate as audit} from '../site/steam-au-esafety-age-gate-guards.mjs';
const read=x=>JSON.parse(fs.readFileSync(new URL('../'+x,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-australia-esafety-2026-age-gate-and-report-scope.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Prepublication report window is independent of later R18 Australia code rollout',()=>{
 const old=audit({jurisdiction:'AU',rating:'R18+',date:'2026-03-31'});
 assert.equal(old.report_observation_period_applies,true);
 assert.equal(old.australian_R18_store_age_gate_in_documented_window,null);
 const later=audit({jurisdiction:'AU',rating:'R18+',date:'2026-09-09'});
 assert.equal(later.report_observation_period_applies,false);
 assert.equal(later.australian_R18_store_age_gate_in_documented_window,true);
 assert.equal(later.steam_credit_card_check_reported_for_AU_R18,true);
});
test('Non Australian or non R18 titles cannot inherit Australia age gate claims',()=>{
 for(const x of [{jurisdiction:'other',rating:'R18+',date:'2026-10-29'},
 {jurisdiction:'AU',rating:'other',date:'2026-10-29'},
 {jurisdiction:'AU',rating:'unknown',date:'2026-10-29'},
 {jurisdiction:'AU',rating:'R18+',date:'2026-09-08'}]){
  const r=audit(x);assert.equal(r.australian_R18_store_age_gate_in_documented_window,null);
  assert.equal(r.outside_source_scope_means_unregulated,false);
 }
});
test('One official regulation window never proves real customer, sale or suspension outcomes',()=>{
 const r=audit({jurisdiction:'AU',rating:'R18+',date:'2026-10-29'});
 for(const key of ['verified_actual_customer_age','individual_purchase_allowed','paid_order_completion_rate',
 'publisher_suspension_probability','lost_gross_sales','developer_after_cost_profit'])assert.equal(r[key],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Dates, future extrapolation and identity leaks are disallowed',()=>{
 assert.throws(()=>audit({jurisdiction:'AU',rating:'R18+',date:'2026-10-30'}),/extrapolate/);
 assert.throws(()=>audit({jurisdiction:'AU',rating:'R18+',date:'2026-02-30'}),/valid public rating/);
 assert.throws(()=>audit({jurisdiction:'AU',rating:'R18+',date:'2026-10-29',user_email:'secret'}),/Only public/);
 assert.throws(()=>audit({jurisdiction:'global',rating:'R18+',date:'2026-10-29'}),/valid public rating/);
});
test('Official Australian sources and eight bounded claims preserve the fixed 293 task scope',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(ss.has(id),id);
 for(const id of study.claim_ids)assert(cc.has(id)&&cc.get(id).source_ids.every(s=>ss.has(s)),id);
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
