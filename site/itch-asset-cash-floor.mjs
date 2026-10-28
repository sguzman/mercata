// Pure hypothetical game-asset cash-floor arithmetic; never a sales forecast.
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function auditAssetCashFloor({monthlySubscriptionEur,assumedGrossEurPerPayment,valuedLaborHours,assumedLaborEurPerHour}={}){
 const values=[monthlySubscriptionEur,assumedGrossEurPerPayment,valuedLaborHours,assumedLaborEurPerHour];
 if(!values.every(valid))throw new TypeError('Explicit nonnegative finite assumptions required');
 const cost=monthlySubscriptionEur+valuedLaborHours*assumedLaborEurPerHour;
 if(!Number.isFinite(cost))throw new RangeError('Cost assumption overflow');
 const floor=target=>{if(assumedGrossEurPerPayment===0)return target===0?0:null;
  const n=Math.ceil(target/assumedGrossEurPerPayment);return Number.isSafeInteger(n)?n:null;};
 return {grossOnlyCashFloorOrders:floor(monthlySubscriptionEur),grossOnlyCashAndLaborFloorOrders:floor(cost),
  totalModeledMonthlyCostEur:cost,cashModeledMonthlyCostEur:monthlySubscriptionEur,
  realAfterFeeContributionEur:null,realBuyerDemand:null,realMerchantProfit:null,
  actualPaidPlayableGameOrders:null,optimisticLowerBoundOnly:true,salesForecast:false,
  productCategory:'game_assets_not_playable_games'};
}
