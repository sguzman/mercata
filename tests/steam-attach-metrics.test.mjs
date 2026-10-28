import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifyAddonRatios} from '../site/steam-attach-metrics.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=load('ontology/steam/dlc-and-soundtrack-revenue-units-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('Invented item sales do not become base-game owners',()=>{
 const a=classifyAddonRatios({baseOrders:10,dlcOrders:15,soundtrackOrders:9});
 assert.equal(a.dlc_events_per_base_order,1.5);
 assert.equal(a.soundtrack_events_per_base_order_NOT_OWNER_ATTACH,0.9);
 assert.equal(a.deduplicated_base_owner_dlc_attach_fraction,null);
 assert.equal(a.paid_game_copies_implied_by_music_order,0);
 assert.equal(a.actual_developer_profit,null);
});
test('Deduplicated owner probabilities require their own valid denominator',()=>{
 const a=classifyAddonRatios({baseOrders:10,dlcOrders:15,soundtrackOrders:9,uniqueBaseOwners:8,uniqueBaseDlcOwners:2});
 assert.equal(a.deduplicated_base_owner_dlc_attach_fraction,0.25);
 assert.throws(()=>classifyAddonRatios({baseOrders:10,dlcOrders:2,soundtrackOrders:9,uniqueBaseOwners:8}),/Both/);
 assert.throws(()=>classifyAddonRatios({baseOrders:10,dlcOrders:2,soundtrackOrders:9,uniqueBaseOwners:8,uniqueBaseDlcOwners:9}),/Invalid/);
});
test('Soundtracks are distinct music AppIDs and any revenue-share attribution is not a base-game order',()=>{
 assert.equal(r.product_rules.soundtrack_can_buy_without_game,true);
 assert.equal(r.product_rules.associated_soundtrack_revenue_counts_for_base_revenue_share,true);
 assert.equal(r.measurement.soundtrack_purchase_implies_base_ownership,false);
 assert.equal(r.measurement.actual_soundtrack_attach_fraction,null);
});
test('Public source chain and fixed Steam inventory remain valid',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cs=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,4);assert.equal(r.claim_ids.length,14);
 for(const id of r.source_ids)assert(ss.has(id));
 for(const id of r.claim_ids){assert(cs.has(id));assert(cs.get(id).source_ids.every(s=>ss.has(s)));}
 const v=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});
