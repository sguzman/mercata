import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {comparePublicChannels} from '../site/steam-channel-comparison.mjs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=j('ontology/steam/steam-versus-itchio-first-game-channel-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('Fee difference does not identify net seller income',()=>{
 const x=comparePublicChannels({name:'Steam',entryFee:100},{name:'itch.io',entryFee:0});
 assert.equal(x.upfront_fee_difference_usd,100);assert.equal(x.can_rank_by_earnings,false);
 assert.equal(x.known_merchant_profit_comparison,null);
 assert.equal(r.study_status.paired_same_game_paid_order_sample,0);
});
test('Steam keys and itch.io donations are separate denominators',()=>{
 assert(r.incompatible_denominators.includes('itch.io pay-what-you-want donation'));
 assert(r.incompatible_denominators.includes('Steam key activation offstore'));
 assert.equal(r.channel_terms.itchio.actual_seller_payout,null);
 assert.equal(r.channel_terms.steam.payout_actual,null);
 assert.throws(()=>comparePublicChannels({name:'Steam',entryFee:-1},{name:'itch.io',entryFee:0}),/Invalid/);
});
test('Source integrity and original 293 tasks',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,10);assert.equal(r.claim_ids.length,14);
 for(const s of r.source_ids)assert(ids.has(s),s);
 for(const id of r.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
