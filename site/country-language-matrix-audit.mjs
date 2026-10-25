export function auditCountryLanguageMatrix(matrix,audience,country,language,sources){
 const errs=[];
 if(matrix?.kind!=='country_ad_planner_vs_video_metadata_language_scope'||matrix?.countries?.length!==7)errs.push('Not seven defined sourced markets');
 const found=new Set(),countryCodes=['MX','US','BR','IN','ID','JP','PH'];
 for(const row of matrix?.countries||[]){
  if(found.has(row.code)||!countryCodes.includes(row.code))errs.push('Duplicate or invented market');
  found.add(row.code);
  const a=audience?.observations?.find(x=>x.source_ids?.includes(row.source_id)&&x.kind==='ad_estimate');
  const b=country?.observations?.find(x=>x.code===row.code&&x.source_id===row.source_id);
  const original=['MX','US','BR'].includes(row.code)?a?.value:b?.ad_reach_million;
  if(original!==row.ad_reach_millions||!sources.has(row.source_id))errs.push('Incorrect ad planner provenance');
  for(const name of ['public_video_metadata_sample_count','authorized_country_activity_views','content_language_counts','viewer_first_language_count','unique_viewer_people','creator_home_country_count','language_participation_rate','distinct_native_speakers']){
   if(row[name]!==null)errs.push('Unobserved language or people inferred: '+name);
  }
  if(row.tag_is_observed_population!==false||!/^[a-z]{2,3}-[A-Z]{2}$/.test(row.proposed_metadata_language_tag_for_future_label_only))errs.push('Inferred national language population');
 }
 if(matrix?.observed_language_video_sample_size!==0||matrix?.authorized_country_language_cross_tabulations?.length!==0)errs.push('Unrecorded sampling asserted');
 if(language?.global_user_language_counts!==null||Object.values(matrix?.unmeasured||{}).some(x=>x!==null))errs.push('Unmeasured viewer population inferred');
 return {valid:errs.length===0,errors:errs};
}
