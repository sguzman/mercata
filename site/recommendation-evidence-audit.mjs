export function auditRecommendationEvidence(d,sources){
 const errors=[];
 if(d?.platform!=='youtube'||d?.kind!=='recommendation_surface_evidence')errors.push('identity');
 if(d?.surfaces?.length!==6||new Set(d.surfaces.map(x=>x.id)).size!==6)errors.push('surface count');
 for(const x of d?.surfaces||[]){
  if(!x.claim||!x.context||!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('unsourced or incomplete surface');
  if(x.ranking_weight!==null||x.observed_creator_reach!==null)errors.push('invented effect');
 }
 if(d?.separate_conditions?.length!==6||d.separate_conditions.some(x=>!sources.has(x.source_id)||x.quantified_lift!==null))errors.push('invented condition');
 const custom=d?.custom_feed_availability;
 if(!custom||!sources.has(custom.announcement_source_id)||!sources.has(custom.help_source_id)||
    custom.announcement_date!=='2026-09-23'||custom.documented_eligible_country!=='US'||
    custom.documented_device_language!=='en'||custom.signed_in_required!==true||
    custom.watch_history_on_required!==true||custom.search_history_on_required!==true||
    custom.inactive_expiration_days!==30)errors.push('Custom Feeds eligibility missing or rewritten');
 if(custom?.all_countries_available!==false||
    custom?.guaranteed_creator_placement!==false||
    custom?.measured_creator_referral_lift!==null||
    custom?.actual_participating_viewer_count!==null)
  errors.push('Custom Feeds falsely generalized to global access or measured reach');
 if(!d?.unmeasured||Object.values(d.unmeasured).some(v=>v!==null))errors.push('invented ranking weights');
 return {valid:errors.length===0,errors};
}
