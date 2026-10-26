// Game bonus entitlement checker based only on documented price thresholds.
// Scenario math; not a way to query or alter itch.io paid purchase state.
const money=x=>Number.isSafeInteger(x)&&x>=0;
export function assessGameBonusOffer({projectMinimumCents,bonusMinimumCents,originalPaymentCents,
  updatedBonusMinimumCents=bonusMinimumCents,rewardQuantity,rewardClaims}){
 if(![projectMinimumCents,bonusMinimumCents,originalPaymentCents,updatedBonusMinimumCents,rewardQuantity,rewardClaims].every(money))
   throw new TypeError('Require explicit nonnegative safe-integer money and quantity values');
 if(bonusMinimumCents<projectMinimumCents||updatedBonusMinimumCents<projectMinimumCents)
   throw new RangeError('Bonus price floor must not undercut the minimum paid-project price');
 if(rewardClaims>rewardQuantity)throw new RangeError('Claims cannot exceed inventory');
 const projectOwned=originalPaymentCents>=projectMinimumCents&&originalPaymentCents>0;
 const initialBonusAccess=projectOwned&&originalPaymentCents>=bonusMinimumCents;
 return {projectOwned,originalBonusAccess:initialBonusAccess,
   updatedBonusAccess:projectOwned&&originalPaymentCents>=updatedBonusMinimumCents,
   bonusAccessLostAfterRepricing:initialBonusAccess&&originalPaymentCents<updatedBonusMinimumCents,
   remainingRewardQuantity:rewardQuantity-rewardClaims,fulfilledRewards:null,
   additionalOrders:null,additionalRevenueCents:null,refundCostCents:null,creatorProfitCents:null,
   actualPaymentVerified:false,hypotheticalOnly:true};
}
