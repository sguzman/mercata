// Records real or explicitly hypothetical effort; never predicts unmeasured setup duration.
export const commonStages=Object.freeze(['account_security','rights_and_build','QA_and_package','store_page','price_and_access','publish_and_check']);
const extraStages=Object.freeze({free:[],direct:['connect_provider','direct_checkout_checks'],collected:['tax_interview','payout_configuration']});
const money=n=>Math.round((n+Number.EPSILON)*100);
export function assessFirstPublisherEffort({mode,records=[],hourlyValueUsd=null,readiness={}}={}){
 if(!Object.hasOwn(extraStages,mode)||!Array.isArray(records))throw new TypeError('Mode or records invalid');
 if(hourlyValueUsd!==null&&!(typeof hourlyValueUsd==='number'&&Number.isFinite(hourlyValueUsd)&&hourlyValueUsd>=0))throw new TypeError('Invalid hourly valuation');
 const required=[...commonStages,...extraStages[mode]],seen=new Set(),values=new Map();
 for(const entry of records){
  if(!entry||!required.includes(entry.stage)||seen.has(entry.stage))throw new TypeError('Unknown or duplicate stage');
  seen.add(entry.stage);
  if(entry.minutes===null||entry.minutes===undefined||entry.externalCashUsd===null||entry.externalCashUsd===undefined)continue;
  if(!Number.isSafeInteger(entry.minutes)||entry.minutes<0||typeof entry.externalCashUsd!=='number'||
   !Number.isFinite(entry.externalCashUsd)||entry.externalCashUsd<0||!Number.isSafeInteger(money(entry.externalCashUsd)))throw new TypeError('Invalid minutes or cash');
  values.set(entry.stage,entry);
 }
 const missing=required.filter(id=>!values.has(id));
 const complete=missing.length===0;
 let minutes=0,cents=0;
 if(complete)for(const entry of values.values()){minutes+=entry.minutes;cents+=money(entry.externalCashUsd);}
 const gates=['termsAccepted','distributionRightsVerified','gameTested','pageAccessible',
  ...(mode==='free'?[]:['sellerCountryAndProviderEligible','taxIdentityVerified','checkoutTested'])];
 for(const g of gates)if(readiness[g]!==undefined&&readiness[g]!==null&&typeof readiness[g]!=='boolean')throw new TypeError('Invalid gate '+g);
 const unresolved=gates.filter(g=>readiness[g]!==true);
 const laborUsd=complete&&hourlyValueUsd!==null?money(minutes/60*hourlyValueUsd):null;
 return {mode,requiredStages:required,missingStages:missing,
  measuredInputCoverageComplete:complete,personHours:complete?minutes/60:null,
  externalUpfrontCashUsd:complete?cents/100:null,
  valuedLaborUsd:laborUsd===null?null:laborUsd/100,
  combinedCostsUsd:laborUsd===null?null:(cents+laborUsd)/100,
  platformFreePageListingFeeUsd:0,
  conditionalCollectedPayoutAccountAdjustmentUsd:mode==='collected'?3:0,
  conditionalAdjustmentIsAnUpfrontListingFee:false,
  unresolvedGates:unresolved,readyAccordingToInputs:complete&&unresolved.length===0,
  actualBankPayoutUsd:null,firstTimeSellerSuccessRate:null,typicalSetupHours:null,
  calendarTimeToPublicListing:null,eligibleSellerPopulationByCountry:null};
}
