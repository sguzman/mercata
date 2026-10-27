// Pure local decision helper. No calls, accounts, payments or timers are initiated.
const finite = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const natural = n => Number.isSafeInteger(n) && n >= 0;
const truth = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
const required = ['rightsVerified','qaPassed','sellerPaymentEligible','taxProfileReviewed','dataPermissionVerified','securityReviewed','accurateListingVerified'];
export function evaluateItchPilotGate(input = {}) {
 if (!truth(input)) throw new TypeError('Pilot input must be an object');
 const approved = input.ownerApproval === true;
 const {caps, actual, checks} = input;
 const issues = [];
 if (!approved) return {decision:'blocked_unapproved',canExecute:false,issues:['No owner authorization: external cash and commercial execution remain capped at zero'],maxUnapprovedExternalCashUsd:0,maxUnapprovedCommercialMinutes:0,successClaimPermitted:false,observedMarketIncome:null};
 if (!truth(caps) || !truth(actual) || !truth(checks)) return {decision:'blocked_incomplete',canExecute:false,issues:['Explicit caps, observations and legal/technical checks required'],successClaimPermitted:false,observedMarketIncome:null};
 for(const field of ['externalCashUsd','creatorMinutes','calendarDays','minPageViewEvents','minRetainedOrderEvents']) {
   if (!natural(caps[field]) && !(field === 'externalCashUsd' && finite(caps[field]))) issues.push('Missing or invalid owner-approved cap: '+field);
 }
 for(const field of ['externalCashUsd','creatorMinutes','elapsedDays','eligiblePageViewEvents','paidOrders','refundedOrders']) {
   if (!natural(actual[field]) && !(field === 'externalCashUsd' && finite(actual[field]))) issues.push('Missing or invalid logged observation: '+field);
 }
 for (const field of required) if (checks[field] !== true) issues.push('Missing legal or technical preflight: '+field);
 if (issues.length) return {decision:'blocked_incomplete',canExecute:false,issues,successClaimPermitted:false,observedMarketIncome:null};
 const breaches=[];
 if (actual.externalCashUsd > caps.externalCashUsd) breaches.push('Cash cap reached or exceeded');
 if (actual.creatorMinutes > caps.creatorMinutes) breaches.push('Labor minutes cap exceeded');
 if (actual.elapsedDays > caps.calendarDays) breaches.push('Elapsed calendar cap exceeded');
 if (actual.refundedOrders > actual.paidOrders) breaches.push('Refunds exceed observed paid orders');
 if (breaches.length) return {decision:'stop',canExecute:false,issues:breaches,successClaimPermitted:false,observedMarketIncome:null};
 const retained=actual.paidOrders-actual.refundedOrders;
 const sufficient=actual.eligiblePageViewEvents>=caps.minPageViewEvents && retained>=caps.minRetainedOrderEvents;
 return {decision:sufficient?'thresholds_met_not_profit_verified':'continue_within_capped_scope',canExecute:true,
  issues:[],retainedPositivePriceOrderEvents:retained,eligiblePageViewEvents:actual.eligiblePageViewEvents,
  evidenceThresholdMet:sufficient,successClaimPermitted:false,causalLiftVerified:false,observedMarketIncome:null,
  note:'Owner-supplied aggregates are not independently authenticated. Evidence counts never imply positive profit or causality.'};
}
