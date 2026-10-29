import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamRegionalSalesSelfReport as audit} from '../site/steam-regional-selfreport-stage-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-two-week-china-concentration-and-preshare-report-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const f=()=>({...x.reported,release_date:x.publication.release_date,post_date:x.publication.post_date});
test('Reported gross, net and regional sales remain different unverified measures',()=>{
 const r=audit(f());
 assert.equal(r.approximate_gross_units,16500);assert.equal(r.approximate_net_copies,12000);
 assert.equal(r.author_approx_gross_revenue_usd,59000);
 assert.equal(r.author_approx_after_adjustments_before_platform_share_usd,47000);
 assert.equal(r.author_approx_china_sales_share_percent,90);
 assert.equal(r.pre_share_net_is_cash_remittance,false);
 assert.equal(r.difference_in_rounded_unit_totals_is_exact_refund_count,false);
 assert.equal(r.china_sales_share_has_verified_order_denominator,false);
});
test('A two-week post does not supply verified region, publisher profit, or buyer conversion',()=>{
 const r=audit(f());assert.equal(r.days_to_publication,18);
 for(const k of ['region_unit_sales_exact','region_revenue_sales_exact','region_effective_price','verified_refund_rate','matched_wishlist_conversion','incremental_paid_streamer_orders','received_publisher_bank_cash','after_cost_profit','representative_regional_market_split'])assert.equal(r[k],null);
});
test('Invalid data and unsupported private measurements fail closed',()=>{
 const x=f();x.customer_ids=['x'];assert.throws(()=>audit(x),/Only public/);
 const y=f();y.china_share_denominator_defined=true;assert.throws(()=>audit(y),/Unsupported region/);
 const z=f();z.net_copies_approx=17000;assert.throws(()=>audit(z),/Conflicting/);
 const w=f();w.after_adjustments_before_platform_share_usd_approx=60000;assert.throws(()=>audit(w),/Conflicting/);
 const a=f();a.post_date='2026-02-30';assert.throws(()=>audit(a),/chronology/);
 const b=f();b.actual_bank_deposit_verified=true;assert.throws(()=>audit(b),/Unsupported region/);
});
test('Seven bounded claims, an independently new source, fixed 293 task inventory',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,1);assert.equal(x.claim_ids.length,7);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids)assert(cc.has(id)&&cc.get(id).source_ids.every(s=>ss.has(s)),id);
 assert(Object.values(x.unknown).every(z=>z===null));
 const vals=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(vals.length,293);assert.equal(p.progress_percent,Math.round(vals.reduce((a,b)=>a+b,0)/293));
});
