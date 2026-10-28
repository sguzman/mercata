// Audit public optional-payment reports without imputing paid-title orders or download conversion.
// This function operates only on aggregate public figures; it performs no network requests.
const modes=new Set(['free_pwyw','free_demo_pwyw','mandatory_positive_price']);
export function auditVoluntaryPaymentDenominators({accessMode,reportedUsd,downloadEvents=null,downloadPlatforms=[],receiptPlatform='itch.io',paidOrderCount=null,matchedWindow=false}={}){
 if(!modes.has(accessMode)||typeof reportedUsd!=='number'||!Number.isFinite(reportedUsd)||reportedUsd<0||
  (downloadEvents!==null&&(!Number.isSafeInteger(downloadEvents)||downloadEvents<0))||
  !Array.isArray(downloadPlatforms)||!downloadPlatforms.length||
  downloadPlatforms.some(p=>typeof p!=='string'||!p.trim())||
  new Set(downloadPlatforms).size!==downloadPlatforms.length||
  typeof receiptPlatform!=='string'||!receiptPlatform.trim()||
  (paidOrderCount!==null&&(!Number.isSafeInteger(paidOrderCount)||paidOrderCount<0))||
  typeof matchedWindow!=='boolean')throw new TypeError('Valid public aggregate disclosure and price model required');
 const samePlatform=downloadPlatforms.length===1&&downloadPlatforms[0]===receiptPlatform;
 const mandatory=accessMode==='mandatory_positive_price';
 return Object.freeze({
  claimedUsd:reportedUsd,downloadEventCount:downloadEvents,
  downloadPlatforms:Object.freeze([...downloadPlatforms]),receiptPlatform,accessMode,
  mandatoryPositivePrice:mandatory,
  authorReportedMandatoryPricePaidOrders:mandatory?paidOrderCount:null,
  reportedPaidOrderCountMissing:paidOrderCount===null,
  singleStoreDownloadScope:samePlatform,
  windowAlignmentReported:matchedWindow,
  uniquePayingCustomers:null,uniqueDownloaders:null,
  purchaseConversion:null,netSellerProfit:null,
  invalidForPaidGameDemand:!mandatory,
  invalidForDownloadToPaymentConversion:true,
  absentLinkedUniqueCustomers:true,
  note:'Author-reported orders are not independently verified. Download events are not deduplicated buyers and optional payments are not mandatory game sales; no unique customer conversion is estimated.'
 });
}
