// Explicit qualitative payout eligibility. Does not initiate transactions or promise payout timing.
const valid = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
export function assessCollectedPayout({balanceUsd,saleAgeDays,taxInterviewCompleted,payoutMethodSelected,outstandingRequests}={}){
 if(!valid(balanceUsd)||!valid(saleAgeDays)||!Number.isSafeInteger(outstandingRequests)||outstandingRequests<0||
  typeof taxInterviewCompleted!=='boolean'||typeof payoutMethodSelected!=='boolean')
  throw new TypeError('Explicit seller eligibility inputs required');
 const obstacles=[];
 if(balanceUsd<5)obstacles.push('minimum_available_balance_not_met');
 if(saleAgeDays<7)obstacles.push('transaction_wait_not_met');
 if(!taxInterviewCompleted)obstacles.push('tax_interview_not_completed');
 if(!payoutMethodSelected)obstacles.push('no_payout_method');
 if(outstandingRequests>=3)obstacles.push('three_outstanding_requests');
 return {could_request_based_on_supplied_conditions:obstacles.length===0,obstacles,
  minimum_review_days_after_request:7,typical_review_days:[10,14],
  first_time_review_can_take_longer:true,one_time_identity_verification_usd:3,
  transfer_fee_usd:null,refund_adjustments_usd:null,final_bank_amount_usd:null,
  guaranteed_payout_date:null,actual_fraud_or_tax_validation:null};
}
