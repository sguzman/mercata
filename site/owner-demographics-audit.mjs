export function auditOwnerDemographicSuppression(model,registeredSources){
 const errors=[],m=model?.owner_demographic_suppression;
 if(!m||m.source_ids?.length!==2||!m.source_ids.every(id=>registeredSources.has(id)))return {valid:false,errors:['missing privacy data sources']};
 if(m.review_date!=='2026-10-25'||m.observed_youtube_creator_accounts_count!==0||
   m.private_owner_accounts_accessed!==false||m.public_channel_api_demographic_data_available!==false)
   errors.push('improper source population or private owner data');
 if(m.suppression_conditions?.length!==4||
   m.suppression_conditions.some(x=>!registeredSources.has(x.source_id)||x.threshold_n!==null)||
   m.precise_public_suppression_threshold!==null||m.suppressed_row_count!==null||m.omitted_unique_people_count!==null)
   errors.push('invented demographic suppression threshold or observed count');
 const groups=m.dimension_definitions||[];
 if(groups.length!==2||groups[0].id!=='ageGroup'||groups[1].id!=='gender'||
   groups[0].api_values?.join(',')!=='age13-17,age18-24,age25-34,age35-44,age45-54,age55-64,age65-'||
   groups[1].api_values?.join(',')!=='female,male,user_specified'||
   groups.some(x=>!registeredSources.has(x.source_id)||x.verified_full_viewer_age_distribution===true||x.verified_full_viewer_gender_distribution===true))
   errors.push('unauthorized full-audience demographic inference');
 if(m.unknown_row_assumed_zero!==false||m.exact_suppression_rule_inferable!==false||
   m.extrapolation_to_global_platform_population_allowed!==false||m.user_or_minor_profiles_collected!==false||
   m.geography_revenue_same_privacy_threshold_applies!==false||
   m.survey_nonresponse_rate!==null||m.suppression_rate_platformwide!==null||
   m.observed_age_gender_join_counts!==null||m.validated_person_nonresponse_correction!==null||
   Object.values(model.unmeasured||{}).some(x=>x!==null))
   errors.push('missing demographics converted into observed people or survey response');
 return {valid:errors.length===0,errors};
}
