// Cohort-level descriptive arithmetic, no income forecasts.
const cash=['gross_cents','refund_cents','fees_cents','cash_costs_cents'];
const rank=(sorted,p)=>sorted.length?sorted[Math.max(0,Math.ceil(p*sorted.length)-1)]:null;
export function auditCreatorHourlyCohort(input){
 const bad=reason=>({status:'invalid',reason,observed:false});
 if(!input||!['synthetic_fixture','creator_authorized_aggregate'].includes(input.origin))return bad('unknown origin');
 if(input.privacy_safe_aggregation!==true||!input.cohort_frame||!input.period_start||!input.period_end||input.period_start>input.period_end)return bad('incomplete sampling frame');
 if(!Array.isArray(input.records)||!input.records.length)return bad('empty cohort');
 const seen=new Set(),rates=[];let eligible=0,unknown=0,zero=0,unpaid=0,noHours=0;
 for(const r of input.records){
  if(!r||!r.token||seen.has(r.token)||r.attempted!==true)return bad('duplicate or untracked participant');
  seen.add(r.token);
  if(typeof r.labor_hours!=='number'||r.labor_hours<0||!Number.isFinite(r.labor_hours)||!Number.isFinite(r.historical_sunk_hours)||r.historical_sunk_hours<0)return bad('invalid labor');
  if(cash.some(k=>r[k]!==null&&(!Number.isSafeInteger(r[k])||r[k]<0)))return bad('invalid cents');
  if(cash.some(k=>r[k]==null)){unknown++;continue;}
  if(r.refund_cents>r.gross_cents)return bad('refund exceeds gross');
  eligible++;
  if(r.gross_cents===0){zero++;if(r.labor_hours>0)unpaid++;}
  if(r.labor_hours===0){noHours++;continue;}
  rates.push((r.gross_cents-r.refund_cents-r.fees_cents-r.cash_costs_cents)/100/r.labor_hours);
 }
 rates.sort((a,b)=>a-b);
 return {status:unknown?'incomplete_accounting':'descriptive_cohort_only',
 observed:input.origin==='creator_authorized_aggregate',participants:input.records.length,
 complete_records:eligible,missing_receipt_records:unknown,zero_receipt_creators:zero,
 unpaid_attempts_with_labor:unpaid,zero_hour_exclusions:noHours,
 hourly_sample_n:rates.length,hourly_usd:{q25:rank(rates,.25),median:rank(rates,.5),q75:rank(rates,.75)},
 zero_receipt_share:eligible?zero/eligible:null,
 past_sunk_hours_excluded_from_current_denominator:true,missing_cash_imputed_as_zero:false,
 representative_of_all_youtube_creators:false,causal_return_established:false};
}
