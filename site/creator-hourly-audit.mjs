// Cohort-level descriptive arithmetic, no income forecasts.
const cash=['gross_cents','refund_cents','fees_cents','cash_costs_cents'];
const rank=(sorted,p)=>sorted.length?sorted[Math.max(0,Math.ceil(p*sorted.length)-1)]:null;
export function auditCreatorHourlyCohort(input){
 const bad=reason=>({status:'invalid',reason,observed:false});
 if(!input||!['synthetic_fixture','creator_authorized_aggregate'].includes(input.origin))return bad('unknown origin');
 const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value+'T00:00:00.000Z').toISOString().slice(0,10)===value;
 if(input.privacy_safe_aggregation!==true||typeof input.cohort_frame!=='string'||!input.cohort_frame.trim()||!validDate(input.period_start)||!validDate(input.period_end)||input.period_start>input.period_end)return bad('incomplete sampling frame');
 if(!Array.isArray(input.records)||!input.records.length)return bad('empty cohort');
 const seen=new Set(),rates=[];let eligible=0,unknown=0,zero=0,unpaid=0,noHours=0;
 let knownZeroGross=0,missingGross=0,missingHourly=0;
 for(const r of input.records){
  if(!r||!r.token||seen.has(r.token)||r.attempted!==true)return bad('duplicate or untracked participant');
  seen.add(r.token);
  if(typeof r.labor_hours!=='number'||r.labor_hours<0||!Number.isFinite(r.labor_hours)||!Number.isFinite(r.historical_sunk_hours)||r.historical_sunk_hours<0)return bad('invalid labor');
  if(cash.some(k=>r[k]!==null&&(!Number.isSafeInteger(r[k])||r[k]<0)))return bad('invalid cents');
  if(r.gross_cents===null||r.gross_cents===undefined)missingGross++;
  else if(r.gross_cents===0)knownZeroGross++;
  if(cash.some(k=>r[k]==null)){unknown++;if(r.labor_hours>0)missingHourly++;continue;}
  // Refunds can reverse earlier-period sales even when this period has no new receipts.
  const netCents=r.gross_cents-r.refund_cents-r.fees_cents-r.cash_costs_cents;
  if(!Number.isSafeInteger(netCents))return bad('net cents overflow');
  eligible++;
  if(r.gross_cents===0){zero++;if(r.labor_hours>0)unpaid++;}
  if(r.labor_hours===0){noHours++;continue;}
  rates.push(netCents/100/r.labor_hours);
 }
 rates.sort((a,b)=>a-b);
 // Missing cash values have unbounded hourly rates until verified. Null is an
 // unidentified endpoint, never an imputed zero or an observed income value.
 const possibleHourlyN=rates.length+missingHourly;
 const partialRankBound=p=>{
  if(!possibleHourlyN)return {lower:null,upper:null,identified:false};
  const r=Math.max(1,Math.ceil(p*possibleHourlyN));
  const lowerIndex=r-missingHourly-1,upperIndex=r-1;
  const lower=lowerIndex<0?null:rates[lowerIndex];
  const upper=upperIndex>=rates.length?null:rates[upperIndex];
  return {lower,upper,identified:lower!==null&&upper!==null&&lower===upper};
 };
 const zeroGrossBounds={lower:knownZeroGross/input.records.length,
   upper:(knownZeroGross+missingGross)/input.records.length,
   known_zero_gross:knownZeroGross,missing_gross:missingGross,
   denominator_attempted_creators:input.records.length};
 return {status:unknown?'incomplete_accounting':'descriptive_cohort_only',
 observed:input.origin==='creator_authorized_aggregate',participants:input.records.length,
 complete_records:eligible,missing_receipt_records:unknown,zero_receipt_creators:zero,
 unpaid_attempts_with_labor:unpaid,zero_hour_exclusions:noHours,
 hourly_sample_n:rates.length,hourly_usd:{q25:rank(rates,.25),median:rank(rates,.5),q75:rank(rates,.75)},
 hourly_rate_partially_identified_for_n:possibleHourlyN,
 missing_hourly_rate_records:missingHourly,
 partial_identification_hourly_usd:{q25:partialRankBound(.25),median:partialRankBound(.5),q75:partialRankBound(.75)},
 zero_gross_share_of_all_attempts_bounds:zeroGrossBounds,
 // The complete-case distribution is NOT a population estimate when even one outcome is missing.
 complete_cohort_hourly_usd:(unknown||noHours)?null:{q25:rank(rates,.25),median:rank(rates,.5),q75:rank(rates,.75)},
 partial_records_limit_inference:Boolean(unknown||noHours),
 zero_receipt_share:eligible?zero/eligible:null,
 past_sunk_hours_excluded_from_current_denominator:true,missing_cash_imputed_as_zero:false,
 representative_of_all_youtube_creators:false,causal_return_established:false};
}
