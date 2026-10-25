const dateDay=x=>{
 if(typeof x!=='string'||!/^\\d{4}-\\d{2}-\\d{2}$/.test(x))return null;
 const d=new Date(x+'T00:00:00.000Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==x)return null;
 return Math.floor(d.getTime()/86400000);
};
export function assessContentIDDispute(model,input){
 if(!model?.dispute||input?.dispute_type!=='initial_content_id_dispute')
   return {valid:false,reason:'not_a_documented_original_dispute'};
 const claim=dateDay(input.claim_date),filed=dateDay(input.dispute_date);
 if(claim===null||filed===null||filed<claim)
   return {valid:false,reason:'invalid_claim_or_dispute_date'};
 const days=filed-claim;
 const retrospective=days<=model.dispute.retroactive_claim_day_if_filed_within_days;
 return {valid:true,claim_date:input.claim_date,dispute_date:input.dispute_date,
  days_since_claim:days,held_since:retrospective?input.claim_date:input.dispute_date,
  retroactive_to_claim:retrospective,held_revenue_creator_cash:null,
  settled_creator_share:null,dispute_winner:null};
}
export function assessContentIDPolicy(model,action,territory){
 const row=model?.actions?.find(x=>x.id===action);
 if(!row||typeof territory!=='string'||!/^[A-Z]{2}$/.test(territory))
  return {valid:false,reason:'unknown_action_or_territory'};
 return {valid:true,action,territory,access:row.access,
  creator_ad_revenue:null,claimant_ad_revenue:null,actual_license_fee:null,
  viewership_lost:null,verified_profit:null};
}
export function interpretClaimResolution(model,outcome){
 if(!model?.dispute?.accepted_resolution_outcomes?.includes(outcome))
  return {valid:false,reason:'unsupported_resolution'};
 return {valid:true,outcome,recipient_entitled_by_this_observation:null,
  settlement_amount:null,creator_bank_received:null};
}
