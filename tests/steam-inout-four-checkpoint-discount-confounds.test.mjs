import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-inout-four-checkpoint-discount-outreach-2026.json');
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Four same-game cumulative checkpoints reconcile without implying uniform weeks',()=>{
 const a=x.reported_public_checkpoints;
 assert.equal(a.length,4);assert.equal(x.game.appid,4230140);
 assert.deepEqual(a.map(v=>v.cumulative_sales_units),[81,85,147,162]);
 assert.deepEqual(a.map(v=>v.wishlist_stock),[852,872,900,919]);
 const day=v=>Date.parse(v+'T00:00:00Z')/86400000;
 assert.deepEqual(a.slice(1).map((v,i)=>day(v.post_date)-day(a[i].post_date)),[9,5,7]);
 assert.deepEqual(a.slice(1).map((v,i)=>v.cumulative_sales_units-a[i].cumulative_sales_units),[4,62,15]);
 assert.deepEqual(a.slice(1).map((v,i)=>v.wishlist_stock-a[i].wishlist_stock),[20,28,19]);
 assert.equal(x.arithmetic.identical_seven_day_windows,false);
 assert.equal(a[0].cumulative_sales_units-a[0].previous_reported_units,10);
});
test('A 75% promotion accompanied by multiple interventions does not establish sales causality',()=>{
 assert.equal(x.promotion_context.october_promotion_discount_percent_reported,75);
 assert.equal(x.promotion_context.community_pack_puzzles_from_players_reported,50);
 assert.equal(x.promotion_context.confounding_events_not_ruled_out,true);
 assert.equal(x.unknown.causal_discount_sales_lift,null);
 assert.equal(x.unknown.causal_twitch_key_sales_lift,null);
 assert.equal(x.unknown.verified_zero_sales_steam_fraction,null);
});
test('Press, keys and Twitch replies remain non-comparable units, not paid purchases',()=>{
 assert.equal(x.marketing.oct02_twitch_keys_sent,8);
 assert.equal(x.marketing.oct02_twitch_contacts,46);
 assert.equal(x.marketing.oct07_twitch_keys_sent,19);
 assert.equal(x.marketing.oct07_twitch_contacts,116);
 assert.equal(x.marketing.oct14_twitch_replies,25);
 assert.equal(x.marketing.oct14_twitch_new_contacts,80);
 assert.equal(x.marketing.key_dispatches_are_sales,false);
 assert.equal(x.marketing.replies_are_confirmed_content_coverage,false);
 assert.equal(x.marketing.denominators_aligned_across_posts,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Every source and claim has an existing public reference, and 293 original tasks remain',()=>{
 const sources=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(v=>v.percent),...q.queues.flatMap(g=>g.tasks.map(v=>v.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert.equal(x.private_records_used,false);
});
