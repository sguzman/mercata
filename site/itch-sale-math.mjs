// Hypothetical itch.io proceeds calculation. Never label as observed revenue or profit.
const ok=(x)=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const round=(x)=>Math.round((x+Number.EPSILON)*100)/100;
export function estimateSale({buyerPayment,platformShareRate,processorFixed,processorRate}){
 if(![buyerPayment,platformShareRate,processorFixed,processorRate].every(ok))
  throw new TypeError('All transaction inputs must be explicit, nonnegative finite numbers');
 if(platformShareRate>1||processorRate>1)
  throw new RangeError('Fee rates must be fractions between zero and one');
 const platform=round(buyerPayment*platformShareRate);
 const processing=round(processorFixed+buyerPayment*processorRate);
 const proceeds=round(buyerPayment-platform-processing);
 return {buyerPayment,platformShare:platform,processorFee:processing,
  proceedsBeforeOtherCosts:proceeds,netProfit:null,taxLiability:null,
  payoutAvailable:null,refunds:null,currency:null,exampleOnly:true};
}
