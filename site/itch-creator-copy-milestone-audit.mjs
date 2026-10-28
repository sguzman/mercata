// Public author-announced copy milestones, not settled merchant purchases.
// One offer type per invocation; caller may not infer single-store revenue or unique buyers.
const day=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const integer=n=>Number.isSafeInteger(n)&&n>0;
const keys=(obj,allowed)=>!!obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>allowed.includes(k));
export function auditPublicCopyMilestones(input){
 if(!keys(input,['offerType','milestones'])||!['mandatory_positive_price','free_base_with_paid_full_game_tier'].includes(input.offerType)||
 !Array.isArray(input.milestones)||input.milestones.length<1||input.milestones.length>20||
 !input.milestones.every(m=>keys(m,['reported_at','unit_claim','reported_minimum_copies'])&&
 day(m.reported_at)&&integer(m.reported_minimum_copies)&&
 ['copies_sold_lower_bound','ambiguous_copies_sold_headline'].includes(m.unit_claim))||
 input.milestones.some((m,i)=>i>0&&m.reported_at<=input.milestones[i-1].reported_at))
 throw new TypeError('One valid public offer type with dated and ordered aggregate milestone thresholds is required');
 const milestones=input.milestones.map(m=>Object.freeze({
  reportedAt:m.reported_at,reportedMinimumCopies:m.reported_minimum_copies,
  unitClaim:m.unit_claim,actualCopiesUpperBound:null,
  verifiedItchPaidOrders:null,verifiedRetainedOrders:null,
  verifiedFullGameUnlocks:null,uniquePayingCustomers:null,
  merchantGrossUsd:null,netProceedsUsd:null
 }));
 return Object.freeze({
  offerType:input.offerType,milestones:Object.freeze(milestones),
  observedCopyChangeBetweenMilestones:null,
  validToMultiplyCurrentPriceByReportedCopies:false,
  verifiedPositivePriceGameOrders:null,
  representativeSellerMeanIncome:null,representativeSellerMedianIncome:null,
  zeroSaleSellerFraction:null,causalPromotionUplift:null,
  note:'Copy thresholds, free-game entitlements and optional-payment tiers do not identify completed paid checkout orders or merchant proceeds.'
 });
}
