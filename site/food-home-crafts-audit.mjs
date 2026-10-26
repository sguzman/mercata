export function auditFoodHomeCrafts(m,registered,topic,uploads){
 const errors=[];
 if(m?.kind!=='source_bounded_food_cooking_home_crafts_content_crosswalk')errors.push('Unexpected study');
 if(m?.category_rules?.length!==5||new Set(m.category_rules.map(x=>x.id)).size!==5)errors.push('Missing content families');
 if(!m?.source_ids?.every(id=>registered.has(id)))errors.push('Unregistered first-party source');
 if(m?.observed_records?.length!==11||new Set(m.observed_records.map(x=>x.id)).size!==11)errors.push('Missing or duplicate source observations');
 for(const x of m?.observed_records||[]){
  if(!registered.has(x.source_id)||!m.category_rules.some(c=>c.id===x.content_family))errors.push('Invalid source or category '+x.id);
  if(x.comparison!=='>'||!['video_view_events','uploaded_video_objects'].includes(x.unit)||!(x.strict_lower_bound>0))errors.push('Invalid unit or bound '+x.id);
  if(x.creator_count!==null||x.creator_net_income!==null)errors.push('Unobserved creators or income '+x.id);
  if(x.source_artifact==='ontology/youtube/topic-observations.json'){
   const source=topic?.observations?.find(y=>y.id===x.source_record_id);
   if(!source||source.value!==x.strict_lower_bound||
      (source.metric==='video_views'?'video_view_events':'uploaded_video_objects')!==x.unit)errors.push('Topic observation altered '+x.id);
  }
  if(x.source_artifact==='ontology/youtube/niche-upload-volume-2024-2026.json'){
   const source=uploads?.observations?.find(y=>y.id===x.source_record_id);
   if(!source||source.lower_bound_exclusive!==x.strict_lower_bound||source.source_id!==x.source_id||x.unit!=='uploaded_video_objects')errors.push('Upload observation altered '+x.id);
  }
 }
 if(m?.category_population_sums_permitted!==false||m?.views_vs_uploads_comparable!==false||
    m?.exact_video_id_overlap_quantified!==false)errors.push('Incompatible topic counts falsely combined');
 if(!m?.category_rules?.every(x=>x.public_observed_people===null&&x.active_channels===null&&x.creator_income===null))
  errors.push('Category population or earnings invented');
 if([m?.restaurant_review_channels,m?.kitchen_equipment_review_channels,m?.typical_creator_net_income,
   m?.unique_hobbyist_viewers,m?.causal_niche_growth].some(x=>x!==null))errors.push('Unsupported business estimates');
 return {valid:errors.length===0,errors};
}
