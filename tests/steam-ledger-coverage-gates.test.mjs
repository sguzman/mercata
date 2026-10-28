import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditLedgerCoverage} from '../site/steam-ledger-coverage.mjs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=j('ontology/steam/permissioned-ledger-coverage-and-zero-identification-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
const rows=[
 {appid:101,eligibility:'eligible_paid_initially',ledger_status:'complete_reconciled',gross_paid_units:0,transfer_history_reconciled:true,authorized_ledger_attested:true,retired:true},
 {appid:102,eligibility:'eligible_paid_initially',ledger_status:'complete_reconciled',gross_paid_units:10,transfer_history_reconciled:true,authorized_ledger_attested:true},
 {appid:103,eligibility:'eligible_paid_initially',ledger_status:'partial',gross_paid_units:0},
 {appid:104,eligibility:'eligible_paid_initially',ledger_status:'missing',gross_paid_units:null},
 {appid:105,eligibility:'eligible_paid_initially',ledger_status:'partial',gross_paid_units:3}
];
test('Synthetic frame has conditional 1/5–3/5 zero-unit bounds, no actual Steam figures',()=>{
 const x=auditLedgerCoverage(rows,{frameComplete:true});
 assert.equal(x.counts.observed_gross_zero,1);
 assert.equal(x.counts.known_gross_nonzero,2);
 assert.equal(x.counts.unknown_zero,2);
 assert.equal(x.counts.retired_eligible,1);
 assert.equal(x.zero_gross_unit_share_lower_conditional,0.2);
 assert.equal(x.zero_gross_unit_share_upper_conditional,0.6);
 assert.equal(x.exact_zero_gross_unit_share,null);
 assert.equal(x.publisher_net_income_median,null);
});
test('Partial positive proves some sales but partial zero never proves zero',()=>{
 const x=auditLedgerCoverage([rows[2],rows[4]],{frameComplete:true});
 assert.equal(x.counts.known_gross_nonzero,1);assert.equal(x.counts.unknown_zero,1);
 assert.equal(x.zero_gross_unit_share_lower_conditional,0);
 assert.equal(x.zero_gross_unit_share_upper_conditional,0.5);
});
test('Incomplete eligible frame or unknown eligibility makes population fractions unreportable',()=>{
 assert.equal(auditLedgerCoverage(rows,{frameComplete:false}).zero_gross_unit_share_upper_conditional,null);
 const more=[...rows,{appid:106,eligibility:'unresolved'}];
 assert.equal(auditLedgerCoverage(more,{frameComplete:true}).zero_gross_unit_share_lower_conditional,null);
});
test('Missing records and incomplete transfer histories cannot claim confirmed zero',()=>{
 assert.throws(()=>auditLedgerCoverage([ {...rows[3],gross_paid_units:0}]),/Missing ledger/);
 assert.throws(()=>auditLedgerCoverage([{...rows[0],transfer_history_reconciled:false}]),/Complete ledgers/);
 assert.throws(()=>auditLedgerCoverage([rows[0],rows[0]]),/duplicate/);
});
test('Claims grounded and no genuine confidential financial records present',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,4);assert.equal(r.claim_ids.length,12);
 for(const id of r.source_ids)assert(s.has(id));
 for(const id of r.claim_ids){assert(c.has(id));assert(c.get(id).source_ids.every(sid=>s.has(sid)));}
 assert.equal(r.sample_state.real_authorized_ledger_reports,0);
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
