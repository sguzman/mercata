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
