const hoursStages=['research_ideation','writing_storyboarding','filming_capture','art_animation','audio_music_clearance','editing_accessibility','thumbnail_metadata','distribution_promotion','community_moderation','business_admin_revision'];
const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
const whole=(n,key)=>{if(!Number.isSafeInteger(n)||n<0)throw Error('Nonnegative safe integer required: '+key);return n};
const hours=(n,key)=>{if(!Number.isFinite(n)||n<0)throw Error('Nonnegative finite hour value required: '+key);return n};
/** Synthetic or owner-supplied data only; output is not market research. */
export function compareCreatorFormatAttemptCosts(study){
 if(!study||!date(study.period_start)||!date(study.period_end)||study.period_start>study.period_end)throw Error('Explicit valid matched period required');
 if(!/^[A-Z]{3}$/.test(study.currency||'')||!study.country?.trim()||!study.topic_scope?.trim()||!study.creator_experience_band?.trim())throw Error('Matched context missing');
 if(study.all_attempts_accounted!==true||study.owner_permission_or_synthetic!==true)throw Error('Complete authorized or synthetic attempt frame required');
 if(!Array.isArray(study.groups)||study.groups.length!==2)throw Error('Exactly two matched format groups required');
 const ids=new Set(),seenAttempts=new Set();
 const groups=study.groups.map(g=>{
  if(!g?.format?.trim()||ids.has(g.format)||!Array.isArray(g.attempts)||g.attempts.length<1)throw Error('Unique format and nonempty attempts required');
  ids.add(g.format);
  let cash=0,gear=0,personal=0,published=0,abandoned=0;
  for(const a of g.attempts){
   if(typeof a?.attempt_id!=='string'||!a.attempt_id.trim()||seenAttempts.has(a.attempt_id))throw Error('Missing or duplicated attempt');
   seenAttempts.add(a.attempt_id);
   if(!['published','abandoned'].includes(a.disposition))throw Error('Only finalized attempts are comparable');
   if(!date(a.finalized_on)||a.finalized_on<study.period_start||a.finalized_on>study.period_end)throw Error('Attempt outside matched period');
   const paid=whole(a.new_cash_paid_cents,'new_cash_paid_cents'),allocated=whole(a.owned_gear_allocation_cents,'owned_gear_allocation_cents');
   if(Object.keys(a.personal_creator_hours_by_stage||{}).sort().join('|')!==[...hoursStages].sort().join('|'))throw Error('Every personal creator hour stage required once');
   const work=hoursStages.reduce((sum,k)=>sum+hours(a.personal_creator_hours_by_stage[k],k),0);
   cash+=paid;gear+=allocated;personal+=work;
   if(a.disposition==='published')published++;else abandoned++;
  }
  if(!Number.isSafeInteger(cash)||!Number.isSafeInteger(gear)||!Number.isFinite(personal)||!Number.isSafeInteger(cash+gear))throw Error('Cost arithmetic overflow');
  const attempts=g.attempts.length;
  return {format:g.format,attempts,published,abandoned,new_cash_cents:cash,noncash_owned_gear_use_cents:gear,
   personal_creator_hours:personal,new_cash_per_attempt_cents:cash/attempts,personal_hours_per_attempt:personal/attempts,
   new_cash_per_published_output_cents:published>0?cash/published:null,
   total_gear_inclusive_cost_per_published_cents:published>0?(cash+gear)/published:null,
   personal_hours_per_published_output:published>0?personal/published:null};
 });
 return {kind:'entered_matched_format_costs_not_representative_or_causal',currency:study.currency,
  country:study.country,topic_scope:study.topic_scope,creator_experience_band:study.creator_experience_band,
  period_start:study.period_start,period_end:study.period_end,groups,
  causal_format_effect:null,market_median_cost:null,creator_net_profit:null,sampling_uncertainty:null};
}
export function auditFormatAttemptProtocol(model,sources){
 const p=model?.matched_format_attempt_cost_protocol,errors=[];
 if(model?.kind!=='creator_video_format_cost_and_labor_register'||p?.kind!=='matched_creator_format_attempts_prospective_arithmetic_not_market_survey')errors.push('Wrong scope');
 if(p?.stage_ids?.join('|')!==hoursStages.join('|'))errors.push('Production stage mismatch');
 if(p?.source_ids?.some(id=>!sources.has(id))||!p?.source_ids?.length)errors.push('Missing source');
 if(p?.dispositions?.join('|')!=='published|abandoned')errors.push('Dropped abandoned projects');
 if(p?.real_matched_format_study!==null||p?.median_animation_vs_video_cost_difference!==null||p?.representative_high_cost_niche_rank!==null||p?.typical_creator_labor_per_attempt!==null)errors.push('Invented cohort study');
 return {valid:!errors.length,errors};
}
