export function auditFraudResearch(m,sources){
 const errors=[];
 if(m?.platform!=='youtube'||m?.kind!=='channel_fraud_phishing_and_fake_engagement_risks')errors.push('identity');
 if(m?.risks?.length!==5||m?.control_groups?.length!==3)errors.push('scope');
 for(const x of m?.risks||[]){
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id))||!x.limit)errors.push('source');
  if(x.verified_incident_rate!==null||x.verified_median_cash_loss!==null||x.recorded_creator_events!==null)errors.push('invented incident');
 }
 for(const x of m?.control_groups||[])if(!x.source_ids?.every(id=>sources.has(id)))errors.push('source');
 if(m?.observed_incidents?.length||!m?.unmeasured||Object.values(m.unmeasured).some(x=>x!==null))errors.push('invented prevalence');
 return {valid:errors.length===0,errors};
}
