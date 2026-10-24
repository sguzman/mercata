// Pure aggregate cohort arithmetic. Synthetic examples never imply actual YouTube retention.
export function assessPaidRenewals(input){
 const bad=reason=>({status:'invalid',rate:null,lower:null,upper:null,reason,causal_effect_verified:false});
 if(!input||input.source!=='authorized_creator_aggregate')return bad('Authorized aggregate origin required');
 if(!input.cohort_id||typeof input.cohort_id!=='string'||input.billing_basis!=='actual_renewal_due_dates')return bad('Cohort identity and real billing-due basis required');
 const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
 if(!validDate(input.period_start)||!validDate(input.period_end)||input.period_start>input.period_end)return bad('Valid ordered dated period required');
 for(const k of ['due','paid_renewed','not_renewed','unresolved','trial_only','gifted']){
  if(!Number.isSafeInteger(input[k])||input[k]<0)return bad('Nonnegative whole counts required: '+k);
 }
 if(input.paid_renewed+input.not_renewed+input.unresolved!==input.due)return bad('Due cohort must be completely partitioned');
 if(input.due===0)return {status:'no_due_renewals',rate:null,lower:null,upper:null,reason:'No due cohort to estimate',causal_effect_verified:false};
 const lower=input.paid_renewed/input.due, upper=(input.paid_renewed+input.unresolved)/input.due;
 if(input.unresolved>0)return {status:'bounded_missing_outcomes',rate:null,lower,upper,reason:'Unresolved due renewals; point rate not estimable',causal_effect_verified:false};
 return {status:'descriptive_paid_cohort_rate',rate:lower,lower,upper,reason:'Descriptive cohort count only; not an offer effect or creator profit',causal_effect_verified:false};
}
export function auditMemberCohortProtocol(data,sources){
 const errors=[];
 if(data?.platform!=='youtube'||data?.kind!=='paid_member_cohort_and_offer_test_protocol')errors.push('study identity');
 if(!Array.isArray(data?.definition_rules)||data.definition_rules.length!==6)errors.push('metric definition coverage');
 for(const rule of data?.definition_rules||[]){
  if(!rule.rule||!rule.source_ids?.length||!rule.source_ids.every(x=>sources.has(x)))errors.push('unsourced metric definition');
  if(rule.measurement!==null)errors.push('invented measured cohort value');
 }
 if(!data?.offer_test_design?.candidate_variants?.every(x=>x.observed_performance===null))errors.push('invented experiment outcome');
 if(!data?.unmeasured||Object.values(data.unmeasured).some(x=>x!==null))errors.push('invented population estimate');
 if(data?.observed_member_cohorts?.length||data?.observed_offer_tests?.length)errors.push('unverified empirical results');
 return {valid:errors.length===0,errors};
}
