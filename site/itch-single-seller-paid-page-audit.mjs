// Event-level comparison for one seller's selected paid asset listings.
// No transaction records, seller/buyer identifiers, network calls or causal inference.
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const keys=(v,allowed)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k));
export function auditOneSellerPaidPageEvents({productCategory,pages}={}){
 if(productCategory!=='game_development_assets'||!Array.isArray(pages)||pages.length===0||
    !pages.every(p=>keys(p,['sku','page_view_events','direct_project_payment_events','bundle_entitlements_reported'])&&
      typeof p.sku==='string'&&/^[a-z][a-z0-9_]{1,50}$/.test(p.sku)&&
      integer(p.page_view_events)&&integer(p.direct_project_payment_events)&&
      (p.bundle_entitlements_reported===null||integer(p.bundle_entitlements_reported)))||
    new Set(pages.map(p=>p.sku)).size!==pages.length)
  throw new TypeError('Exact aggregate paid asset page counts from one seller required');
 const totals=pages.reduce((x,p)=>({views:x.views+p.page_view_events,payments:x.payments+p.direct_project_payment_events}),{views:0,payments:0});
 if(!Number.isSafeInteger(totals.views)||!Number.isSafeInteger(totals.payments))
  throw new RangeError('Unsafe aggregated event count');
 const items=pages.map(p=>Object.freeze({
   sku:p.sku,pageViewEvents:p.page_view_events,directPaymentEvents:p.direct_project_payment_events,
   bundleEntitlements:p.bundle_entitlements_reported,
   directPaymentsPer100PageViewEvents:p.page_view_events?Number((100*p.direct_project_payment_events/p.page_view_events).toFixed(2)):null,
   uniquePageVisitors:null,uniquePayingBuyers:null,independentPaidGameSales:null
 }));
 return Object.freeze({
  items:Object.freeze(items),productCategory:'game_development_assets',independentPublishers:1,
  directPaymentsReported:totals.payments,pageViewEventsReported:totals.views,
  directPaymentEventsPer100PageViewEvents:totals.views?Number((100*totals.payments/totals.views).toFixed(2)):null,
  representativeGameSellerZeroFraction:null,representativeGameSellerMedianIncome:null,
  independentBuyerConversionRate:null,causalPriceEffect:null,statisticalSignificance:null,
  note:'Same-seller page/payment event comparison only; bundle entitlements are not project sales, and event ratios are not unique-buyer conversion.'
 });
}
