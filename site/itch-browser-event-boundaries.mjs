// One public 30-day snapshot, no client events, cross-user joins, or paid conversion inference.
const integer=x=>Number.isSafeInteger(x)&&x>=0;
export function auditBrowserPaymentEventBoundaries({pageViews,browserPlays,downloads,paymentEvents,paymentTotalUsd,mandatoryPrice}={}){
 if(![pageViews,browserPlays,downloads,paymentEvents].every(integer)||
    typeof paymentTotalUsd!=='number'||!Number.isFinite(paymentTotalUsd)||paymentTotalUsd<0||
    typeof mandatoryPrice!=='boolean')throw new TypeError('Explicit nonnegative public event counts and offer type required');
 return Object.freeze({
  browserPlayEventsPer100PageViewEvents:pageViews?Number((100*browserPlays/pageViews).toFixed(2)):null,
  paymentEventsReported:paymentEvents,reportedPaymentGrossUsd:paymentTotalUsd,
  gameAccessMode:mandatoryPrice?'mandatory_price':'free_or_name_your_price',
  identifiableUniqueViewers:null,uniquePaidBuyers:null,mandatoryPricePaidOrders:null,
  verifiedPurchaseConversion:null,verifiedCausalAttribution:false,
  eventRatioIsPersonConversion:false,
  note:'Event totals without linked distinct visitors and retained paid orders cannot calculate paid conversion.'
 });
}
