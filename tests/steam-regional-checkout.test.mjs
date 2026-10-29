import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {summarizeSyntheticRegionalCheckouts} from '../site/steam-regional-checkout.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/regional-price-realization-and-value-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const rows=study.hypothetical.rows;
test('Synthetic realized price differs from current US list price without asserting observed sales',()=>{
 const x=summarizeSyntheticRegionalCheckouts(rows);
 assert.equal(x.gross_paid_units,350);
 assert.equal(x.gross_sales_usd_cents,210000);
 assert.equal(x.returned_paid_units,30);
 assert.equal(x.returns_usd_cents,19000);
 assert.equal(x.net_tax_usd_cents,16000);
 assert.equal(x.net_paid_units,320);
 assert.equal(x.synthetic_net_sales_after_returns_and_taxes_usd_cents,175000);
 assert.equal(x.gross_usd_per_paid_unit,6);
 assert.equal(x.partner_bank_payout,null);
 assert.equal(x.developer_profit,null);
 assert.equal(x.observed_all_market_sales,null);
 assert.equal(x.complete_market_coverage,false);
});
test('Missing sales have nullable averages, not fabricated zero-price global estimates',()=>{
 const x=summarizeSyntheticRegionalCheckouts([]);
 assert.equal(x.gross_usd_per_paid_unit,null);
 assert.equal(x.post_return_tax_usd_per_remaining_unit,null);
 assert.equal(x.unique_paid_buyers,null);
});
test('Reject keys, cross-app bundles, duplicate market periods and unsafe money',()=>{
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([...rows,rows[0]]),/Duplicate/);
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([{...rows[0],sale_channel:'Retail_key_activation'}]),/Only/);
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([{...rows[0],product_scope:'multi_app_bundle'}]),/Only/);
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([{...rows[0],returns_usd_cents:150000}]),/returns exceed/);
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([{...rows[0],net_tax_usd_cents:-1}]),/Nonnegative/);
 assert.throws(()=>summarizeSyntheticRegionalCheckouts([{...rows[0],gross_paid_units:Number.MAX_SAFE_INTEGER+1}]),/Nonnegative/);
});
test('Policy source, boundaries and unchanged plan score are auditable',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,4);
 assert.equal(study.claim_ids.length,18);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)));}
 assert.equal(study.currency_policy.advertised_live_currencies,37);
 assert.equal(study.currency_policy.usd_region_groups.length,4);
 assert.equal(study.unknown.median_order_realization,null);
 const v=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});
