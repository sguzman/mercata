// Descriptive volatility of explicit recorded cash, never creator-income prediction.
// Accept only the output shape produced by evaluateMonthlyCreatorCashFlow.
const bad=s=>{throw Error(s);};
const cents=(v,id)=>{
 if(!Number.isFinite(v))bad('Missing amount: '+id);
 const c=Math.round(v*100);
 if(!Number.isSafeInteger(c)||Math.abs(v*100-c)>1e-6)bad('Invalid cents: '+id);
 return c;
};
const median=values=>{
 const s=[...values].sort((a,b)=>a-b),m=Math.floor(s.length/2);
 return s.length%2?s[m]:(s[m-1]+s[m])/2;
};
const toMonth=v=>{
 if(typeof v!=='string'||!/^\\d{4}-(0[1-9]|1[0-2])$/.test(v))bad('Invalid month');
 const [y,m]=v.split('-').map(Number);
 return y*12+m-1;
};
export function analyzeMonthlyIncomeVolatility(ledger,protocol){
 if(!protocol?.expected_metrics?.length || !ledger || ledger.kind!=='cash_account_reconciliation_not_income_estimate' ||
    !Array.isArray(ledger.rows)||ledger.rows.length<(protocol.minimum_complete_months??3))
    bad('Three or more reconciled months required');
 if(!/^[A-Z]{3}$/.test(ledger.currency||''))bad('Invalid account currency');
 const flow=[],inflows=[],credits=[];
 let prev=null,zeroBank=0,creditNoBank=0,negative=0,noBankRun=0,maxNoBankRun=0,openingCash=null;
 for(const row of ledger.rows){
   const month=toMonth(row.month);
   if(prev!==null&&month!==prev+1)bad('Nonconsecutive months');
   prev=month;
   if(row.currency!==ledger.currency || row.kind!=='explicit_operator_entries_only')bad('Different currency or source');
   const keys=['opening_cash_balance','closing_cash_balance','platform_finalized_posted','platform_bank_received','external_cash_received','refunds_and_expenses_paid','monthly_net_cash_movement'];
   const v=Object.fromEntries(keys.map(k=>[k,cents(row[k],k)]));
   for(const k of ['platform_finalized_posted','platform_bank_received','external_cash_received','refunds_and_expenses_paid'])
     if(v[k]<0)bad('Negative received cash or posted credit');
   if(v.platform_bank_received+v.external_cash_received-v.refunds_and_expenses_paid!==v.monthly_net_cash_movement)
     bad('Monthly cash-flow identity mismatch');
   if(v.opening_cash_balance+v.monthly_net_cash_movement!==v.closing_cash_balance)
     bad('Closing cash identity mismatch');
   if(openingCash!==null&&v.opening_cash_balance!==openingCash)bad('Broken cash continuity');
   openingCash=v.closing_cash_balance;
   const income=v.platform_bank_received+v.external_cash_received;
   if(!Number.isSafeInteger(income))bad('Inflow overflow');
   inflows.push(income);credits.push(v.platform_finalized_posted);flow.push(v.monthly_net_cash_movement);
   if(v.platform_bank_received===0){
     zeroBank++;noBankRun++;maxNoBankRun=Math.max(maxNoBankRun,noBankRun);
     if(v.platform_finalized_posted>0)creditNoBank++;
   }else noBankRun=0;
   if(v.monthly_net_cash_movement<0)negative++;
 }
 if(cents(ledger.closing_cash_balance,'closing_cash_balance')!==openingCash)bad('Ledger closing cash mismatch');
 const n=flow.length,avg=(values)=>values.reduce((a,b)=>a+b,0)/n;
 const mean=avg(inflows),variance=avg(inflows.map(v=>(v-mean)**2));
 if(!Number.isFinite(variance)||variance<0)bad('Variance overflow');
 const sd=Math.sqrt(variance);
 return {kind:'descriptive_liquidity_volatility_not_creator_income',currency:ledger.currency,months:n,
    first_month:ledger.rows[0].month,last_month:ledger.rows[n-1].month,
    cleared_inflow_mean:mean/100,cleared_inflow_median:median(inflows)/100,
    finalized_credit_median:median(credits)/100,
    signed_cash_change_median:median(flow)/100,
    inflow_population_sd:sd/100,inflow_cv:mean>0?sd/mean:null,
    zero_platform_deposit_months:zeroBank,positive_credit_no_platform_deposit_months:creditNoBank,
    longest_no_platform_deposit_streak:maxNoBankRun,negative_net_cash_months:negative,
    actual_creator_profit:null,creator_income_distribution:null,zero_earnings_share:null,
    observations_from_repository:null,causal_statement:null};
}
