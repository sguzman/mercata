import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/pricing-discounts-and-refund-economics-2026.json'),d=read('specimens/steam.json');
test('Steam current refund and discount rules distinguish buyer rights from actual return rates',()=>{
 assert.equal(x.refunds.standard_paid_game_days,14);
 assert.equal(x.refunds.standard_play_hours_exclusive,2);
 assert.equal(x.refunds.actual_refund_rate,null);
 assert.equal(x.discounts.launch.max_percent,40);
 assert.equal(x.discounts.standard.max_percent,95);
 assert.equal(x.discounts.cooldown_days.post_price_increase,30);
 assert.equal(x.discounts.seasonal_release_cooldown_exempt,false);
 assert.equal(x.discounts.seasonal_discount_to_discount_exempt,true);
});
test('Synthetic revenue bridge is not audited publisher proceeds or developer profit',()=>{
 const b=x.synthetic_cash_bridge;
 assert.equal(b.gross_sales_usd,b.assumed_gross_units_sold*b.assumed_uniform_unit_price_usd);
 assert.equal(b.gross_returns_usd,b.assumed_returned_units*b.assumed_uniform_unit_price_usd);
 assert.equal(b.net_sales_after_returns_and_tax_usd,b.gross_sales_usd-b.gross_returns_usd-b.assumed_net_tax_usd);
 assert.equal(b.developer_profit_usd,null);
 assert.equal(b.bank_payout_usd,null);
 assert.equal(x.actual_sales,null);
 assert.equal(x.account_data_accessed,false);
});
test('New public sources and every claim are attributable, with no invented sales facts',()=>{
 const src=new Set(d.evidence.map(e=>e.id));
 assert.equal(x.source_ids.length,9);
 assert.equal(x.claim_ids.length,21);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){const c=d.claims.find(c=>c.id===id);assert(c,id);assert(c.source_ids.every(id=>src.has(id)));}
 const plan=read('plans/steam.json'),queue=read('queues/steam.json');
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(Math.round(scores.reduce((s,n)=>s+n,0)/293),plan.progress_percent);
});
