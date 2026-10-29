import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditPublishedNextFestOverlap as audit} from '../site/steam-demo-wishlist-overlap-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-nextfest-demo-wishlist-overlap-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const input=()=>({demo_players:1280,played_and_wishlisted:296,reported_wishlist_additions:1898,daily_demo_players:[172,129,174,200,198,231,176],daily_wishlist_additions:[134,342,282,325,237,275,213,179]});
test('Public October aggregate preserves conflicting wishlist denominators',()=>{
 const a=audit(input());
 assert.equal(a.played_and_wishlisted_share_of_demo_players,296/1280);
 assert.equal(a.daily_demo_players_sum,1280);assert.equal(a.daily_wishlist_additions_sum,1987);
 assert.equal(a.wishlist_additions_unreconciled_delta,89);
 assert.equal(a.demo_player_sum_reconciled,true);assert.equal(a.wishlist_additions_reconciled,false);
 assert.equal(a.daily_player_entries,7);assert.equal(a.daily_wishlist_entries,8);
});
test('Joint membership cannot become paid conversion, causal lift or a marketwide rate',()=>{
 const a=audit(input());for(const k of ['matched_purchase_conversion','chronological_play_to_wishlist_conversion','representative_steam_player_overlap','causal_festival_lift','publisher_profit'])assert.equal(a[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Zero demo denominator yields undefined overlap, not a fake rate',()=>{
 const a=audit({demo_players:0,played_and_wishlisted:0,reported_wishlist_additions:0,daily_demo_players:[0],daily_wishlist_additions:[0]});
 assert.equal(a.played_and_wishlisted_share_of_demo_players,null);
 assert.doesNotThrow(()=>JSON.stringify(a));
});
test('Reject impossible overlaps, unexpected account fields and unsafe daily sums',()=>{
 const a=input();a.played_and_wishlisted=1281;assert.throws(()=>audit(a),/Overlap cannot/);
 const b=input();b.secret_partner_email='private';assert.throws(()=>audit(b),/Only public aggregate/);
 const c=input();c.daily_wishlist_additions[0]=-1;assert.throws(()=>audit(c),/Invalid nonnegative/);
 const e=input();e.daily_wishlist_additions[0]=Number.MAX_SAFE_INTEGER;assert.throws(()=>audit(e),/Unsafe daily aggregate/);
});
test('Two source records and five independently authored bounded claims link to the original 293 tasks',()=>{
 const src=new Set(d.evidence.map(x=>x.id)),cl=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,5);
 for(const id of study.source_ids)assert(src.has(id),id);
 for(const id of study.claim_ids)assert(cl.has(id)&&cl.get(id).source_ids.every(sid=>src.has(sid)),id);
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
