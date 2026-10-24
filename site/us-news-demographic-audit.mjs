// Pure published-survey crosswalk audit; no personal classification, pooling, or synthetic joint cells.
export function auditNewsDemographicCrosswalk(study,sources){
 const errors=[];
 if(study?.platform!=='youtube'||study?.kind!=='us_youtube_use_news_demographic_measurement_crosswalk')errors.push('study identity');
 if(study?.sources?.length!==2||study?.strata?.length!==8||study?.regular_news_us_adult_series?.length!==7)errors.push('incomplete survey evidence');
 const surveys=new Map((study?.sources||[]).map(x=>[x.id,x]));
 if(surveys.get('npors_2026')?.respondents_n!==5511||surveys.get('atp_august_2026')?.respondents_n!==5166)errors.push('survey total sample confusion');
 for(const s of study?.sources||[])if(!sources.has(s.source_id)||!s.fieldwork_start||!s.fieldwork_end||!s.denominator)errors.push('missing survey provenance');
 const ids=new Set();for(const row of study?.strata||[]){
  const key=row.dimension+'/'+row.subgroup;if(ids.has(key))errors.push('duplicate stratum');ids.add(key);
  if(!sources.has(row.ever_use_source_id)||!sources.has(row.regular_news_source_id))errors.push('unregistered stratum source');
  if(row.ever_use_survey!=='npors_2026'||row.news_survey!=='atp_august_2026')errors.push('survey switched');
  if(![row.ever_use_pct,row.regular_news_pct].every(n=>Number.isInteger(n)&&n>=0&&n<=100))errors.push('invalid survey prevalence');
  if(row.within_subgroup_denominator!==true||row.independent_user_distribution!==false||row.subgroup_n!==null||row.subgroup_margin_of_error_pp!==null)errors.push('invented composition or precision');
 }
 const gender=study?.strata?.filter(x=>x.dimension==='published_gender')||[];
 if(gender.length!==2||gender.find(x=>x.subgroup==='men')?.ever_use_pct!==85||gender.find(x=>x.subgroup==='women')?.regular_news_pct!==28)errors.push('survey categories corrupted');
 for(let i=0;i<7;i++){const x=study?.regular_news_us_adult_series?.[i];if(x?.year!==2020+i||x?.source_id!=='pew-youtube-news-2026'||x?.survey_design_reconciled!==false)errors.push('invalid longitudinal frame');}
 const overall=study?.distinct_2026_overall_news_denominators||[];
 if(overall.length!==2||overall[0]?.population!=='all_us_adults'||overall[0]?.value!==34||overall[1]?.population!=='us_adults_who_use_youtube'||overall[1]?.value!==41)errors.push('unmatched overall population');
 if(study?.categorical_semantics?.biological_sex_measurement_verified!==false||study?.categorical_semantics?.biological_sex_specific_ever_use!==null||study?.categorical_semantics?.biological_sex_specific_news_use!==null)errors.push('unverified biological sex');
 if(!study?.unmeasured||Object.values(study.unmeasured).some(x=>x!==null))errors.push('invented missing data');
 return {valid:errors.length===0,errors};
}
export function compareSurveySubgroups(a,b){
 const keys=['dimension','subgroup','ever_use_survey','news_survey','ever_use_source_id','regular_news_source_id'];
 const missing=keys.filter(k=>a?.[k]!==b?.[k]||!a?.[k]||!b?.[k]);
 if(missing.length)return {status:'different_population_or_survey',difference:null,errors:missing};
 return {status:'same_stratum_only',difference_ever_use_pp:b.ever_use_pct-a.ever_use_pct,difference_news_pp:b.regular_news_pct-a.regular_news_pct,causal_effect_verified:false};
}
