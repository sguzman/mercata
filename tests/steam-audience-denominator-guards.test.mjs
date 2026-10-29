import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamPublicAudienceDenominators as audit} from '../site/steam-audience-denominator-guards.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/steam-public-monthly-reach-versus-buying-customers-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
const inp={advertisedMonthlyActiveFloor:132000000,advertisedDailyImpressions:1000000000000,selectedAnnualPromotionBuyers:8200000};
test('Valve active users, impressions and selected deal buyers retain independent units',()=>{
 const r=audit(inp);
 assert.equal(r.monthly_active_users_advertised_floor,132000000);
 assert.equal(r.daily_impressions_advertised_rounded,1000000000000);
 assert.equal(r.selected_annual_promotion_buyers_reported,8200000);
 assert.equal(r.aligned_measurement_periods,false);
 for(const k of ['verified_paid_buyer_count','annual_paying_customer_fraction','monthly_paying_customer_fraction','per_unique_user_daily_impressions','indie_premium_game_paid_buyers','incrementally_attributed_paid_orders','publisher_profit'])
   assert.equal(r[k],null,k);
});
test('A marketing-page retrieval date is not an underlying metric period',()=>{
 assert.equal(x.first_party_reach_snapshot.underlying_month,null);
 assert.equal(x.first_party_reach_snapshot.underlying_day,null);
 assert.equal(x.first_party_reach_snapshot.actual_paying_customers,null);
 assert.equal(x.validity.metric_periods_matched,false);
 assert.equal(x.validity.per_title_paid_units_observed,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Impossible or unsafe reach values are rejected and never converted to profit',()=>{
 assert.throws(()=>audit({...inp,advertisedMonthlyActiveFloor:-1}),/Positive/);
 assert.throws(()=>audit({...inp,advertisedDailyImpressions:0}),/Positive/);
 assert.throws(()=>audit({...inp,selectedAnnualPromotionBuyers:8.2}),/Positive/);
 assert.throws(()=>audit({...inp,advertisedDailyImpressions:Number.MAX_SAFE_INTEGER+1}),/Positive/);
});
test('Public source and claim integrity preserves exactly 293 original tasks',()=>{
 const sources=new Set(d.evidence.map(e=>e.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,9);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const all=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(all.length,293);assert.equal(p.progress_percent,Math.round(all.reduce((s,v)=>s+v,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/market/estimate-available-paid-buyer-population').evidence.includes('ontology/steam/steam-public-monthly-reach-versus-buying-customers-2026.json'));
});
