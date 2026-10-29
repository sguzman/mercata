import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamDeveloperChannelReport as audit} from '../site/steam-developer-launch-channel-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-firstmonth-festival-creator-bundle-window-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Festival impressions and store visits yield only an exposure-side descriptive ratio',()=>{
 const a=audit(study.self_report);
 assert.equal(a.first_month_units_reported,2325);assert.equal(a.first_month_gross_usd_reported,12467);
 assert.equal(a.event_visit_to_impression_arithmetic_ratio,1700/158000);
 assert.equal(a.festival_visits_are_incremental_buyers,false);assert.equal(a.verified_festival_purchase_rate,null);
});
test('Creator outreach, free review keys, video views and bundle exposure do not convert into sold orders',()=>{
 const a=audit(study.self_report);
 assert.equal(a.author_contacted_creators,170);assert.equal(a.author_activated_review_keys,20);
 assert.equal(a.author_published_creator_videos,7);assert.equal(a.creator_keys_are_paid_game_orders,false);
 assert.equal(a.creator_video_views_are_unique_customers,false);
 assert.equal(a.bundle_snapshot_is_first_month_conversion,false);
 for(const k of ['exact_bundle_orders_first_month','matched_wishlist_purchase_rate','causal_creator_paid_orders','actual_bank_receipt_usd','developer_after_cost_profit'])assert.equal(a[k],null);
});
test('Fraudulent provenance, cross-window assumptions, illegal values and arbitrary private fields fail',()=>{
 const x={...study.self_report,real_publisher_id:'secret'};assert.throws(()=>audit(x),/Only author-published/);
 const y={...study.self_report,bundle_share_same_first_month_window_verified:true};assert.throws(()=>audit(y),/No same-month/);
 const z={...study.self_report,creator_keys_activated:171};assert.throws(()=>audit(z),/Contradictory/);
 const b={...study.self_report,refund_rate_reported_percent_approx:101};assert.throws(()=>audit(b),/Finite percentage/);
 const c={...study.self_report,festival_store_visits_approx:158001};assert.throws(()=>audit(c),/Contradictory/);
});
test('Seven linked claims and original 293-task inventory remain auditable',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,1);assert.equal(study.claim_ids.length,7);
 for(const s of study.source_ids)assert(ss.has(s),s);
 for(const c of study.claim_ids)assert(cc.has(c)&&cc.get(c).source_ids.every(s=>ss.has(s)),c);
 assert(Object.values(study.unknown).every(x=>x===null));
 const vals=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(vals.length,293);assert.equal(p.progress_percent,Math.round(vals.reduce((a,b)=>a+b,0)/293));
});
