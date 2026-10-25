const CASES=new Set(['non_us_valid_tax_info','non_us_business_tax_info_missing','individual_tax_info_missing','us_creator_valid_tax_info']);
function cents(v,label){
 if(!Number.isFinite(v)||v<0)throw Error('Explicit nonnegative '+label+' is required');
 const n=Math.round(v*100);
 if(!Number.isSafeInteger(n)||Math.abs(n-v*100)>1e-6)throw Error('Amounts must have at most two decimals: '+label);
 return n;
}
export function evaluateConditionalYouTubeWithholding(input,officialModel){
 if(!input||!CASES.has(input.case_id)||!officialModel?.payer_withholding_cases?.some(x=>x.id===input.case_id))throw Error('Only a documented payee case is allowed');
 if(!/^[A-Z]{3}$/.test(input.currency||''))throw Error('Explicit ISO currency required; no FX conversion');
 const total=cents(input.worldwide_native_earnings,'worldwide_native_earnings');
 const us=cents(input.us_viewer_native_earnings,'us_viewer_native_earnings');
 if(us>total)throw Error('US-viewer amount cannot exceed worldwide amount');
 const record=officialModel.payer_withholding_cases.find(x=>x.id===input.case_id);
 const fixed=record.published_default_rate_percent;
 let rate;
 if(input.case_id==='non_us_valid_tax_info'){
  rate=input.approved_us_viewer_withholding_rate_percent;
  if(!Number.isFinite(rate)||rate<record.published_rate_bounds_percent.min||rate>record.published_rate_bounds_percent.max)
   throw Error('Explicit confirmed conditional US-viewer withholding rate between 0 and 30 required');
 }else{
  if(input.approved_us_viewer_withholding_rate_percent!==null)
   throw Error('Published default rule is not an arbitrary tax-rate estimate');
  rate=fixed;
 }
 if(!Number.isFinite(rate)||rate<0||rate>100)throw Error('Unverified published tax rate');
 const base=record.base==='earnings_attributed_to_us_viewers'?us:
  record.base==='worldwide_youtube_earnings'?total:
  record.base==='applicable_platform_withholding'?0:null;
 if(base===null)throw Error('Unknown rule-specific withholding base');
 const amount=Math.round(base*rate/100);
 return {kind:'conditional_withholding_arithmetic_not_actual_tax_liability',currency:input.currency,case_id:input.case_id,
  withholding_base:record.base,illustrative_tax_base:base/100,rule_rate_percent:rate,
  conditional_withholding:amount/100,remaining_native_amount_before_other_adjustments:(total-amount)/100,
  actual_withholding:null,ultimate_income_tax_liability:null,treaty_eligibility_verified:null,
  settled_bank_cash:null,local_tax_liability:null};
}
export function auditWithholdingScenario(model,sources){
 const errors=[];
 if(model?.kind!=='platform_withholding_scope_not_personal_tax_advice'||model?.payer_withholding_cases?.length!==4||model?.source_ids?.some(x=>!sources.has(x)))errors.push('Missing documented official rules');
 const cases=model?.payer_withholding_cases||[];
 if(cases.some(x=>x.actual_rate_percent!==null||x.treaty_eligibility!==null))errors.push('Invented actual rates');
 if(model?.conditional_arithmetic?.engine!=='site/youtube-withholding-scenario.mjs'||model?.conditional_arithmetic?.observed_cases?.length!==0||model?.conditional_arithmetic?.local_tax_rate!==null||model?.conditional_arithmetic?.creator_tax_paid!==null)errors.push('Scenario confused with actual creator tax');
 if(Object.values(model?.unknowns||{}).some(x=>x!==null))errors.push('Creator tax identified without evidence');
 return {valid:!errors.length,errors};
}
