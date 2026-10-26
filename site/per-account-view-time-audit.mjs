export function auditPerAccountViewTime(model,knownSourceIds){
 const errors=[],v=model?.multi_market_daily_account_view_time;
 if(!v||!knownSourceIds.has(v.source_id)||v.publisher!=='Digital i'||v.measured_market_count!==20||
   v.reported_on!=='2026-06-03'||v.account_unit!=='measured_youtube_account')
  return {valid:false,errors:['missing Digital i selected-market account frame']};
 if(v.observations?.length!==2||v.observations[0].year!==2024||v.observations[1].year!==2025||
    v.observations[0].minutes_per_account_per_day!==87.2||
    v.observations[1].minutes_per_account_per_day!==99.1||
    v.observations.some(x=>x.unique_people!==null))
   errors.push('wrong annual per-account measures or invented unique humans');
 if(v.category_comparators?.length!==2||
    v.category_comparators[0].minutes_per_account_per_day!==111||
    v.category_comparators[1].minutes_per_account_per_day!==161.5||
    v.category_comparators.some(x=>x.subgroup_sample_n!==null))
   errors.push('unsupported age/country segment estimates');
 if(v.representative_global_population!==false||
    v.raw_sampled_account_n!==null||v.per_country_weights!==null||
    v.device_coverage_detail!==null||v.median_minutes_per_account_per_day!==null||
    v.heavy_viewer_threshold_minutes_per_day!==null||
    v.upper_decile_minutes_per_account_per_day!==null||
    v.verified_distinct_humans_per_account!==null||
    v.verified_distinct_accounts_per_human!==null||v.creator_income_from_watching!==null)
   errors.push('invented global person mean or heavy viewer distribution');
 if(v.comparability?.comparable_to_uk_ofcom_2025_51_minutes!==false||
    v.comparability?.comparable_to_uk_ofcom_2025_in_home_41_minutes!==false||
    v.comparability?.comparable_to_youtube_platform_daily_active_persons!==false||
    v.comparability?.comparable_to_uk_media_nations_tv_minutes!==false||
    Object.values(model.unknowns||{}).some(x=>x!==null))
   errors.push('incompatible units pooled or missing person counts fabricated');
 return {valid:errors.length===0,errors};
}
