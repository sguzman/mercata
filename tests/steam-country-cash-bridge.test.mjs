import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamCountryCash as audit} from '../site/steam-country-cash-bridge.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-country-store-geo-financial-reporting-boundaries-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Two synthetic monthly country rows reconcile after adjustments and withholding',()=>{
 const rows=x.hypothetical.rows.map(z=>({...z,reportingMonth:x.hypothetical.period}));
 const a=audit({reportingMonth:x.hypothetical.period,rows});
 assert.equal(a.totals.gross_cents,200000);
 assert.equal(a.totals.refunds_and_chargebacks_cents,18000);
 assert.equal(a.totals.tax_adjustments_cents,15000);
 assert.equal(a.totals.net_after_applicable_adjustments_cents,167000);
 assert.equal(a.totals.partner_contract_share_cents,116900);
 assert.equal(a.totals.withholding_cents,4000);
 assert.equal(a.totals.payable_before_bank_fees_cents,112900);
 assert.equal(a.unique_paid_buyers,null);
 assert.equal(a.store_country_is_buyer_physical_location,false);
});
test('Synthetic country guard rejects mixed dates, duplicates and impossible deductions',()=>{
 const base={reportingMonth:'2026-06',storeCountry:'MX',grossCents:10000,refundAndChargebackCents:2000,taxAdjustmentCents:1000,partnerShareBps:7000,withholdingCents:0};
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[base,{...base}]}),/Unique/);
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[{...base,reportingMonth:'2026-07'}]}),/Mixed/);
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[{...base,refundAndChargebackCents:20000}]}),/exceed/);
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[{...base,partnerShareBps:10001}]}),/10000/);
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[{...base,withholdingCents:20000}]}),/Withholding/);
 assert.throws(()=>audit({reportingMonth:'2026-06',rows:[{...base,storeCountry:'MEX'}]}),/two-letter/);
});
test('Source joins and fixed Steam plan remain stable with no actual geographic market data',()=>{
 const s=new Set(d.evidence.map(z=>z.id)),c=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(j=>s.has(j)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
