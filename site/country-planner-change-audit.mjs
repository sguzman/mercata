export function auditPlannerChangeWindows(model,baseline,sourceIds){
 const errors=[];
 if(model?.kind!=='four_country_publisher_reported_planner_change_windows'||model?.countries?.length!==4||model?.windows?.length!==2)errors.push('Wrong scope');
 const seen=new Set();
 for(const r of model?.countries||[]){
  if(seen.has(r.code))errors.push('Duplicate country');seen.add(r.code);
  const orig=baseline?.observations?.find(o=>o.code===r.code);
  if(!orig||!sourceIds.has(r.source_id)||orig.source_id!==r.source_id||orig.ad_reach_million!==r.advertiser_planner_reach_million)errors.push('Country/source mismatch');
  if(orig?.reported_end_2024_to_2025_change_million!==r.reported_end_2024_to_late_2025?.change_million
   ||orig?.reported_end_2024_to_2025_change_percent!==r.reported_end_2024_to_late_2025?.change_percent
   ||orig?.reported_july_to_oct_2025_change_million!==r.reported_july_to_oct_2025?.change_million
   ||orig?.reported_july_to_oct_2025_change_percent!==r.reported_july_to_oct_2025?.change_percent)errors.push('Reported window values altered');
  if(r.unit!=='millions_google_ad_reach_estimate'||r.underlying_observation!=='2025-10'
   ||[r.active_people_change,r.unique_mau,r.unique_dau,r.creator_income,r.measurement_break_contribution].some(x=>x!==null))errors.push('Invalid person inference');
 }
 for(const w of model?.windows||[])if(w.fixed_person_panel!==false||w.method_revision_effect_measured!==false)errors.push('Method continuity asserted');
 if(model?.source_ids?.length!==4||model.source_ids.some(x=>!sourceIds.has(x))||Object.values(model?.unmeasured||{}).some(x=>x!==null))errors.push('Unmeasured population inferred');
 return {valid:errors.length===0,errors,countries:seen.size};
}
