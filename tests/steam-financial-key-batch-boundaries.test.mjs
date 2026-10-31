import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticFinancialKeyBatches as audit} from '../site/steam-financial-key-batch-boundaries.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-financial-category-key-batch-2026.json');
const coverage=()=>({verified_first_paid_base_game:true,financial_access_authorized:true,all_pacific_dates_and_pages_complete:true,
 historical_partner_transfers_reconciled:true,paid_package_entitlements_attributed:true,changed_dates_requeried:true});
const row=(row_id,kind,sold,returned,activated,extra={})=>({
 row_id,date:'2025-04-12',kind,package_fixture:kind==='microtransaction'?null:'fixture-package',
 key_request_fixture:kind==='retail_key_activation'?'fixture-batch':null,
 positive_paid_price_attested:kind==='steam_store_package',
 gross_units_sold:sold,gross_units_returned:returned,gross_units_activated:activated,...extra
});
const example=()=>({fixture_id:'fixture-game',window:{start:'2025-04-01',endExclusive:'2025-05-01'},coverage:coverage(),
 rows:[row('fixture-paid','steam_store_package',2,2,0),
 row('fixture-key-a','retail_key_activation',0,0,4),
 row('fixture-key-b','retail_key_activation',0,0,3),
 row('fixture-mtx','microtransaction',4,0,0)]});
test('Refunded paid store packages remain positive gross, with separate keys and in-game purchases',()=>{
 const x=audit(example());
 assert.equal(x.reported_gross_paid_steam_package_units,2);
 assert.equal(x.reported_steam_package_returns,2);
 assert.equal(x.conditional_gross_minus_returns,0);
 assert.equal(x.retail_key_activations_not_steam_store_sales,7);
 assert.equal(x.distinct_key_request_batches,1);
 assert.equal(x.microtransaction_units_not_base_game_checkouts,4);
 assert.equal(x.period_steam_store_paid_order_status,'nonzero');
 assert.equal(x.external_key_paid_purchasers,null);
});
test('A complete fictional zero-store period can contain positive retail key and microtxn activity',()=>{
 const input=example();input.rows=input.rows.filter(r=>r.kind!=='steam_store_package');
 const x=audit(input);
 assert.equal(x.reported_gross_paid_steam_package_units,0);
 assert.equal(x.retail_key_activations_not_steam_store_sales,7);
 assert.equal(x.period_steam_store_paid_order_status,'zero');
 assert.equal(x.marketwide_zero_order_fraction,null);
 assert.equal(x.verified_real_world_paid_order_count,null);
});
test('Missing pages, transfers, financial permission or package mapping never turns an absent row into a known zero',()=>{
 for(const f of ['all_pacific_dates_and_pages_complete','historical_partner_transfers_reconciled','financial_access_authorized','paid_package_entitlements_attributed','changed_dates_requeried']){
  const input=example();input.rows=input.rows.filter(r=>r.kind!=='steam_store_package');input.coverage[f]=false;
  assert.equal(audit(input).period_steam_store_paid_order_status,'unknown',f);
 }
 const partial=example();partial.coverage.all_pacific_dates_and_pages_complete=false;
 assert.equal(audit(partial).period_steam_store_paid_order_status,'nonzero');
 partial.coverage.financial_access_authorized=false;
 assert.equal(audit(partial).period_steam_store_paid_order_status,'unknown');
});
test('Unverified free store packages cannot be relabeled as paid transactions',()=>{
 const input=example();input.rows[0].positive_paid_price_attested=false;
 const x=audit(input);
 assert.equal(x.reported_gross_paid_steam_package_units,0);
 assert.equal(x.has_unresolved_zero_price_package_sales,true);
 assert.equal(x.period_steam_store_paid_order_status,'unknown');
});
test('Reject retail keys disguised as paid sales, unclassified IDs, real app records and duplicate rows',()=>{
 const mutations=[
  a=>a.rows[1].gross_units_sold=7,
  a=>a.rows[1].positive_paid_price_attested=true,
  a=>a.rows[0].gross_units_activated=1,
  a=>a.rows[0].key_request_fixture='fixture-secret',
  a=>a.rows[2].key_request_fixture='hardcoded-secret',
  a=>a.rows[3].package_fixture='fixture-pkg',
  a=>a.rows[0].appid=1489630,
  a=>a.rows[0].date='2026-01-01',
  a=>a.rows.push({...a.rows[0]}),
  a=>a.partner_api_key='private',
  a=>a.coverage.all_pacific_dates_and_pages_complete='yes'
 ];
 for(const change of mutations){const x=example();change(x);assert.throws(()=>audit(x));}
});
test('Published report interpretation linked to existing Valve records and original 293 research tasks',()=>{
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,2);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(id=>sources.has(id)));}
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);
 const t=all.find(x=>x.id==='steam/income/measure-exact-zero-sale-fraction');assert(t);
 for(const path of ['ontology/steam/steam-financial-category-key-batch-2026.md',
  'ontology/steam/steam-financial-category-key-batch-2026.json',
  'site/steam-financial-key-batch-boundaries.mjs',
  'tests/steam-financial-key-batch-boundaries.test.mjs'])assert(t.evidence.includes(path),path);
 assert.equal(p.progress_percent,Math.round(all.reduce((s,t)=>s+(t.percent??t.progress),0)/293));
});
