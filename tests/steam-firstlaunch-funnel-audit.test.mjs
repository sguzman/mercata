import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditFirstGameFunnelCase as audit} from '../site/steam-firstlaunch-funnel-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/first-commercial-launch-paid-funnel-case-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Launch windows and conditional refunded share reconstruct the author reports',()=>{
 const r=audit(x.case.reported);
 assert(Math.abs(r.day_copy_share_of_first_week-1248/3091)<1e-12);
 assert(Math.abs(r.week_copy_share_of_first_month-3091/4810)<1e-12);
 assert(Math.abs(r.week_gross_share_of_first_month-19851/35862)<1e-12);
 assert.equal(r.stated_later_total_units_assuming_disjoint_retained_and_returned,10368);
 assert(Math.abs(r.reported_returned_share_conditional_on_disjoint_unit_interpretation-1712/10368)<1e-12);
});
test('Descriptive ad campaign ratio is not purchase incrementality or bank payout',()=>{
 const r=audit(x.case.reported);
 assert(Math.abs(r.spend_per_reported_reddit_wishlist_usd-700/237)<1e-12);
 assert(Math.abs(r.reported_reddit_click_to_wishlist_fraction-237/12000)<1e-12);
 assert.equal(r.actual_incremental_paid_orders_from_ads,null);
 assert.equal(r.matched_wishlist_conversion_rate,null);
 assert.equal(r.publisher_after_cost_profit,null);
 assert.equal(x.publication_gates.actual_after_cost_profit_usd,null);
});
test('Guard invalid, negative, inconsistent and overflowing series',()=>{
 const r=x.case.reported;
 assert.throws(()=>audit({...r,first_day_gross_copies:-1}),/nonnegative/);
 assert.throws(()=>audit({...r,first_week_gross_copies:5}),/out of order/);
 assert.throws(()=>audit({...r,first_week_gross_usd:5}),/out of order/);
 assert.throws(()=>audit({...r,later_returned_copies:Number.MAX_SAFE_INTEGER}),/Unsafe sum/);
});
test('Public evidence references and fixed Steam inventory remain consistent',()=>{
 const s=new Set(d.evidence.map(z=>z.id)),claims=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,1);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(sid=>s.has(sid)),id);}
 assert.equal(x.case.post_publication_date_verified,null);
 assert.equal(x.publication_gates.valid_sample_for_platform_median,false);
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
