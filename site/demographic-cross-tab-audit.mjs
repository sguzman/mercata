export function auditDemographicCrossTabs(data,use,news,identity,sources){
 const errors=[];
 if(data?.kind!=='demographic_cross_tabulation_nonresponse_and_availability_audit'||data?.unavailable_joint_tables?.length!==7)errors.push('Wrong cross-tab register');
 if(data?.npors?.whole_sample_n!==use?.survey?.total_respondents_n||data?.npors?.whole_sample_moe_pp!==use?.survey?.reported_overall_moe_pp||data?.atp_news?.whole_sample_n!==news?.sources?.find(x=>x.id==='atp_august_2026')?.respondents_n)errors.push('Whole-survey metadata mismatch');
 for(const frame of data?.published_marginal_rates||[]){
  const original=use.strata.find(x=>x.id===frame.dimension);
  if(!original||frame.cells.length!==original.categories.length)errors.push('Marginal dimension absent');
  for(const cell of frame.cells){
   const from=original?.categories?.find(x=>x.id===cell.id);
   if(!from||cell.percent!==from.percent||cell.subgroup_n!==null||cell.subgroup_margin_of_error_pp!==null)errors.push('False marginal cell precision');
  }
 }
 for(const query of data?.unavailable_joint_tables||[]){
  if(!sources.has(query.source_id)||query.status!=='unmeasured_or_incompatible'||query.joint_sample_n!==null||query.cell_count!==null||query.intersection_prevalence_percent!==null||query.intersection_margin_of_error_pp!==null||query.representativeness_verified!==false||query.denominator_match_verified!==false)errors.push('Inferred or unlinked cross table');
 }
 if(data?.npors?.english_only_asian_estimate!==true||identity?.race_ethnicity_groups?.find(x=>x.english_only_restriction)?.value_percent!==95)errors.push('Asian language sample restriction lost');
 if(data?.npors?.subgroup_n!==null||data?.npors?.subgroup_moe_pp!==null||data?.atp_news?.subgroup_n!==null||Object.values(data?.unmeasured||{}).some(v=>v!==null))errors.push('Invented subgroup precision');
 return {valid:!errors.length,errors};
}

export function auditNporsYearlyDemographics(model,frameRegister,sources){
 const errors=[],x=model?.cross_survey_2025_2026;
 const f=x?.fieldwork,edu=x?.strata;
 if(x?.id!=='pew_two_independent_us_adult_npors_ever_use_surveys'||!Array.isArray(f)||f.length!==2||
    f[0].id!=='pew_npors_2025'||f[1].id!=='pew_npors_2026'||
    f[0].sample_n!==5022||f[1].sample_n!==5511)
    errors.push('NPORS survey frames confused');
 if(f?.some(z=>!sources.has(z.source_id)||z.stratum_specific_n!==null||z.stratum_specific_moe_pp!==null||
    z.outcome!=='self_reported_ever_used_youtube'||z.country!=='United States')||
    !frameRegister?.frames?.some(z=>z.id==='pew_2025_us_adults_npors'&&z.sample_total_n===5022&&z.source_ids.includes('pew-us-daily-youtube-2025')))
    errors.push('unregistered source or hidden subgroup precision');
 if(edu?.length!==3||edu?.some(g=>{
    const original=model.strata.find(s=>s.id===g.id);
    return !original||g.category_ids.join(',')!==original.categories.map(c=>c.id).join(',')||
    g.percent_2026.join(',')!==original.categories.map(c=>c.percent).join(',')||
    g.percent_2025.length!==g.category_ids.length||
    g.point_delta_pp.length!==g.category_ids.length||
    g.point_delta_pp.some((d,i)=>d!==g.percent_2026[i]-g.percent_2025[i]);
 }))errors.push('stratum values or point changes not reconciled');
 if(edu?.find(x=>x.id==='education')?.percent_2025.join(',')!=='78,87,89'||
    edu?.find(x=>x.id==='residence')?.percent_2025.join(',')!=='85,87,79'||
    edu?.find(x=>x.id==='household_income')?.percent_2025.join(',')!=='77,84,87,89')
    errors.push('2025 survey baseline changed');
 const c=x?.comparability;
 if(!c||c.respondents_same_people!==false||c.statistical_significance_test_completed!==false||
    c.subgroup_weighted_sample_size_known!==false||c.subgroup_uncertainty_known!==false||
    c.panel_design!==false||c.can_estimate_platform_mau!==false||
    c.can_identify_causal_demographic_change!==false)
    errors.push('invented statistical significance or longitudinal panel');
 if(Object.values(model?.unmeasured||{}).some(v=>v!==null))errors.push('unmeasured demographic outcomes invented');
 return {valid:errors.length===0,errors};
}

export function auditAgeCountryChildFrames(model,registeredSources){
 const errors=[],x=model?.bounded_country_child_age_observations;
 if(x?.id!=='three_country_nonmatched_child_age_youtube_2025'||
    x?.country_count!==3||x?.observation_count!==5||
    x?.frames?.length!==3||x?.cells?.length!==5)
   return {valid:false,errors:['missing bounded country-age observations']};
 if(x.frames.some(f=>!registeredSources.has(f.source_id)||
    !model.source_ids.includes(f.source_id)||f.item_subgroup_n!==null||f.subgroup_moe_pp!==null))
   errors.push('missing source or invented age subgroup precision');
 if(x.frames.map(f=>f.survey_sample_n).join(',')!=='1129,,3054')errors.push('source-wide sample mismatched');
 if(x.cells.map(c=>c.id).join(',')!=='aus_6_13,aus_6_7,aus_8_13,uk_8_14,us_2_4'||
    x.cells.map(c=>c.percent).join(',')!=='89,84,91,96,84'||
    x.cells.some(c=>c.item_n!==null||!x.frames.some(f=>f.id===c.frame_id&&f.country===c.country)))
   errors.push('age-country source-specific observations corrupted');
 if(x.directly_comparable_question!==false||x.age_bands_matched!==false||
    x.direct_international_rank_valid!==false||x.sample_design_same!==false||
    x.global_children_platform_use_rate!==null||
    x.country_and_age_adjusted_effect!==null||
    x.statistical_significance_of_country_differences!==null||
    x.verified_unique_children_watching!==null||
    x.device_level_tracking_across_three_countries!==null||
    x.child_survey_respondents_usa!==null||
    x.subgroup_standard_errors!==null||
    model.unmeasured.comparable_age_country_use_rank!==null)
   errors.push('unjustified international child age comparisons');
 return {valid:errors.length===0,errors};
}
