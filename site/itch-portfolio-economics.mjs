// Conditional arithmetic for a portfolio of game scenarios; not a demand or profitability forecast.
// Units are USD and retained settled paid orders. Refunded orders must be excluded from the count.
import {modelGameBreakEven} from './itch-break-even.mjs';
const nonnegative=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const usdToCents=x=>Math.round((x+Number.EPSILON)*100);
const moneyFromCents=x=>Math.round(x)/100;
export function modelGamePortfolio({games,sharedCashCostsUsd,sharedWorkHours,hourlyLaborRateUsd,targetPretaxSurplusUsd}={}){
 if(!Array.isArray(games)||games.length===0||!games.every(x=>x&&typeof x==='object'))
  throw new TypeError('Provide one or more game scenarios');
 if(![sharedCashCostsUsd,sharedWorkHours,hourlyLaborRateUsd,targetPretaxSurplusUsd].every(nonnegative))
  throw new TypeError('Explicit nonnegative shared costs, labor rate, and target required');
 const gameIds=new Set(),details=[];
 let contributions=0,cashCosts=usdToCents(sharedCashCostsUsd),laborCosts=usdToCents(sharedWorkHours*hourlyLaborRateUsd);
 for(const game of games){
  if(typeof game.id!=='string'||!game.id.trim()||gameIds.has(game.id))throw new TypeError('Unique nonempty game IDs required');
  gameIds.add(game.id);
  const hours=[game.developmentHours,game.qaHours,game.marketingHours,game.localizationHours,game.postLaunchSupportHours];
  const cash=[game.assetCashUsd,game.marketingCashUsd,game.supportCashUsd,game.reversalFeeCashUsd];
  if(!hours.every(nonnegative)||!cash.every(nonnegative)||!Number.isSafeInteger(game.retainedPaidOrders)||game.retainedPaidOrders<0)
   throw new TypeError('Actual or hypothetical orders, hours and direct cash costs must be explicit');
  const workHours=hours.reduce((a,b)=>a+b,0),directCash=cash.reduce((a,b)=>a+b,0);
  const unit=modelGameBreakEven({priceUsd:game.priceUsd,itchShareRate:game.itchShareRate,
   processorPercentRate:game.processorPercentRate,processorFixedUsd:game.processorFixedUsd,
   cashDevelopmentCostsUsd:directCash,valuedLaborHours:workHours,
   valuedLaborHourlyUsd:hourlyLaborRateUsd,additionalFixedCashCostsUsd:0,targetPretaxSurplusUsd:0});
  const receiptCents=usdToCents(unit.preTaxContributionPerSuccessfulSaleUsd)*game.retainedPaidOrders;
  const cashCents=usdToCents(directCash),laborCents=usdToCents(workHours*hourlyLaborRateUsd);
  contributions+=receiptCents;cashCosts+=cashCents;laborCosts+=laborCents;
  details.push({id:game.id,retainedPaidOrders:game.retainedPaidOrders,
   unitContributionBeforeAdditionalCostsUsd:unit.preTaxContributionPerSuccessfulSaleUsd,
   contributionFromRetainedOrdersUsd:moneyFromCents(receiptCents),
   cashCostsUsd:moneyFromCents(cashCents),workHours,
   valuedLaborCostsUsd:moneyFromCents(laborCents),unitContributionCents:usdToCents(unit.preTaxContributionPerSuccessfulSaleUsd)});
 }
 const surplusCents=contributions-cashCosts-laborCosts;
 const gap=Math.max(0,usdToCents(targetPretaxSurplusUsd)-surplusCents);
 return {games:details.map(({unitContributionCents,...game})=>({...game,
  additionalRetainedPaidOrdersIfOnlyThisGameGrows:unitContributionCents>0?Math.ceil(gap/unitContributionCents):null})),
  totalRetainedOrders:details.reduce((n,g)=>n+g.retainedPaidOrders,0),
  beforeAdditionalCostsContributionUsd:moneyFromCents(contributions),
  totalCashCostsUsd:moneyFromCents(cashCosts),totalValuedLaborCostsUsd:moneyFromCents(laborCosts),
  hypotheticalPretaxSurplusUsd:moneyFromCents(surplusCents),
  targetPretaxSurplusUsd:moneyFromCents(usdToCents(targetPretaxSurplusUsd)),
  additionalSurplusNeededUsd:moneyFromCents(gap),
  actualObservedPurchasers:null,actualSalesProbability:null,representativeMarketIncome:null,
  refundRate:null,taxLiability:null,currencyConversionFees:null,realWorldProjection:false,
  assumptions:'Each retainedPaidOrders input is supplied externally, not forecast. Tax, VAT, FX and unknown refund losses are excluded. Explicit reversal fees are additional costs only.'};
}
