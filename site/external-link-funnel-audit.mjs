// Distinguishes genuinely clickable external URL surfaces from Shorts text URLs.
export function auditExternalLinkFunnel(m,sources){
 const errors=[];
 if(m?.platform!=='youtube'||m?.kind!=='external_link_placement_and_measured_funnel_gates')errors.push('identity');
 const a=m?.surfaces||[];if(a.length!==7||new Set(a.map(x=>x.id)).size!==7)errors.push('surface coverage');
 for(const x of a)if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id))||!x.limitation)errors.push('unregistered rule or limitation');
 const by=id=>a.find(x=>x.id===id);
 for(const id of ['shorts_description','shorts_comment'])if(by(id)?.external_url_clickable!==false)errors.push('false Shorts clickability');
 for(const id of ['longform_description','longform_pinned_comment'])if(by(id)?.external_url_clickable!==true||by(id).advanced_access_required!==true)errors.push('missing advanced-features gate');
 if(by('shorts_related_video')?.external_url_clickable!==null)errors.push('internal link misrepresented');
 if(m?.policy?.affiliate_links_universally_banned!==false||m?.policy?.violating_destinations_prohibited!==true)errors.push('policy inversion');
 if(!m?.unknowns||Object.values(m.unknowns).some(x=>x!==null))errors.push('invented conversion');
 if(m?.measurement_plan?.validated_experiment_results?.length||m?.measurement_plan?.unobserved_outbound_click_count!==null||m?.measurement_plan?.unobserved_incremental_net_profit!==null)errors.push('unobserved experiment counts');
 return {valid:errors.length===0,errors};
}
