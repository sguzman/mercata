import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {evaluateSyntheticSteamPlaytestReset as check} from '../site/steam-playtest-reset-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const artifact=read('ontology/steam/steam-playtest-reset-and-invite-continuity-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const valid=()=>({status:'not_playable',visibility:'hidden',signup_type:'limited',
 friend_invites:'paused',shared_package_with_other_apps:false,
 store_settings_published:true,steamworks_settings_published:true,
 participants:100,waiting_requesters:35,playtest_keys_issued:42});
test('All documented reset requirements allow hypothetical destructive transition',()=>{
 const r=check(valid());
 assert.equal(r.reset_prerequisites_satisfied,true);
 assert.deepEqual(r.blocking_settings,[]);
 assert.equal(r.hypothetical_if_reset.remaining_participant_grants,0);
 assert.equal(r.hypothetical_if_reset.removed_participants,100);
 assert.equal(r.hypothetical_if_reset.removed_waiting_requesters,35);
 assert.equal(r.hypothetical_if_reset.disabled_playtest_product_keys,42);
 assert.equal(r.actual_steam_playtest_reset_performed,false);
 assert.equal(r.actual_paid_base_game_order_conversion,null);
});
test('Every individual operational reset prerequisite blocks without partial effects',()=>{
 const bad=[
  {status:'playable'},{visibility:'visible'},{signup_type:'open'},
  {friend_invites:'enabled'},{shared_package_with_other_apps:true},
  {store_settings_published:false},{steamworks_settings_published:false}
 ];
 for(const patch of bad){
  const r=check({...valid(),...patch});
  assert.equal(r.reset_prerequisites_satisfied,false);
  assert.equal(r.blocking_settings.length,1);
  assert.equal(r.blocking_settings[0],Object.keys(patch)[0]);
  assert.equal(r.hypothetical_if_reset,null);
 }
 assert.equal(check({...valid(),friend_invites:'disabled'}).reset_prerequisites_satisfied,true);
});
test('Reenable without reset, paused invitations and removed keys remain distinct',()=>{
 const r=check(valid());
 assert.equal(r.reenable_without_reset_preserves_existing_grants,true);
 assert.equal(r.simply_marking_not_playable_does_not_revoke_issued_keys,true);
 assert.equal(r.pausing_friend_invites_does_not_expire_pending_invites,true);
 assert.equal(artifact.experimental_friend_invites.minimum_existing_friendship_days,30);
 assert.deepEqual(artifact.experimental_friend_invites.permitted_invites_per_player,[1,2,3]);
});
test('Malformed, negative and private identifiable data are forbidden',()=>{
 for(const patch of [{participants:-1},{waiting_requesters:1.5},
  {playtest_keys_issued:Number.MAX_SAFE_INTEGER+1},{status:'reset'},
  {friend_invites:'active'},{steamworks_settings_published:null}]){
  assert.throws(()=>check({...valid(),...patch}),/safe|permitted|Explicit/);
 }
 assert.throws(()=>check({...valid(),customer_id:'identifier'}),/Permitted/);
 assert.throws(()=>check({...valid(),playtest_key:'key-content'}),/Permitted/);
 assert.throws(()=>check({...valid(),participants:undefined}),/safe/);
});
test('Official source, bounded claims and the fixed Steam 293-task frame reconcile',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(artifact.source_ids.length,1);assert.equal(artifact.claim_ids.length,7);
 for(const id of artifact.source_ids)assert(sources.has(id),id);
 for(const id of artifact.claim_ids){
  assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);
 }
 assert(Object.values(artifact.unknown).every(x=>x===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
