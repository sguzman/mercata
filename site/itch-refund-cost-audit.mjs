const count=x=>Number.isSafeInteger(x)&&x>=0;
const keys=['capturedOrders','fullyRefundedOrders','chargebackOrders','priceCents','platformShareCentsPerRetainedOrder','processingFeeCentsPerCapturedOrder','processingRefundCreditCentsPerFullyRefundedOrder','processingChargebackCreditCentsPerDisputedOrder','platformFeesKeptOnReversalsCents','chargebackFeeCentsPerDispute','cashDevelopmentCostCents','valuedLaborCostCents','merchantPayoutAndFxFeesCents'];
export function reconcileFullRefundChargebackCase(input){
 if(!input||typeof input!=='object'||!keys.every(k=>count(input[k])))throw new TypeError('All thirteen assumptions must be explicit nonnegative safe integers in cents or event counts');
 const {capturedOrders:n,fullyRefundedOrders:r,chargebackOrders:c,priceCents:price,platformShareCentsPerRetainedOrder:platform,processingFeeCentsPerCapturedOrder:processor,processingRefundCreditCentsPerFullyRefundedOrder:creditR,processingChargebackCreditCentsPerDisputedOrder:creditC,platformFeesKeptOnReversalsCents:retainedPlatform,chargebackFeeCentsPerDispute:dispute,cashDevelopmentCostCents:cash,valuedLaborCostCents:labor,merchantPayoutAndFxFeesCents:payout}=input;
 if(r+c>n)throw new RangeError('Full refunds and chargebacks may not overlap or exceed captures');
 if(platform>price)throw new RangeError('Retained-order platform fee exceeds item price');
 if(creditR>processor||creditC>processor)throw new RangeError('Processor credit exceeds original processing charge per capture');
 const kept=n-r-c,gross=n*price,retainedGross=kept*price,processorTotal=n*processor-r*creditR-c*creditC;
 const shareTotal=kept*platform+retainedPlatform,chargebackFees=c*dispute;
 const remaining=retainedGross-processorTotal-shareTotal-chargebackFees-payout;
 for(const x of [gross,retainedGross,processorTotal,shareTotal,chargebackFees,remaining,remaining-cash-labor])if(!Number.isSafeInteger(x))throw new RangeError('Money overflow');
 return {capturedOrders:n,retainedPaidOrders:kept,fullyRefundedOrders:r,chargedBackOrders:c,capturedGrossCents:gross,retainedGrossCents:retainedGross,platformFeesCents:shareTotal,processorFeesNetCents:processorTotal,chargebackFeesCents:chargebackFees,
  pretaxCashAfterTransactionAndPayoutCostsCents:remaining,afterExplicitCashAndValuedLaborCents:remaining-cash-labor,
  representativeRefundRate:null,representativeChargebackRate:null,sellerPopulationMedianIncome:null,buyerConversionRate:null,empiricalDemandForecast:null,
  note:'Hypothetical full-reversal case; payment provider terms, taxes, payout arrangements and real incidence remain unknown.'};
}
