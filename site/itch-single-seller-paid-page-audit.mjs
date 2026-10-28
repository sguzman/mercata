// Aggregate event audit of one dated first-person paid-asset snapshot.
// Takes no seller identity, buyer record, raw export, or network connection.
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const keys=(v,allowed)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k));
const windows=new Set(['reported_same_first_month','seller_reported_cumulative_varying_release_ages','seller_reported_lifetime_sku_specific_age']);
export function auditOneSellerPaidPageEvents(input={}){
 if(!keys(input,['productCategory','snapshot'])||input.productCategory!=='game_development_assets'|| 
    !keys(input.snapshot,['label','window','pages'])||typeof input.snapshot.label!=='string'||
    !/^[a-z][a-z0-9_]{2,60}$/.test(input.snapshot.label)||!windows.has(input.snapshot.window)||
    !Array.isArray(input.snapshot.pages)||!input.snapshot.pages.length)
   throw new TypeError('One explicitly scoped public asset-page aggregate snapshot is required');
 const {pages}=input.snapshot;
 if(!pages.every(p=>keys(p,['sku','page_view_events','direct_project_payment_events','bundle_entitlements_reported'])&&
      typeof p.sku==='string'&&/^[a-z][a-z0-9_]{1,50}$/.test(p.sku)&&
      integer(p.page_view_events)&&integer(p.direct_project_payment_events)&&
      (p.bundle_entitlements_reported===null||integer(p.bundle_entitlements_reported)))||
    new Set(pages.map(p=>p.sku)).size!==pages.length)
  throw new TypeError('Exact page-view, payment and entitlement event totals required');
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
  snapshotLabel:input.snapshot.label,reportedWindowScope:input.snapshot.window,
  sameTimeAtRiskAcrossDifferentProductAges:input.snapshot.window==='reported_same_first_month'?null:true,
  independentlyVerifiedWindowAlignment:false,canAddAnotherSnapshotAsNewSales:false,
  items:Object.freeze(items),productCategory:'game_development_assets',
  publicNarrativeDescribesOneSeller:true,independentlyVerifiedSellerCount:null,
  directPaymentsReported:totals.payments,pageViewEventsReported:totals.views,
  directPaymentEventsPer100PageViewEvents:totals.views?Number((100*totals.payments/totals.views).toFixed(2)):null,
  representativeGameSellerZeroFraction:null,representativeGameSellerMedianIncome:null,
  independentBuyerConversionRate:null,causalPriceEffect:null,statisticalSignificance:null,
  note:'A single reported snapshot of selected products belonging to one seller; no matched buyer conversion, independent publisher sampling, bundle-as-direct-sale, or longitudinal addition.'
 });
}
