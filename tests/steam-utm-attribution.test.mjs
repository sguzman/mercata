import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {summarizeTaggedVisits} from '../site/steam-utm-metrics.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=read('ontology/steam/utm-traffic-attribution-and-paid-marketing-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('UTM examples preserve event and visit denominators without inventing buyers or paid revenue',()=>{
 const x=summarizeTaggedVisits({total_visits:120,trusted_visits:100,tracked_visits:60,wishlist_events:18,purchase_events:3,activation_events:5});
 assert.equal(x.attributed_purchase_events_per_tracked_visit,0.05);
 assert.equal(x.attributed_activation_events_per_tracked_visit,5/60);
 assert.equal(x.unique_customer_purchase_probability,null);
 assert.equal(x.marketing_causal_sales_lift,null);
 assert.equal(x.refund_adjusted_net_purchases,null);
 assert.equal(x.paid_ad_return_on_spend,null);
});
test('Empty or invalid visit metrics cannot silently yield a purchaser conversion rate',()=>{
 const a=summarizeTaggedVisits({total_visits:0,trusted_visits:0,tracked_visits:0,wishlist_events:0,purchase_events:0,activation_events:0});
 assert.equal(a.attributed_purchase_events_per_tracked_visit,null);
 assert.throws(()=>summarizeTaggedVisits({total_visits:1,trusted_visits:2,tracked_visits:0,wishlist_events:0,purchase_events:0,activation_events:0}),/Visit subsets/);
});
test('Steam UTM association window and access limits are explicit and real outcomes unknown',()=>{
 assert.equal(r.attribution_within_hours,72);
 assert.equal(r.report_lag.conversion_finalization_days,4);
 assert.equal(r.report_lag.late_refunds_subtracted_from_final_utm,false);
 assert.equal(r.privacy.steam_ids_exposed,false);
 assert.equal(r.activation_always_steam_checkout,false);
 assert.equal(r.includes_in_game_microtransaction,false);
 assert.equal(r.measurement.causal_sales_lift,null);
});
test('Every new source and claim is referenced without changing 293 Steam tasks',()=>{
 const sourceIds=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(r.source_ids.length,3);assert.equal(r.claim_ids.length,22);
 for(const id of r.source_ids)assert(sourceIds.has(id),id);
 for(const id of r.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sourceIds.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
