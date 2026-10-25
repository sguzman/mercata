import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateMonthlyCreatorCashFlow} from '../site/monthly-creator-cash-flow.mjs';
const get=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const gates=await get('ontology/youtube/payment-gates.json');
const config={currency:'USD',opening_platform_balance:0,opening_issued_not_received:0,opening_cash_balance:0};
const month=(m,o={})=>({month:m,platform_posted_net:0,platform_issued:0,platform_bank_received:0,
 sponsor_cash_received:0,affiliate_cash_received:0,merch_cash_received:0,
 other_non_youtube_cash_received:0,refunds_paid:0,production_cash_paid:0,
 marketing_cash_paid:0,admin_cash_paid:0,hours_production:0,hours_marketing:0,hours_admin:0,
 published_video_count:0,payment_hold:false,...o});
test('Model sources and unknown participant income are retained',async()=>{
 const [p,d]=await Promise.all([get('ontology/youtube/monthly-creator-cash-flow-protocol.json'),get('specimens/youtube.json')]);
 assert(p.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(p.monetary_input_fields.length,11);assert.equal(p.labor_input_fields.length,3);
 assert.equal(p.unmeasured.real_participant_cash_transactions,null);
});
test('Finalized posted amount carries before threshold, then issue and bank receipt occur in distinct months',()=>{
 const result=evaluateMonthlyCreatorCashFlow(config,[
  month('2026-01',{platform_posted_net:40,production_cash_paid:10,hours_production:12,published_video_count:2}),
  month('2026-02',{platform_posted_net:70,platform_issued:110,hours_production:6}),
  month('2026-03',{platform_posted_net:25,platform_bank_received:110,sponsor_cash_received:80,
   refunds_paid:5,marketing_cash_paid:20,hours_marketing:4,published_video_count:1})
 ],gates);
 assert.equal(result.standard_payout_threshold,100);
 assert.equal(result.rows[0].cutoff_eligible_to_issue,false);
 assert.equal(result.rows[0].closing_platform_balance,40);
 assert.equal(result.rows[0].closing_cash_balance,-10);
 assert.equal(result.rows[1].cutoff_eligible_to_issue,true);
 assert.equal(result.rows[1].closing_issued_in_transit,110);
 assert.equal(result.rows[1].monthly_net_cash_movement,0);
 assert.equal(result.rows[2].monthly_net_cash_movement,165);
 assert.equal(result.rows[2].closing_issued_in_transit,0);
 assert.equal(result.rows[2].closing_platform_balance,25);
 assert.equal(result.closing_cash_balance,155);
 assert.equal(result.verified_creator_profit,null);
 assert.equal(result.rows[0].actual_creator_hourly_wage,null);
});
test('Account holds prevent standard issuance but do not erase the balance',()=>{
 const held=month('2026-04',{platform_posted_net:180,payment_hold:true});
 const t=evaluateMonthlyCreatorCashFlow(config,[held,month('2026-05',{platform_issued:180})],gates);
 assert.equal(t.rows[0].cutoff_eligible_to_issue,false);
 assert.equal(t.rows[0].closing_platform_balance,180);
 assert.equal(t.rows[1].cutoff_eligible_to_issue,true);
 assert.equal(t.rows[1].closing_issued_in_transit,180);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[{...held,platform_issued:180}],gates),/Recorded standard issuance/);
});
test('Issued money is not automatically cash and cannot be deposited twice',()=>{
 const t=evaluateMonthlyCreatorCashFlow({...config,opening_platform_balance:110},[
  month('2026-02',{platform_issued:110,sponsor_cash_received:20}),
  month('2026-03',{platform_bank_received:110,affiliate_cash_received:30})
 ],gates);
 assert.equal(t.rows[0].closing_cash_balance,20);
 assert.equal(t.rows[1].closing_cash_balance,160);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[month('2026-03',{platform_bank_received:1})],gates),/exceeds issued/);
});
test('Account currency, precision, omitted data and consecutive months are validated',()=>{
 assert.throws(()=>evaluateMonthlyCreatorCashFlow({...config,currency:'EUR'},[month('2026-01')],gates),/Unregistered/);
 assert.equal(evaluateMonthlyCreatorCashFlow({...config,currency:'MXN'},[
  month('2026-01',{platform_posted_net:1200,platform_issued:1200})],gates).standard_payout_threshold,1200);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow({...config,currency:'MXN'},[
  month('2026-01',{platform_posted_net:100,platform_issued:100})],gates),/Recorded standard issuance/);
 const sample=month('2026-01');
 for(const field of ['platform_posted_net','production_cash_paid','hours_admin','payment_hold']){
  const bad={...sample};delete bad[field];assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[bad],gates));
 }
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[month('2026-01',{platform_posted_net:1.005})],gates),/two decimals/);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[month('2026-01',{published_video_count:1.5})],gates),/whole/);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[sample,month('2026-03')],gates),/consecutive/);
 assert.throws(()=>evaluateMonthlyCreatorCashFlow(config,[month('2026-13')],gates),/ISO/);
});
test('Public dossier links the payment source and does not claim actual income',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderMonthlyCreatorCashFlowProtocol'));
 assert(app.includes('monthly-creator-cash-flow-protocol.json'));
 assert(app.includes('Bank arrival is not the same as issuance'));
});
