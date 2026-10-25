import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateMonthlyCreatorCashFlow} from '../site/monthly-creator-cash-flow.mjs';
import {analyzeMonthlyIncomeVolatility as analyze} from '../site/monthly-income-volatility.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const [model,gates,dossier]=await Promise.all([load('ontology/youtube/monthly-income-volatility-protocol.json'),load('ontology/youtube/payment-gates.json'),load('specimens/youtube.json')]);
const config={currency:'USD',opening_platform_balance:0,opening_issued_not_received:0,opening_cash_balance:0};
const month=(month,changes={})=>({month,platform_posted_net:0,platform_issued:0,platform_bank_received:0,
 sponsor_cash_received:0,affiliate_cash_received:0,merch_cash_received:0,other_non_youtube_cash_received:0,
 refunds_paid:0,production_cash_paid:0,marketing_cash_paid:0,admin_cash_paid:0,
 hours_production:0,hours_marketing:0,hours_admin:0,published_video_count:0,payment_hold:false,...changes});
test('Public protocol reuses original official sources without inventing recipient data',()=>{
 assert.equal(model.source_ids.length,3);
 assert(model.source_ids.every(id=>dossier.evidence.some(s=>s.id===id)));
 assert.equal(model.minimum_complete_months,3);
 assert.equal(model.authorized_observation_rows.length,0);
 assert(Object.values(model.unknowns).every(x=>x===null));
});
test('Threshold rollover and transit create cash volatility without zero earnings inference',()=>{
 const ledger=evaluateMonthlyCreatorCashFlow(config,[
  month('2026-01',{platform_posted_net:40,production_cash_paid:10}),
  month('2026-02',{platform_posted_net:70,platform_issued:110}),
  month('2026-03',{platform_posted_net:25,platform_bank_received:110,sponsor_cash_received:80,refunds_paid:5,marketing_cash_paid:20})
 ],gates);
 const x=analyze(ledger,model);
 assert.equal(x.months,3);assert.equal(x.zero_platform_deposit_months,2);
 assert.equal(x.positive_credit_no_platform_deposit_months,2);
 assert.equal(x.longest_no_platform_deposit_streak,2);
 assert.equal(x.negative_net_cash_months,1);
 assert.equal(x.cleared_inflow_median,0);
 assert.equal(x.finalized_credit_median,40);
 assert.equal(x.signed_cash_change_median,0);
 assert(Math.abs(x.inflow_cv-Math.sqrt(2))<1e-12);
 assert.equal(x.actual_creator_profit,null);assert.equal(x.zero_earnings_share,null);
});
test('Three zero receipt months have undefined coefficient of variation, not zero risk',()=>{
 const result=evaluateMonthlyCreatorCashFlow(config,[
   month('2026-05',{platform_posted_net:20}),month('2026-06',{platform_posted_net:30}),
   month('2026-07',{platform_posted_net:40})],gates);
 const x=analyze(result,model);
 assert.equal(x.cleared_inflow_mean,0);assert.equal(x.inflow_population_sd,0);
 assert.equal(x.inflow_cv,null);assert.equal(x.positive_credit_no_platform_deposit_months,3);
 assert.equal(x.zero_earnings_share,null);
});
test('Two months, gaps, partial inputs, forged cash identities and incompatible currencies are rejected',()=>{
 const make=()=>evaluateMonthlyCreatorCashFlow(config,[month('2026-01'),month('2026-02'),month('2026-03')],gates);
 const x=make();assert.throws(()=>analyze({...x,rows:x.rows.slice(0,2)},model),/Three or more/);
 assert.throws(()=>analyze({...x,rows:[x.rows[0],{...x.rows[1],month:'2026-04'},x.rows[2]]},model),/Nonconsecutive/);
 assert.throws(()=>analyze({...x,rows:[x.rows[0],{...x.rows[1],currency:'MXN'},x.rows[2]]},model),/Different currency/);
 assert.throws(()=>analyze({...x,rows:[x.rows[0],{...x.rows[1],platform_bank_received:1},x.rows[2]]},model),/identity mismatch/);
 assert.throws(()=>analyze({...x,rows:[x.rows[0],{...x.rows[1],external_cash_received:undefined},x.rows[2]]},model),/Missing amount/);
 assert.throws(()=>analyze({...x,kind:'actual_creator_income'},model),/Three or more/);
});
test('Website documents volatility without reporting fictional earnings',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderMonthlyVolatilityProtocol'));
 assert(app.includes('monthly-income-volatility-protocol.json'));
 assert(app.includes('no payment is not proof of zero earnings'));
});
