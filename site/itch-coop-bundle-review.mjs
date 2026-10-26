// Offline planned consent and share calculator, no API or actual distribution actions.
export function reviewItchCoopBundle(input){
 if(!input||!Array.isArray(input.participants)||!Number.isSafeInteger(input.hypothetical_gross_cents)||input.hypothetical_gross_cents<0)throw new TypeError('Participants and nonnegative hypothetical cents required');
 const x=input.participants;
 if(x.length<2)throw new TypeError('Multi-account cooperative example requires at least two participants');
 const ids=x.map(v=>v.id);
 if(ids.some(id=>typeof id!=='string'||!id.trim())||new Set(ids).size!==ids.length)throw new TypeError('Distinct publisher labels required');
 if(x.some(v=>!Number.isSafeInteger(v.weight)||v.weight<1||!Number.isSafeInteger(v.project_count)||v.project_count<1))throw new TypeError('Positive integer weights and project counts required');
 const reasons=[];
 if(x.some(v=>v.approved!==true))reasons.push('All participants must approve');
 if(x.some(v=>v.eligible_for_collected_payout!==true))reasons.push('All payout recipients must be eligible for collected payouts');
 if(input.single_tier_confirmed!==true)reasons.push('Tier-dependent splits require a separate review');
 const good=reasons.length===0;let allocations=null;
 if(good){
  const totalWeight=x.reduce((n,v)=>n+v.weight,0);
  const total=input.hypothetical_gross_cents;
  const prelim=x.map(v=>Math.floor(total*v.weight/totalWeight));
  const remaining=total-prelim.reduce((a,b)=>a+b,0);
  for(let i=0;i<remaining;i++)prelim[i%prelim.length]++;
  allocations=x.map((v,i)=>({participant_id:v.id,illustrative_before_fees_cents:prelim[i]}));
 }
 return {participant_terms_ready_for_review:good,reasons,illustrative_allocation:allocations,actual_bundle_published:false,actual_net_payout:null,unique_buyers:null,individual_paid_game_orders:null,legal_clearance_verified:false};
}
