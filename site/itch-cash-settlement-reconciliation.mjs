// Explicit scenario accounting; not an actual payout, tax determination or game sale forecast.
import {reconcileFullRefundChargebackCase} from './itch-refund-cost-audit.mjs';
import {assessCollectedPayout} from './itch-collected-payout-check.mjs';
const integer=x=>Number.isSafeInteger(x)&&x>=0;
export function modelSellerSettlement({paymentMode,transactions,withheldTaxCents,reserveHeldCents,review}={}){
 if(paymentMode!=='collected_by_itch'&&paymentMode!=='direct_to_you')throw new TypeError('Explicit payment route required');
 if(!integer(withheldTaxCents)||!integer(reserveHeldCents))throw new TypeError('Withholding and reserve must be nonnegative integer cents');
 const x=reconcileFullRefundChargebackCase(transactions);
 const settlementAfterFees=x.pretaxCashAfterTransactionAndPayoutCostsCents;
 if(withheldTaxCents+reserveHeldCents>Math.max(0,settlementAfterFees))
  throw new RangeError('Do not reserve or withhold more than remaining positive cash');
 const unreserved=settlementAfterFees-withheldTaxCents-reserveHeldCents;
 let payoutRequest=null;
 if(paymentMode==='collected_by_itch'){
  if(!review||typeof review!=='object')throw new TypeError('Collected payout review inputs required');
  payoutRequest=assessCollectedPayout({balanceUsd:Math.max(0,unreserved)/100,
   saleAgeDays:review.saleAgeDays,taxInterviewCompleted:review.taxInterviewCompleted,
   payoutMethodSelected:review.payoutMethodSelected,outstandingRequests:review.outstandingRequests});
 }
 return {paymentMode,transactionResult:x,withheldTaxCents,reserveHeldCents,
  unreservedNetBalanceCents:unreserved,positiveBalanceAvailableForReviewCents:Math.max(0,unreserved),
  sellerOutstandingDebtCents:Math.max(0,-unreserved),
  collectedPayoutReview:payoutRequest,
  couldRequestCollectedPayout:payoutRequest?.could_request_based_on_supplied_conditions??null,
  automaticDirectBankSettlementClaimed:false,realBankTransferCents:null,
  actualWithholdingAndTaxLiabilityVerified:false,sourcePopulationObserved:false,
  notes:'Inputs are hypothetical; available balance and permission to request a payout do not mean money reached a bank. Transaction payout/FX fees must already be included in merchantPayoutAndFxFeesCents; do not deduct them again.'};
}
