// Public source comparison and synthetic eligibility checkpoints. No game/merchant/identity data.
const allowed=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>keys.includes(k));
export function compareSteamContentRestrictionLists({landing,onboarding}={}){
 if(!Array.isArray(landing)||!Array.isArray(onboarding))throw new TypeError('Both public rule snapshots required');
 const check=xs=>{
  const seen=new Set();
  for(const s of xs){
   if(typeof s!=='string'||!/^([a-z]+_?)+$/.test(s)||seen.has(s))
    throw new TypeError('Unique named public rule IDs required');
   seen.add(s);
  }
  return seen;
 };
 const a=check(landing),b=check(onboarding);
 const added=[...b].filter(k=>!a.has(k)),omitted=[...a].filter(k=>!b.has(k));
 if(!a.size||!b.size)throw new RangeError('Nonempty official public rule lists required');
 return {kind:'simultaneously_observed_unequal_official_public_guidance_lists',
  landing_rule_count:a.size,onboarding_rule_count:b.size,
  additional_onboarding_rule_keys:added,landing_only_rule_keys:omitted,
  public_pages_same_restriction_set:added.length===0&&omitted.length===0,
  effective_policy_change_date:null,contractual_precedence:null,
  content_approval_outcome:null,
  caveat:'A public landing page omitting an onboarding rule does not repeal the more detailed warning, identify an amendment date or substitute for review of actual product and agreement.'};
}
export function auditSyntheticSteamContentReviewGate(x){
 const keys=['fixture_id','advertising_based_business_model','payment_network_concern','content_survey_complete',
  'live_ai','live_ai_guardrails_documented','live_ai_adult_only_sexual_content'];
 if(!allowed(x,keys)||typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError('Only synthetic public-policy fixture properties are permitted');
 for(const k of ['advertising_based_business_model','content_survey_complete','live_ai','live_ai_guardrails_documented','live_ai_adult_only_sexual_content'])
  if(typeof x[k]!=='boolean')throw new TypeError('Policy fixture flags must be booleans');
 if(!['none','potential','unknown'].includes(x.payment_network_concern))
  throw new TypeError('Payment-network review state must be explicit');
 if(!x.live_ai&&(x.live_ai_guardrails_documented||x.live_ai_adult_only_sexual_content))
  throw new RangeError('Live-AI-only flags require live AI');
 const blockers=[];
 if(x.advertising_based_business_model)blockers.push('advertising_business_model');
 if(!x.content_survey_complete)blockers.push('content_survey_incomplete');
 if(x.live_ai&&!x.live_ai_guardrails_documented)blockers.push('live_ai_guardrails_not_documented');
 if(x.live_ai_adult_only_sexual_content)blockers.push('live_generated_adult_only_sexual_content');
 return {fixture_id:x.fixture_id,kind:'synthetic_public_policy_readiness_not_approval',
  documented_blockers:blockers,
  potential_payment_network_review:x.payment_network_concern!=='none',
  no_documented_blockers:!blockers.length,
  approved_for_steam:null,legal_distribution_rights_verified:null,
  current_network_provider_approval:null,real_sales_impact:null,
  caveat:'No public boolean checklist can guarantee Steam approval. A potential or unknown processor rule requires case-specific assessment; a complete survey alone cannot authorize prohibited content.'};
}
