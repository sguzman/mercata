import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamPublicLaunchWindow as audit} from '../site/steam-public-launch-window-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=read('ontology/steam/steam-monstergirl-first-window-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture=()=>({...doc.public_estimates,release_date:doc.source_steam_release_date,publication_date:doc.source_report_publication_date});
test('Author-described two-week window has unknown cutoff despite 27-day publication lag',()=>{
 const r=audit(fixture());assert.equal(r.publication_lag_days,27);
 assert.equal(r.author_described_window_days,14);assert.equal(r.exact_window_cutoff_documented,false);assert.equal(r.exact_14day_units,null);
});
test('Approximate units, refunds, gross and wishlists do not create net or purchaser cohort estimates',()=>{
 const r=audit(fixture());assert.equal(r.reported_approx_units_less_than,300);
 assert.equal(r.reported_refunds,14);assert.equal(r.reported_approx_preshare_revenue_usd,1500);
 for(const k of ['computed_refund_rate','verified_cohort_conversion','received_net_cash','after_cost_profit','platform_median_publisher_income','real_zero_paid_sale_share'])assert.equal(r[k],null);
});
test('Unstated cutoff, unsupported fields, invalid dates and false merchant verification are rejected',()=>{
 const x=fixture();x.customer_id='secret';assert.throws(()=>audit(x),/Public aggregate/);
 const y=fixture();y.sales_cutoff_date='2026-03-24';assert.throws(()=>audit(y),/precise/);
 const z=fixture();z.publication_date='2026-02-30';assert.throws(()=>audit(z),/Invalid release/);
 const v=fixture();v.refunds_reported=300;assert.throws(()=>audit(v),/Contradictory/);
 const u=fixture();u.independently_verified_financial_records=true;assert.throws(()=>audit(u),/No authenticated/);
});
test('Six claims, new public source and 293 existing tasks all reconcile',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(doc.source_ids.length,1);assert.equal(doc.claim_ids.length,6);
 for(const s of doc.source_ids)assert(ss.has(s));
 for(const c of doc.claim_ids)assert(cc.has(c)&&cc.get(c).source_ids.every(s=>ss.has(s)));
 assert(Object.values(doc.unknown).every(x=>x===null));
 const v=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(z=>z.tasks.map(x=>x.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});
