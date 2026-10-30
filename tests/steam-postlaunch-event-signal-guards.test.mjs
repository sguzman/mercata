import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {classifySteamPostlaunchSignal,auditSyntheticSteamEventAttention as audit} from "../site/steam-postlaunch-event-signal-guards.mjs";
const get=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const study=get("ontology/steam/steam-postlaunch-event-attention-versus-player-retention-2026.json"),
 dossier=get("specimens/steam.json"),plan=get("plans/steam.json"),queue=get("queues/steam.json");
test("Steam event traffic types never masquerade as gameplay retention or paid checkout",()=>{
 assert.equal(classifySteamPostlaunchSignal("utm_returning_store_visitor").attention_only,true);
 assert.equal(classifySteamPostlaunchSignal("event_impression").unit,"unique_logged_in_user_event_visibility");
 assert.equal(classifySteamPostlaunchSignal("event_read").actual_paid_orders,null);
 assert.equal(classifySteamPostlaunchSignal("verified_return_play").attention_only,false);
 assert.equal(classifySteamPostlaunchSignal("verified_paid_checkout").developer_profit,null);
 assert.throws(()=>classifySteamPostlaunchSignal("returning_paying_player"),/Unknown/);
});
test("Offsite reads can exceed impressions, without an invalid sales conversion ratio",()=>{
 let v=audit({fixture_id:"fixture-direct-outside",logged_in_impressions:3,logged_in_reads:8});
 assert.equal(v.reads_over_impressions_possible,true);
 assert.equal(v.reads_to_impressions_purchase_conversion,null);
 assert.equal(v.actual_paid_orders,null);assert.equal(v.actual_retained_players,null);
 assert.equal(audit({fixture_id:"fixture-zero",logged_in_impressions:0,logged_in_reads:0}).developer_profit,null);
});
test("Synthetic attention classifier rejects private fields and invalid counters",()=>{
 let x={fixture_id:"fixture-example",logged_in_impressions:5,logged_in_reads:2};
 for(const extras of [{account_id:"abc"},{actual_paid_orders:2},{private_session_id:"xyz"}])
  assert.throws(()=>audit({...x,...extras}),/synthetic/);
 assert.throws(()=>audit({...x,logged_in_reads:1.5}),/count/);
 assert.throws(()=>audit({...x,logged_in_impressions:-1}),/count/);
 assert.throws(()=>audit({...x,logged_in_impressions:Number.MAX_SAFE_INTEGER+1}),/count/);
 assert.throws(()=>audit(["fixture-example",3,5]),/synthetic/);
});
test("Two dated official-document source groups and 293 baseline tasks remain linked",()=>{
 const s=new Set(dossier.evidence.map(e=>e.id)), c=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(s.has(id),id);
 for(const id of study.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(t=>s.has(t)));}
 assert.equal(study.google_analytics.exact_steam_support_end_date,null);
 assert.equal(study.event_attention.reads_may_exceed_impressions,true);
 assert.equal(study.event_attention.event_read_to_paid_sale_conversion_identifiable,false);
 assert(Object.values(study.unknown).every(x=>x===null));
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
