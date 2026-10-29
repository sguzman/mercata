import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamExternalDemoConversion as audit} from '../site/steam-external-demo-conversion-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-itch-browser-demo-versus-paid-launch-identification-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Public cross-site browser-demo play events do not identify Steam purchasing users',()=>{
 const r=audit(x.reported);assert.equal(r.itch_browser_demo_events_more_than,20000);
 assert.equal(r.steam_copies_reported,3042);assert.equal(r.steam_gross_usd_reported,37917);
 assert.equal(r.browser_demo_plays_are_unique_users,false);
 assert.equal(r.steam_sales_divided_by_itch_plays_is_verified_upgrade_rate,false);
 assert.equal(r.cross_site_paid_conversion,null);assert.equal(r.incremental_purchases_from_demo,null);
});
test('Wishlist stock growth is not a matched purchase cohort or proof of net income',()=>{
 const r=audit(x.reported);assert.equal(r.steam_launch_wishlist_stock_approx,27000);
 assert.equal(r.steam_later_outstanding_wishlist_stock_approx,31000);
 assert.equal(r.author_described_wishlist_conversion_percent,6);
 assert.equal(r.steam_sales_divided_by_launch_wishlist_stock_is_verified_wishlist_conversion,false);
 for(const k of ['independently_reconciled_steam_wishlist_purchase_rate','net_bank_receipt_usd','after_cost_profit_usd'])assert.equal(r[k],null);
});
test('Raw private fields, invented user linkage, false bank proof and impossible early units fail',()=>{
 const a={...x.reported,steam_user_ids:['a']};assert.throws(()=>audit(a),/Only public/);
 const b={...x.reported,itch_to_steam_user_link_available:true};assert.throws(()=>audit(b),/No unique/);
 const c={...x.reported,paid_bank_receipt_verified:true};assert.throws(()=>audit(c),/No unique/);
 const e={...x.reported,first_day_copies_approx:4000};assert.throws(()=>audit(e),/First-day/);
 const f={...x.reported,author_reported_wishlist_conversion_pct_approx:Infinity};assert.throws(()=>audit(f),/percentage/);
});
test('Single new source, six bounded claims, fixed Steam research inventory remain traceable',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,1);assert.equal(x.claim_ids.length,6);
 for(const sid of x.source_ids)assert(ss.has(sid));
 for(const cid of x.claim_ids)assert(cc.has(cid)&&cc.get(cid).source_ids.every(s=>ss.has(s)));
 assert(Object.values(x.unknown).every(v=>v===null));
 const a=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(a.length,293);assert.equal(p.progress_percent,Math.round(a.reduce((s,v)=>s+v,0)/293));
});
