import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {summarizeSharedCopyFixture} from '../site/steam-family-license-units.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/family-sharing-players-versus-paid-licenses-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('three different family players do not imply three paid copies',()=>{
 const v=summarizeSharedCopyFixture({owned_copies:1,distinct_players:3,concurrent_players:1,fixture_checkout_orders:1});
 assert.equal(v.players_per_owned_copy_in_fixture,3);
 assert.equal(v.unique_real_payers,null);assert.equal(v.refund_adjusted_orders,null);
});
test('simultaneous family play requires enough owned copies',()=>{
 assert.throws(()=>summarizeSharedCopyFixture({owned_copies:1,distinct_players:3,concurrent_players:2,fixture_checkout_orders:1}),/Cannot share/);
});
test('borrowed ownership is temporary and buyer income unknown',()=>{
 assert.equal(x.rules.one_game_copy_two_simultaneous_family_players,false);
 assert.equal(x.api.shared_license_permanent,false);
 assert.equal(x.api.borrower_granted_permanent_backend_rights,false);
 assert(Object.values(x.unobserved).every(y=>y===null));
});
test('source references and 293 task denominator remain unchanged',()=>{
 const ss=new Set(d.evidence.map(e=>e.id)),cc=new Map(d.claims.map(e=>[e.id,e]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,15);
 for(const id of x.source_ids) assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cc.has(id),id);assert(cc.get(id).source_ids.every(s=>ss.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((sum,n)=>sum+n,0)/293));
});
