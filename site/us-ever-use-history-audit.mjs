export function auditUsEverUseHistory(data,sources){
 const x=data?.us_adult_ever_use_history,errors=[];
 const req=[['2018-01-10',73,'telephone'],['2019-02-07',73,'telephone'],['2021-02-08',81,'telephone'],['2023-09-05',83,'web_mail'],['2024-06-10',85,'web_mail_phone'],['2025-06-18',84,'web_mail_phone'],['2026-06-18',84,'web_mail_phone']];
 if(data?.kind!=='population_prevalence_and_ad_reach_crosswalk'||x?.source_id!=='pew-us-adults-2026'||!sources.has(x.source_id))errors.push('Source or population changed');
 if(x?.year_values?.length!==req.length)errors.push('Incorrect survey count');
 req.forEach(([date,pct,mode],i)=>{
  const r=x?.year_values?.[i];
  if(r?.date!==date||r?.percent!==pct||r?.collection_mode!==mode)errors.push('Historical observation changed');
  if(r?.whole_sample_margin_pp!==(i===6?1.8:null)||r?.unique_monthly_people!==null||r?.unique_daily_people!==null||r?.creator_income!==null)errors.push('Unmeasured population assigned');
 });
 if(x?.missing_years?.join('|')!=='2020|2022'||x?.global_mau!==null||x?.global_dau!==null||x?.significant_growth_verified!==null||x?.deduplicated_youtube_people!==null)errors.push('Invented platform census or gap');
 return {valid:!errors.length,errors};
}
