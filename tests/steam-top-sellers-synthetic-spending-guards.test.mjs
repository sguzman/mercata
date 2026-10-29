import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamTopSellerComponents as audit} from '../site/steam-top-sellers-synthetic-spending-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-top-sellers-spend-components-and-rank-nonidentification-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Invented free-to-play spending can exceed premium unweighted spending, without identifying rank',()=>{
 const f=audit(x.hypothetical_cases[0]),g=audit(x.hypothetical_cases[1]);
 assert.equal(f.unweighted_24h_spend_cents,21000);
 assert.equal(g.unweighted_24h_spend_cents,19000);
 assert.equal(f.spend_components_cents.base,0);assert.equal(f.spend_components_cents.microtransactions,18000);
 assert(f.unweighted_24h_spend_cents>g.unweighted_24h_spend_cents);
 assert.equal(f.actual_position_on_top_sellers,null);assert.equal(g.actual_position_on_top_sellers,null);
 assert.equal(f.extra_steam_weight_coefficient,null);
});
test('Rank, base-game units, net receipts, profit and customer reach are not identifiable',()=>{
 for(const fixture of x.hypothetical_cases){
  const r=audit(fixture);
  assert.equal(r.recent_3h_has_extra_steam_chart_weight,true);
  assert.equal(r.chart_compares_paid_base_game_units,false);
  for(const k of ['actual_position_on_top_sellers','base_game_paid_units','country_specific_rank','refunded_net_partner_revenue','unique_paying_customers','publisher_profit'])assert.equal(r[k],null);
 }
});
test('Reject private, negative, missing, unverified, or unsafe spending rows',()=>{
 const f=x.hypothetical_cases[0];
 assert.throws(()=>audit({...f,steam_user_id:'secret'}),/synthetic/);
 assert.throws(()=>audit({...f,public_rank_observed:true}),/Real merchant/);
 assert.throws(()=>audit({...f,latest_3h_spend_cents:{base:0,dlc:-1,microtransactions:2}}),/nonnegative/);
 assert.throws(()=>audit({...f,prior_21h_spend_cents:{base:0,dlc:0}}),/Exactly three/);
 assert.throws(()=>audit({...f,prior_21h_spend_cents:{base:Number.MAX_SAFE_INTEGER,dlc:2,microtransactions:0}}),/Unsafe/);
 assert.throws(()=>audit({...f,chart_scope:'unknown'}),/synthetic/);
});
test('Original 293 tasks, one new public primary source and six bounded claims',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,6);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids)assert(cc.has(id)&&cc.get(id).source_ids.every(s=>ss.has(s)),id);
 assert(Object.values(x.unknown).every(v=>v===null));
 const a=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(a.length,293);assert.equal(p.progress_percent,Math.round(a.reduce((s,v)=>s+v,0)/293));
});
