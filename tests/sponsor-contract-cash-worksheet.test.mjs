import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {reconcileSponsorContract} from '../site/sponsor-contract-cash-worksheet.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const example=(extra={})=>({
 currency:'USD',agreed_gross_fee:1000,invoiced_gross_fee:900,cash_received:700,
 tax_withheld_at_source:50,agent_fee_deducted_before_receipt:20,other_deductions_before_receipt:0,
 negotiation_cash_paid:40,production_cash_paid:100,fulfillment_cash_paid:60,
 admin_cash_paid:0,tax_paid_directly:25,
 negotiation_hours:4,production_hours:10,fulfillment_hours:3,admin_hours:1,
 ...extra
});
test('Source-grounded protocol is an empty explicit-entry worksheet, not an income estimate',async()=>{
 const [p,d]=await Promise.all([read('ontology/youtube/sponsor-contract-cash-worksheet.json'),read('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(s=>s.id));
 assert(p.source_ids.every(id=>ids.has(id)));
 assert.equal(p.real_contract_observations,0);
 assert(Object.values(p.output_unknowns).every(x=>x===null));
});
test('Gross agreement, invoice, deductions, unsettled money and paid costs remain distinct',()=>{
 const x=reconcileSponsorContract(example());
 assert.equal(x.not_yet_invoiced_gross_fee,100);
 assert.equal(x.documented_source_deductions,70);
 assert.equal(x.outstanding_invoiced_balance,130);
 assert.equal(x.paid_nontax_costs,200);
 assert.equal(x.tax_paid_directly,25);
 assert.equal(x.net_cash_movement,475);
 assert.equal(x.recorded_work_hours,18);
 assert.equal(x.source_tax_withheld_not_cash,50);
 assert.equal(x.recognized_accounting_revenue,null);
 assert.equal(x.net_accounting_profit,null);
 assert.equal(x.ultimate_tax_liability,null);
});
test('Tax withholding is never subtracted a second time from cleared cash',()=>{
 const x=reconcileSponsorContract(example({agreed_gross_fee:1000,invoiced_gross_fee:1000,cash_received:900,
 tax_withheld_at_source:100,agent_fee_deducted_before_receipt:0,
 negotiation_cash_paid:0,production_cash_paid:0,fulfillment_cash_paid:0,admin_cash_paid:0,tax_paid_directly:0}));
 assert.equal(x.outstanding_invoiced_balance,0);
 assert.equal(x.net_cash_movement,900);
});
test('Missing, negative, fractional cents, mixed currency and nonnumeric labor are rejected',()=>{
 for(const field of ['cash_received','production_cash_paid','tax_withheld_at_source','negotiation_hours']){
  const x=example();delete x[field];assert.throws(()=>reconcileSponsorContract(x));
 }
 assert.throws(()=>reconcileSponsorContract(example({negotiation_cash_paid:-1})),/invalid money/);
 assert.throws(()=>reconcileSponsorContract(example({production_cash_paid:1.005})),/two-decimal/);
 assert.throws(()=>reconcileSponsorContract(example({currency:'US$'})),/currency/);
 assert.throws(()=>reconcileSponsorContract(example({currency_conversions_applied:true})),/Mixed-currency/);
 assert.throws(()=>reconcileSponsorContract(example({fulfillment_hours:'3'})),/labor hours/);
});
test('Contract and invoice cannot be contradicted by larger invoices or payments',()=>{
 assert.throws(()=>reconcileSponsorContract(example({invoiced_gross_fee:1001})),/Invoice exceeds/);
 assert.throws(()=>reconcileSponsorContract(example({cash_received:900})),/exceed invoice/);
 assert.throws(()=>reconcileSponsorContract(example({other_deductions_before_receipt:150})),/exceed invoice/);
});
test('Zero hours leave an unknown hourly diagnostic, not an invented wage',()=>{
 const x=reconcileSponsorContract(example({negotiation_hours:0,production_hours:0,fulfillment_hours:0,admin_hours:0}));
 assert.equal(x.cash_movement_per_work_hour,null);
 assert.equal(x.representative_youtube_sponsorship_income,null);
});
