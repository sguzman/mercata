// Hypothetical game-sale unit economics. Not a forecasting model.
// All money is denominated in explicitly supplied USD; result excludes taxes,
// refunds, FX and payout deductions unless modeled outside this calculator.
const amount=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const cents=x=>Math.round((x+Number.EPSILON)*100);
const usd=x=>Math.round(x)/100;
const integer=x=>Number.isSafeInteger(x)&&x>=0;
export function modelGameBreakEven({priceUsd,itchShareRate,processorPercentRate,
  processorFixedUsd,cashDevelopmentCostsUsd,valuedLaborHours,valuedLaborHourlyUsd,
  additionalFixedCashCostsUsd,targetPretaxSurplusUsd}){
 const money=[priceUsd,processorFixedUsd,cashDevelopmentCostsUsd,
   valuedLaborHourlyUsd,additionalFixedCashCostsUsd,targetPretaxSurplusUsd];
 if(!money.every(amount)||!amount(itchShareRate)||!amount(processorPercentRate)||
   itchShareRate>1||processorPercentRate>1||!amount(valuedLaborHours))
   throw new TypeError('Every assumption must be explicit, nonnegative and finite; fee rates must be at most one');
 if(priceUsd<=0)throw new RangeError('Positive price required for paid-sale break-even');
 const price=cents(priceUsd),platformFee=Math.round(price*itchShareRate);
 const processing=Math.round(cents(processorFixedUsd)+price*processorPercentRate);
 const contribution=price-platformFee-processing;
 const fixedCash=cents(cashDevelopmentCostsUsd)+cents(additionalFixedCashCostsUsd);
 const valuedLabor=cents(valuedLaborHours*valuedLaborHourlyUsd);
 const target=cents(targetPretaxSurplusUsd);
 const needed=c=>{if(contribution<=0)return null;const n=Math.ceil(c/contribution);return integer(n)?n:null};
 return {unitPriceUsd:usd(price),platformFeePerSaleUsd:usd(platformFee),
  processingPerSaleUsd:usd(processing),preTaxContributionPerSuccessfulSaleUsd:usd(contribution),
  fixedCashCostsUsd:usd(fixedCash),valuedLaborCostsUsd:usd(valuedLabor),
  cashBreakEvenPaidOrders:needed(fixedCash),
  fullCostBreakEvenPaidOrders:needed(fixedCash+valuedLabor),
  paidOrdersForTargetPretaxSurplus:needed(fixedCash+valuedLabor+target),
  targetPretaxSurplusUsd:usd(target),
  revenueForecast:null,conversionRate:null,salesProbability:null,
  refundRate:null,taxLiability:null,fxFees:null,merchantPayoutFees:null,
  empiricalDemandSupport:false,units:'paid_orders_successfully_settled_no_refunds',
  limitations:'Illustrative fee rates and seller expenses. Does not include VAT, refunds, payout fees, FX, income tax or observed demand.'};
}
