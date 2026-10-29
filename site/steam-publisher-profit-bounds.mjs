// Privacy-safe synthetic *profit sign* partial identification, not a payout estimator.
// A verified publisher here requires fully reconciled legal payee, sales, costs and labor.
// Never enter confidential partner identifiers or private ledgers in this public repository.
const statuses=new Set(['complete_reconciled','partial','missing']);
const signs=new Set(['positive','zero','negative']);
export function boundPublisherAfterCostProfitShare({eligiblePublisherCount,records=[],frameComplete=false}={}){
 if(!Number.isSafeInteger(eligiblePublisherCount)||eligiblePublisherCount<1)throw new TypeError('Eligible publisher count must be positive integer');
 if(!Array.isArray(records)||records.length>eligiblePublisherCount)throw new TypeError('Records exceed or lack publisher frame');
 if(typeof frameComplete!=='boolean')throw new TypeError('frameComplete must be boolean');
 let positive=0,zero=0,negative=0,partial=0,missing=0;const seen=new Set();
 for(const record of records){
  if(!record||typeof record.studyId!=='string'||!/^SYN-[A-Za-z0-9_-]{1,40}$/.test(record.studyId)||seen.has(record.studyId))
   throw new TypeError('Unique synthetic studyId required');
  seen.add(record.studyId);
  if(!statuses.has(record.ledger_status))throw new TypeError('Unknown ledger status');
  if(record.ledger_status==='complete_reconciled'){
   if(!signs.has(record.after_cost_profit_sign))throw new TypeError('Complete record must have profit sign');
   const attest=['permissioned_financial_reporting','all_partner_contracts_and_title_transfers_reconciled','all_development_support_and_overhead_costs_reconciled','labor_and_opportunity_costs_reconciled','common_horizon_and_currency_reconciled'];
   if(attest.some(key=>record[key]!==true))throw new TypeError('Complete profit requires finance, contract, cost, labor, horizon attestations');
   if(record.after_cost_profit_sign==='positive')positive++;
   else if(record.after_cost_profit_sign==='negative')negative++;
   else zero++;
  }else{
   if(record.after_cost_profit_sign!==null&&record.after_cost_profit_sign!==undefined)throw new TypeError('Incomplete cost and income cannot attest profit sign');
   if(record.ledger_status==='partial')partial++;else missing++;
  }
 }
 const unresolved=eligiblePublisherCount-positive-negative-zero;
 const lower=frameComplete?positive/eligiblePublisherCount:null;
 const upper=frameComplete?(positive+unresolved)/eligiblePublisherCount:null;
 return {kind:'hypothetical_full_publisher_frame_not_actual_income',
  frame_complete_attested:frameComplete,eligible_publishers:eligiblePublisherCount,observed_complete_positive:positive,
  observed_complete_zero:zero,observed_complete_negative:negative,partial_records:partial,missing_records:missing,unrepresented_publishers:eligiblePublisherCount-records.length,
  unresolved_profit_sign:unresolved,positive_share_lower_bound:lower,positive_share_upper_bound:upper,
  exact_positive_share:frameComplete&&unresolved===0?lower:null,
  median_profit_dollars:null,mean_profit_dollars:null,actual_publisher_profitability_estimate:null,
  caveat:'Finite-population logical bounds only for a complete unique publisher frame; no actual Steam publisher earnings, costs, response propensities or financial statements were observed.'};
}
