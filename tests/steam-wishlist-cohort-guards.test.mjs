import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticWishlistPurchaseCohorts as audit} from '../site/steam-wishlist-cohort-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-prelaunch-signal-observability-and-wishlist-cohorts-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Synthetic wishlist purchases grouped by month cohorts without invented conversion',()=>{
 const r=audit([{DateLocal:'2026-02-15',MonthCohort:'2026-01-01',wishlist_purchase_events:3},
 {DateLocal:'2026-02-20',MonthCohort:'2026-01-01',wishlist_purchase_events:4},
 {DateLocal:'2026-02-20',MonthCohort:'2026-02-01',wishlist_purchase_events:2}],{reportAsOf:'2026-02-22'});
 assert.equal(r.total_wishlist_purchase_events,9);assert.equal(r.cohorts.length,2);
 assert.deepEqual(r.cohorts[0],{wishlist_month:'2026-01-01',months_since_wishlist_month:1,purchase_events:7});
 assert.equal(r.latest_included,'2026-02-21');assert.equal(r.wishlist_purchase_probability,null);
});
test('Demo, Playtest and retail activations are not paid Steam checkouts',()=>{
 assert.equal(x.event_classes.demo_download.paid_checkout,false);
 assert.equal(x.event_classes.playtest_signup.paid_checkout,false);
 assert.equal(x.event_classes.retail_key_activation.paid_steam_checkout,false);
 assert.equal(x.event_classes.utm_purchase.causal_incremental,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Invalid timing, private account identifiers and negative counts fail',()=>{
 const z={DateLocal:'2026-02-20',MonthCohort:'2026-01-01',wishlist_purchase_events:1};
 assert.throws(()=>audit([z],{reportAsOf:'2026-02-20'}),/Today/);
 assert.throws(()=>audit([{...z,MonthCohort:'2026-01-02'}],{reportAsOf:'2026-02-22'}),/first day/);
 assert.throws(()=>audit([{...z,MonthCohort:'2026-03-01'}],{reportAsOf:'2026-03-30'}),/precedes/);
 assert.throws(()=>audit([{...z,customer_id:'abc'}],{reportAsOf:'2026-02-22'}),/identities/);
 assert.throws(()=>audit([{...z,wishlist_purchase_events:-2}],{reportAsOf:'2026-02-22'}),/Nonnegative/);
 assert.throws(()=>audit([{...z,DateLocal:'2026-02-30'}],{reportAsOf:'2026-03-30'}),/Invalid calendar/);
});
test('Sources claims and fixed 293 task inventory preserve integrity',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
