import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {maxCompatiblePartyCapacity as score} from '../site/steam-match-pool-ceiling.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-concurrency-match-pool-and-hosting-ceilings-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Same global concurrency differs under split incompatible queues',()=>{
 const a=score({concurrentPlayers:8,partySize:4,pools:[{group:'one',ready:8,busy:0}]});
 const b=score({concurrentPlayers:8,partySize:4,pools:[{group:'a',ready:6,busy:0},{group:'b',ready:2,busy:0}]});
 assert.equal(a.upper_bound_complete_party_count,2);
 assert.equal(b.upper_bound_complete_party_count,1);
 assert.equal(b.ready_but_not_groupable_in_any_pool,4);
 assert.equal(b.observed_successful_matches,null);
 assert.equal(b.paid_revenue,null);
});
test('Concurrent app clients can be busy or unclassified and not queue-ready',()=>{
 const a=score({concurrentPlayers:30,partySize:4,pools:[{group:'a',ready:0,busy:10}]});
 assert.equal(a.unclassified_app_players,20);
 assert.equal(a.upper_bound_simultaneously_groupable_ready_players,0);
 assert.equal(a.fraction_of_all_app_players_groupable_upper_bound,0);
 assert.equal(score({concurrentPlayers:0,partySize:2,pools:[]}).fraction_of_all_app_players_groupable_upper_bound,null);
});
test('Only bounded disjoint compatible pools and valid nonnegative integers are allowed',()=>{
 assert.throws(()=>score({concurrentPlayers:3,partySize:4,pools:[{group:'a',ready:4,busy:0}]}),/exceed/);
 assert.throws(()=>score({concurrentPlayers:5,partySize:4,pools:[{group:'a',ready:1,busy:0},{group:'a',ready:1,busy:0}]}),/Unique/);
 assert.throws(()=>score({concurrentPlayers:5,partySize:4,pools:[{group:'a',ready:-1,busy:0}]}),/Nonnegative/);
 assert.throws(()=>score({concurrentPlayers:5,partySize:1,pools:[]}),/from 2/);
});
test('Official provenance joins and scope fixed at 293 tasks',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,8);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(id=>s.has(id)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
