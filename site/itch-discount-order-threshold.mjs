// Conditional price mathematics, not an estimate of causal sales uplift.
import {modelGameBreakEven} from './itch-break-even.mjs';
const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function compareGameDiscount({listPriceUsd,discountPercent,itchShareRate,
 processorPercentRate,processorFixedUsd,baselineRetainedPaidOrders,promotionIncrementalCostUsd}={}){
 if(![listPriceUsd,discountPercent,itchShareRate,processorPercentRate,
      processorFixedUsd,promotionIncrementalCostUsd].every(valid)||
   discountPercent>100||itchShareRate>1||processorPercentRate>1||
   !Number.isSafeInteger(baselineRetainedPaidOrders)||baselineRetainedPaidOrders<0)
  throw new TypeError('Explicit valid monetary, fee, discount and paid-order inputs required');
 const common={itchShareRate,processorPercentRate,processorFixedUsd,
  cashDevelopmentCostsUsd:0,valuedLaborHours:0,valuedLaborHourlyUsd:0,
  additionalFixedCashCostsUsd:0,targetPretaxSurplusUsd:0};
 const original=modelGameBreakEven({...common,priceUsd:listPriceUsd});
 const discountedPriceUsd=Math.round(Math.round((listPriceUsd+Number.EPSILON)*100)*
   (1-discountPercent/100))/100;
 const discounted=discountedPriceUsd>0?modelGameBreakEven({...common,priceUsd:discountedPriceUsd}):null;
 const originalContributionCents=Math.round(original.preTaxContributionPerSuccessfulSaleUsd*100);
 const discountContributionCents=discounted?Math.round(discounted.preTaxContributionPerSuccessfulSaleUsd*100):null;
 const targetCents=originalContributionCents*baselineRetainedPaidOrders+
  Math.round((promotionIncrementalCostUsd+Number.EPSILON)*100);
 if(!Number.isSafeInteger(targetCents))throw new RangeError('Unrepresentable cents total');
 const required=discountContributionCents!==null&&discountContributionCents>0?
    Math.ceil(targetCents/discountContributionCents):null;
 if(required!==null&&!Number.isSafeInteger(required))throw new RangeError('Unrepresentable paid-order count');
 return {listPriceUsd:original.unitPriceUsd,discountPercent,discountedPriceUsd,
  fullPriceContributionPerOrderUsd:original.preTaxContributionPerSuccessfulSaleUsd,
  discountedContributionPerOrderUsd:discounted?.preTaxContributionPerSuccessfulSaleUsd??null,
  baselineRetainedPaidOrders,promotionIncrementalCostUsd,
  discountedRetainedOrdersNeededToMatchBaselineContribution:required,
  additionalRetainedOrdersBeyondBaselineNeeded:required===null?null:Math.max(0,required-baselineRetainedPaidOrders),
  discountProducesFreeCheckout:discountedPriceUsd===0,
  actualDiscountConversionEffect:null,realPriceElasticity:null,realSalesObserved:null,
  limitations:'Conditional per-paid-order contribution. Taxes, VAT, FX, additional work, changing demand and refunds outside retained orders are unknown. 100 percent off creates no qualifying paid order.'};
}
