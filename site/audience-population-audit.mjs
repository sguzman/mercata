// Population metric audit: survey prevalence, advertiser reach and global people counts are distinct.
export function auditAudiencePopulation(data,sources){
 const errors=[];
 if(data?.platform!=='youtube'||data?.kind!=='population_prevalence_and_ad_reach_crosswalk')errors.push('invalid study identity');
 if(data?.observations?.length!==7)errors.push('missing metric observations');
 const keys=new Set();for(const x of data?.observations||[]){
  if(!x.id||keys.has(x.id))errors.push('duplicate metric ID');keys.add(x.id);
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('unknown metric source');
  if(!Number.isFinite(x.value)||x.value<0||!x.unit||!x.denominator||!x.scope||!x.time||!x.population)errors.push('missing metric denominator');
  if(x.equivalent_to_global_mau!==false)errors.push('false global MAU');
  if(x.kind==='survey_prevalence'&&(x.unit!=='percent'||x.value>100))errors.push('invalid survey fraction');
  if(x.kind==='ad_estimate'&&x.unit!=='million_ad_reachable')errors.push('false advertising metric');
 }
 const byId=new Map((data?.observations||[]).map(x=>[x.id,x]));
 if(byId.get('pew_us_daily_2025')?.value!==48||byId.get('pew_us_daily_multiple_2025')?.value!==33)errors.push('wrong Pew survey figures');
 if(byId.get('gwi_global_2026')?.population===byId.get('gwi_excl_cn_ru_2026')?.population)errors.push('collapsed different GWI denominators');
 const panel=data?.ad_reach_country_comparison;
 if(!panel||panel.id!=='selected_7_country_late_2025_ad_planner_reach'||
    panel.selected_country_count!==7||panel.source_count!==7||panel.period!=='2025-10'||
    panel.rank_scope!=='within_these_seven_country_estimates_only_not_global_rank'||
    panel.rank_basis!=='descending_ad_planner_reach_not_mau'||
    panel.provider_reported_monthly_active_users!==false||panel.provider_reported_daily_active_users!==false||
    panel.independent_probability_person_census!==false)
    errors.push('mislabelled country reach panel as active users');
 const panelRows=panel?.countries||[];
 if(panelRows.length!==7||new Set(panelRows.map(x=>x.iso2)).size!==7||
    panelRows.some((x,i)=>!sources.has(x.source_id)||x.within_panel_rank!==i+1||
    !Number.isFinite(x.ad_reach_million)||x.ad_reach_million<=0||
    (i>0&&x.ad_reach_million>=panelRows[i-1].ad_reach_million)))
    errors.push('invalid selected country ranking or source');
 if(panelRows.map(x=>x.ad_reach_million).join(',')!=='500,254,151,150,85,78.5,59.6'||
    panelRows.map(x=>x.iso2).join(',')!=='IN,US,ID,BR,MX,JP,PH')
    errors.push('published ad reach comparison changed');
 for(const [code,scope] of [['US','United States'],['BR','Brazil'],['MX','Mexico']]){
    const x=panelRows.find(row=>row.iso2===code);
    if(!x||!data.observations.some(row=>row.scope===scope&&row.kind==='ad_estimate'&&
      row.value===x.ad_reach_million&&row.source_ids.includes(x.source_id)))
      errors.push('country comparison conflicts with existing population observation');
 }
 if(!panel?.validity_gates||
    Object.entries(panel.validity_gates).some(([id,value])=>(['comparable_publisher_series','comparable_observation_month','same_reported_unit'].includes(id))?value!==true:value!==false)||
    Object.values(panel.unmeasured||{}).some(x=>x!==null))
    errors.push('invented country active-user rank');
 if(!data?.unmeasured||Object.values(data.unmeasured).some(x=>x!==null))errors.push('invented platform population');
 if(data?.reported_independent_population_measure!==null||data?.no_valid_cross_platform_intersection_or_world_total!==true)errors.push('fabricated comparable world census');
 return {valid:errors.length===0,errors};
}
export function comparePopulationEvidence(a,b){
 const fields=['unit','metric','population','scope','denominator','time','kind'];
 const errors=[];
 for(const x of fields)if(!a||!b||a[x]!==b[x]||!a[x])errors.push('incompatible '+x);
 if(errors.length)return {status:'incomparable',difference:null,errors};
 if(!Number.isFinite(a.value)||!Number.isFinite(b.value))return {status:'incomparable',difference:null,errors:['invalid numeric data']};
 return {status:'same_frame_descriptive_only',difference:b.value-a.value,errors:[]};
}
