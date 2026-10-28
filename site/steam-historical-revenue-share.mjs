// Pure, illustrative 2018 marginal Steam split. This is NOT an invoice, signed
// contract, historical payout, or a prediction of developer profits.
const LIMIT10=1_000_000_000, LIMIT50=5_000_000_000;
export function calculateHistoricalSteamShare(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||
   Object.keys(input).sort().join('|')!=='basis|policy|revenueCents'||
   input.basis!=='hypothetical_adjusted_qualified_revenue_cents'||
   input.policy!=='valve_announced_2018'||
   !Number.isSafeInteger(input.revenueCents)||input.revenueCents<0)
   throw new TypeError('Expected nonnegative hypothetical adjusted qualified revenue in integer cents, under the named historical policy');
 const n=input.revenueCents;
 const shares=[
  {cents:Math.min(n,LIMIT10),rate:0.70},
  {cents:Math.max(0,Math.min(n,LIMIT50)-LIMIT10),rate:0.75},
  {cents:Math.max(0,n-LIMIT50),rate:0.80}
 ];
 const publisherCents=shares.reduce((sum,s)=>sum+Math.round(s.cents*s.rate),0);
 return Object.freeze({
  inputAdjustedQualifiedRevenueCents:n,
  hypotheticalHistoricalPublisherShareCents:publisherCents,
  hypotheticalHistoricalValveShareCents:n-publisherCents,
  currentlySignedContractConfirmed:false,
  actualMerchantPaymentCents:null,
  actualNetAfterWithholdingAndCostsCents:null,
  actualDeveloperProfitCents:null,
  rounding:'illustrative nearest cent per marginal bracket; not authenticated Valve rounding'
 });
}
