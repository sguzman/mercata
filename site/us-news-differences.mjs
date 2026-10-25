export function summarizeSurveyDifferences(points){
 if(!Array.isArray(points)||points.length<2)throw Error('At least two dated survey points required');
 const series=[...points];
 for(let i=0;i<series.length;i++){
  const x=series[i];if(!Number.isInteger(x.year)||!Number.isFinite(x.value_pct)||x.value_pct<0||x.value_pct>100)throw Error('Invalid year or survey percentage');
  if(i&&x.year!==series[i-1].year+1)throw Error('Survey years must be consecutive and ordered');
 }
 const differences=series.slice(1).map((x,i)=>({start_year:series[i].year,end_year:x.year,change_percentage_points:x.value_pct-series[i].value_pct,statistically_significant:null}));
 return {kind:'reported_survey_point_differences_not_significance',differences,earliest_year:series[0].year,latest_year:series.at(-1).year,change_full_period_pp:series.at(-1).value_pct-series[0].value_pct,latest_change_pp:differences.at(-1).change_percentage_points,panel_longitudinal_people:false,unique_youtube_viewers:null,creator_profit:null};
}
export function auditNewsPeriodSummary(summary,crosswalk,neutral,sources){
 const errors=[];
 const a=crosswalk?.regular_news_us_adult_series||[],b=neutral?.polls?.yearly_series||[],obs=summary?.series||[];
 if(summary?.kind!=='us_adult_youtube_news_survey_descriptive_period_changes'||obs.length!==a.length||obs.length!==b.length||obs.length!==7)errors.push('Wrong survey period');
 for(let i=0;i<obs.length;i++){
  const o=obs[i],p=a[i],n=b[i],prev=obs[i-1];
  if(o.year!==p?.year||o.year!==n?.year||o.regular_youtube_news_percent_of_all_us_adults!==p?.regular_news_youtube_pct_of_us_adults||o.regular_youtube_news_percent_of_all_us_adults!==n?.value_pct)errors.push('Source values diverge');
  if(o.prior_year_pp_change!==(i?o.regular_youtube_news_percent_of_all_us_adults-prev.regular_youtube_news_percent_of_all_us_adults:null))errors.push('Point-difference arithmetic wrong');
  if(o.statistically_significant_vs_prior_year!==null||o.yearly_standard_error_pp!==null||o.actual_youtube_news_viewer_people!==null)errors.push('Invented significance or user count');
 }
 if(!sources.has('pew-youtube-news-2026')||summary?.comparison_summaries?.statistical_significance_established!==false||summary?.comparison_summaries?.true_population_decline_verified!==false)errors.push('Unsupported inference');
 if(Object.values(summary?.unmeasured||{}).some(v=>v!==null))errors.push('Unmeasured audience effects inferred');
 return {valid:!errors.length,errors};
}
