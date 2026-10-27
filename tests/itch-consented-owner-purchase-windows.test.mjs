import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditConsentedItchSalesWindows} from '../site/itch-consented-owner-purchase-windows.mjs';
const row=(n,c,r,g,rg)=>({horizon_days:n,captured_orders:c,refunded_orders:r,captured_gross_cents:g,refunded_gross_cents:rg});
const example=()=>({
 owner_authorized:true,aggregated_only:true,privacy_reviewed:true,redistribution_allowed:true,
 first_positive_price_game_verified:true,other_payment_types_excluded:true,all_refunds_reconciled:true,
 monthly_exports_complete:true,release_utc_day:'2026-01-01',observation_utc_day:'2026-02-01',
 currency:'USD',cumulative:[row(7,5,1,5000,1000),row(30,12,2,12000,2000),null,null]
});
test('Consented cumulative windows return retained orders, never double count periods',()=>{
 const r=auditConsentedItchSalesWindows(example());
 assert.deepEqual(r.horizons.map(x=>x.retained_paid_orders),[4,10,null,null]);
 assert.deepEqual(r.horizons.map(x=>x.retained_gross_before_fees_cents),[4000,10000,null,null]);
 assert.equal(r.raw_transaction_rows_processed,0);
 assert.equal(r.net_settled_cash_cents,null);
 assert.equal(r.representative_platform_mean,null);
});
test('Verified all-zero period is distinct from unknown and immature periods',()=>{
 const a=example();a.cumulative=[row(7,0,0,0,0),row(30,0,0,0,0),null,null];
 const x=auditConsentedItchSalesWindows(a);
 assert.equal(x.horizons[1].retained_paid_orders,0);
 assert.equal(x.horizons[2].retained_paid_orders,null);
});
test('Reject raw IDs, insufficient consent, wrong sale classification, overspecified future, and impossible refunds',()=>{
 const a=example();
 for(const extra of [{email:'private@example.test'},{transaction_id:'private'},{seller_id:'private'},{raw_csv:'private'}])
  assert.throws(()=>auditConsentedItchSalesWindows({...a,...extra}),TypeError);
 for(const field of ['owner_authorized','redistribution_allowed','all_refunds_reconciled','other_payment_types_excluded'])
  assert.throws(()=>auditConsentedItchSalesWindows({...a,[field]:false}),Error);
 assert.throws(()=>auditConsentedItchSalesWindows({...a,release_utc_day:'2026-02-30'}),RangeError);
 assert.throws(()=>auditConsentedItchSalesWindows({...a,observation_utc_day:'2026-01-04'}),RangeError);
 assert.throws(()=>auditConsentedItchSalesWindows({...a,cumulative:[row(7,3,4,3000,2000),null,null,null]}),RangeError);
 assert.throws(()=>auditConsentedItchSalesWindows({...a,cumulative:[row(7,5,0,5000,0),row(30,4,0,4000,0),null,null]}),RangeError);
 assert.throws(()=>auditConsentedItchSalesWindows({...a,cumulative:[null,row(30,4,0,4000,0),null,null]}),RangeError);
});
test('Cited source data remains unknown without owner permission',()=>{
 const d=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/owner-purchase-export-measurement-route-2026.json',import.meta.url),'utf8'));
 const s=JSON.parse(fs.readFileSync(new URL('../specimens/itch-io.json',import.meta.url),'utf8'));
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(d.admin_export_report.fix_reported_by_operator,true);
 assert.equal(d.admin_export_report.universally_verified_for_all_roles,false);
 assert.equal(d.live_merchant_exports_observed,0);
 assert(Object.values(d.marketwide_unknown).every(x=>x===null));
});
