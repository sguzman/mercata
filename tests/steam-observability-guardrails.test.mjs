import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditRankingDesign,interpretSeriesAggregates,compareDeckGroups} from '../site/steam-observability-guardrails.mjs';
const read=x=>JSON.parse(fs.readFileSync(new URL('../'+x,import.meta.url),'utf8'));
const r=read('ontology/steam/ranking-claims-and-study-design-2026.json');
const s=read('ontology/steam/series-repeat-payers-2026.json');
const d=read('ontology/steam/deck-verified-competitive-positioning-2026.json');
test('visibility study is not a ranking effect estimate',()=>{
 assert.equal(auditRankingDesign({unit:'app'}).study_ready_for_authorized_measurement,false);
 const x=auditRankingDesign({unit:'app_day',time_window:'90d',visibility_surface:'store',outcome:'purchase',comparison:'control',privacy_protocol:'aggregate'});
 assert.equal(x.study_ready_for_authorized_measurement,true);assert.equal(x.causal_ranking_effect,null);
 assert.equal(r.official_mechanisms.store_page_conversion_direct_factor,false);
 assert.equal(r.unknown.paid_orders,null);
});
test('licenses and free franchise follows cannot identify separately paid repeat purchases',()=>{
 const x=interpretSeriesAggregates({followers:100,licenses_A:60,licenses_B:45,bundle_checkouts:7});
 assert.equal(x.same_person_paid_repeat_fraction,null);
 assert.equal(s.inference_limits.own_app_is_paid_order,false);
 assert.throws(()=>interpretSeriesAggregates({followers:-1,licenses_A:0,licenses_B:0,bundle_checkouts:0}),/Invalid/);
});
test('Deck cohorts matched on metadata still lack causal sales effects',()=>{
 const a={release_month:'2026-01',genre:'strategy',price_band:'10to20',locales:['English'],outcome_horizon_days:90,evidence_kind:'modeled'};
 assert.equal(compareDeckGroups(a,{...a}).metadata_comparable,true);
 assert.equal(compareDeckGroups(a,{...a,genre:'rpg'}).metadata_comparable,false);
 assert.equal(compareDeckGroups(a,{...a}).causal_badge_sales_effect,null);
 assert.equal(d.unknown.causal_verified_uplift,null);
});
test('all new study claims are sourced and original 293 task population is preserved',()=>{
 const specimen=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Set(specimen.evidence.map(x=>x.id)),claims=new Map(specimen.claims.map(x=>[x.id,x]));
 for(const st of [r,s,d]){
  for(const id of st.source_ids)assert(sources.has(id),id);
  for(const id of st.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(id=>sources.has(id)));}
 }
 const vals=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(vals.length,293);assert.equal(Math.round(vals.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});
