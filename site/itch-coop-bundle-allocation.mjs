// Hypothetical collected-mode co-op bundle allocation of an explicitly provided
// distributable pool. It does not estimate buyer spend, marketplace fees or sales.
const money=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function allocateCoopBundlePool({distributableUsd,paymentMode,participants}={}){
 if(!money(distributableUsd)||distributableUsd>Number.MAX_SAFE_INTEGER/100)
  throw new TypeError('Provide finite nonnegative distributable cash');
 if(paymentMode!=='collected_by_itch')throw new TypeError('A co-op bundle requires collected payout mode');
 if(!Array.isArray(participants)||participants.length<2)
  throw new TypeError('A co-op bundle needs at least two project-owning recipients');
 const ids=new Set();
 for(const p of participants){
  if(!p||typeof p.id!=='string'||!p.id.trim()||ids.has(p.id)||
   !money(p.weight)||p.weight<=0||p.payoutEligible!==true)
   throw new TypeError('Unique project-owning recipients with positive weight and payout eligibility are required');
  ids.add(p.id);
 }
 const total=participants.reduce((n,p)=>n+p.weight,0);
 if(!Number.isFinite(total)||total<=0)throw new TypeError('Invalid weights');
 const available=Math.round((distributableUsd+Number.EPSILON)*100);
 const parts=participants.map((p,i)=>{
  const exact=available*(p.weight/total);
  const floor=Math.floor(exact);
  return {id:p.id,weight:p.weight,allocationCents:floor,remainder:exact-floor,index:i};
 });
 let remainder=available-parts.reduce((n,p)=>n+p.allocationCents,0);
 for(const p of [...parts].sort((a,b)=>b.remainder-a.remainder||a.id.localeCompare(b.id)).slice(0,remainder))
  p.allocationCents++;
 return {paymentMode:'collected_by_itch',distributablePoolUsd:available/100,
  shares:parts.sort((a,b)=>a.index-b.index).map(p=>({id:p.id,weight:p.weight,allocationUsd:p.allocationCents/100})),
  totalAllocatedUsd:available/100,actualBundleOrders:null,actualGrossBuyerSpend:null,
  actualPayoutSettlements:null,payoutTransferFeesUsd:null,refundsNotIncludedInSuppliedPool:true,
  assumptions:'Input is distributable funds after separately determined taxes, refunds, processing and marketplace share. Relative weights are not percentages or item sales.'};
}
