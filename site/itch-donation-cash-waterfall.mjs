// Integer-cent reconciliation for author-disclosed voluntary donations.
// A positive donation on a free game is not a mandatory-price paid game order.
const valid=x=>Number.isSafeInteger(x)&&x>=0;
export function reconcileVoluntaryGameDonation({donationGrossCents,processorFeeCents,platformShareCents,oneTimeTaxIdentityAdjustmentCents,withholdingCents,subsequentCharitableSpendingCents,freeDownloadEvents,viewEvents}={}){
 const values=[donationGrossCents,processorFeeCents,platformShareCents,oneTimeTaxIdentityAdjustmentCents,withholdingCents,subsequentCharitableSpendingCents];
 if(!values.every(valid))throw new TypeError('Explicit nonnegative integer cents required');
 if(viewEvents!==null && !valid(viewEvents))throw new TypeError('Views unknown or nonnegative integer events');
 if(freeDownloadEvents!==null&&!valid(freeDownloadEvents))throw new TypeError('Downloads unknown or nonnegative integer events');
 const due=donationGrossCents-processorFeeCents-platformShareCents-oneTimeTaxIdentityAdjustmentCents-withholdingCents;
 if(due<0||due<subsequentCharitableSpendingCents)throw new RangeError('Provided deductions exceed reported gross or due cash');
 return {grossVoluntaryDonationCents:donationGrossCents,recordedSellerAmountDueCents:due,
   afterSeparateCharitableSpendingCents:due-subsequentCharitableSpendingCents,
   processorFeeCents,platformShareCents,oneTimeTaxIdentityAdjustmentCents,withholdingCents,
   freeDownloadEvents,viewEvents,
   mandatoryPricePaidGameOrders:null,distinctHumanDonors:null,actualFinalTaxLiabilityCents:null,
   projectEconomicProfitCents:null,uniqueVisitToDonationConversion:null,
   accountingBasis:'Self-reported first-month donation and payout deductions; cash due is not audited game profit.'};
}
