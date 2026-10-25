// Explicit-entry monthly liquidity accounting. No defaults for observed amounts.
const currencyKeys=['platform_posted_net','platform_issued','platform_bank_received',
'sponsor_cash_received','affiliate_cash_received','merch_cash_received','other_non_youtube_cash_received',
'refunds_paid','production_cash_paid','marketing_cash_paid','admin_cash_paid'];
const hoursKeys=['hours_production','hours_marketing','hours_admin'];
const cents=(v,id)=>{
 if(!Number.isFinite(v)||v<0)throw Error('Missing or negative money: '+id);
 const c=Math.round(v*100);
 if(!Number.isSafeInteger(c)||Math.abs(v*100-c)>1e-6)throw Error('Money needs at most two decimals: '+id);
 return c;
};
const money=c=>c/100;
const number=(v,id)=>{
 if(!Number.isFinite(v)||v<0)throw Error('Missing or negative quantity: '+id);
 return v;
};
const monthIndex=v=>{
 if(typeof v!=='string'||!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(v))throw Error('Invalid ISO month');
 const [y,m]=v.split('-').map(Number);return y*12+m-1;
};
export function evaluateMonthlyCreatorCashFlow(config,entries,paymentGates){
 if(!config||!Array.isArray(entries)||entries.length===0||!paymentGates?.currencies)
  throw Error('Explicit account, months and payment rules required');
 if(!/^[A-Z]{3}$/.test(config.currency||''))throw Error('Invalid ISO reporting currency');
 const record=paymentGates.currencies.find(x=>x.account_currency===config.currency);
 if(!record)throw Error('Unregistered payment-account currency (never convert thresholds by viewer geography)');
 const threshold=cents(record.minimum_payout,'minimum_payout');
 if(threshold<=0)throw Error('Invalid threshold');
 let balance=cents(config.opening_platform_balance,'opening_platform_balance');
 let pending=cents(config.opening_issued_not_received,'opening_issued_not_received');
 let cash=cents(config.opening_cash_balance,'opening_cash_balance');
 let previous=null;
 const rows=[];
 for(const entry of entries){
  const index=monthIndex(entry?.month);
  if(previous!==null&&index!==previous+1)throw Error('Months must be consecutive and ordered');
  previous=index;
  if(typeof entry.payment_hold!=='boolean')throw Error('Explicit payment_hold required');
  if(!Number.isSafeInteger(entry.published_video_count)||entry.published_video_count<0)
   throw Error('Published videos must be whole and nonnegative');
  const v=Object.fromEntries(currencyKeys.map(k=>[k,cents(entry[k],k)]));
  const labor=Object.fromEntries(hoursKeys.map(k=>[k,number(entry[k],k)]));
  const openingPlatform=balance,openingPending=pending,openingCash=cash;
  balance+=v.platform_posted_net;
  if(!Number.isSafeInteger(balance))throw Error('Balance overflow');
  const eligible=!entry.payment_hold&&balance>=threshold;
  if(v.platform_issued>0&&(!eligible||v.platform_issued<threshold||v.platform_issued>balance))
   throw Error('Recorded standard issuance incompatible with payment balance, threshold or hold');
  balance-=v.platform_issued;pending+=v.platform_issued;
  if(v.platform_bank_received>pending)throw Error('Bank deposit exceeds issued transfers');
  pending-=v.platform_bank_received;
  const external=v.sponsor_cash_received+v.affiliate_cash_received+v.merch_cash_received+v.other_non_youtube_cash_received;
  const paid=v.refunds_paid+v.production_cash_paid+v.marketing_cash_paid+v.admin_cash_paid;
  const change=v.platform_bank_received+external-paid;
  cash+=change;
  if(![balance,pending,external,paid,change,cash].every(Number.isSafeInteger))
   throw Error('Account balance overflow');
  const laborHours=labor.hours_production+labor.hours_marketing+labor.hours_admin;
  if(!Number.isFinite(laborHours))throw Error('Hours overflow');
  rows.push({month:entry.month,currency:config.currency,
   opening_platform_balance:money(openingPlatform),platform_finalized_posted:money(v.platform_posted_net),
   cutoff_eligible_to_issue:eligible,payment_hold:entry.payment_hold,
   platform_issued:money(v.platform_issued),closing_platform_balance:money(balance),
   opening_issued_in_transit:money(openingPending),platform_bank_received:money(v.platform_bank_received),
   closing_issued_in_transit:money(pending),external_cash_received:money(external),
   refunds_and_expenses_paid:money(paid),opening_cash_balance:money(openingCash),
   monthly_net_cash_movement:money(change),closing_cash_balance:money(cash),
   published_video_count:entry.published_video_count,labor_hours:laborHours,
   net_accrual_profit:null,actual_creator_hourly_wage:null,
   kind:'explicit_operator_entries_only'});
 }
 return {currency:config.currency,standard_payout_threshold:money(threshold),rows,
  closing_platform_balance:money(balance),closing_issued_in_transit:money(pending),
  closing_cash_balance:money(cash),kind:'cash_account_reconciliation_not_income_estimate',
  creator_income_distribution:null,verified_creator_profit:null};
}
