import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/developer-operated-site-revenue-cases-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('First-party early access case refuses to equate net label with bank pay or profit',()=>{
 const a=x.cases.find(y=>y.id==='owl_loki_2025_first_ea'),r=a.reported;
 assert.equal(r.gross_units_sold,370);assert.equal(r.units_returned,18);assert.equal(r.net_steam_revenue_label_usd,619);
 assert(r.parttime_hours_per_week_low<=r.parttime_hours_per_week_high);
 assert.equal(a.assumptions.payment_after_revenue_share_verified,false);
 assert.equal(a.verified_publisher_bank_receipts_usd,null);
 assert.equal(a.developer_after_cost_profit_usd,null);
});
test('Cross-store original author totals reconcile but settlement windows prohibit payout-ratio comparison',()=>{
 const a=x.cases.find(y=>y.id==='mixolumia_2021_crossstore'),r=a.reported;
 assert.equal(r.steam_units+r.itch_units,r.all_units);
 assert.equal(r.steam_gross_usd+r.itch_gross_usd,r.all_gross_usd);
 assert.equal(r.steam_bank_credit_claim_usd+r.itch_bank_credit_claim_usd,r.all_bank_credit_claim_usd);
 assert.equal(a.actual_bank_statement_inspected,false);
 assert.equal(a.steam_sales_bank_window_aligned,false);
 assert.equal(a.causal_steam_vs_itch_store_effect,null);
});
test('Disclosure cases never become representative after-cost earnings',()=>{
 assert.equal(x.cases.length,2);
 assert.equal(x.accounting_boundaries.do_not_pool_disclosures_as_population_sample,true);
 assert.equal(x.accounting_boundaries.unqualified_net_revenue_label_not_proven_bank_deposit,true);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Sources claims and fixed 293 Steam tasks remain consistent',()=>{
 const sources=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(id=>sources.has(id)),id);}
 const scores=[...p.detail_tasks.map(v=>v.percent),...q.queues.flatMap(g=>g.tasks.map(v=>v.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
