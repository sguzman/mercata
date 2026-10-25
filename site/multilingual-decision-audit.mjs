export function auditLocalizationDecisions(data,knownSources){
 const errors=[];
 if(data?.kind!=='multilingual_content_distribution_ontology')errors.push('Unexpected scope');
 const ids=new Set();
 for(const x of data?.localization_choices||[]){
  if(!x.id||ids.has(x.id))errors.push('Duplicate choice');
  ids.add(x.id);
  if(!x.source_ids?.length||!x.source_ids.every(id=>knownSources.has(id)))errors.push('Unattributed feature');
  if(!x.workflows?.length||!x.delivery_unit||!x.creator_control)errors.push('Missing feature operation');
  if(x.default_cost!==null||x.measured_engagement_effect!==null)errors.push('Inferred price or causal lift');
 }
 if(ids.size!==6)errors.push('Missing localization mechanism');
 const architectures=data?.publication_architectures||[];
 if(architectures.length!==2||architectures[0]?.media_object_count_per_original!==1||architectures[1]?.supported_documented!==false)errors.push('Separate uploads mislabeled as same video');
 if(architectures.some(x=>!x.source_ids?.every(id=>knownSources.has(id))||x.incremental_reach!==null||x.creator_profit!==null))errors.push('Unsourced publication comparison');
 const manual=data?.localization_choices?.find(x=>x.id==='human_dub');
 const auto=data?.localization_choices?.find(x=>x.id==='machine_dub');
 const text=data?.localization_choices?.find(x=>x.id==='metadata_discoverability');
 const thumb=data?.localization_choices?.find(x=>x.id==='localized_visual_presentation');
 if(manual?.requires_advanced_features!==true||manual?.creates_additional_audio!==true||auto?.creates_additional_audio!==true||text?.creates_additional_audio!==false||thumb?.delivery_unit!=='localized_thumbnail_same_long_form_video')errors.push('Video asset scope conflation');
 const historical=data?.official_selected_observations?.find(x=>x.id==='mla-watch-time-non-primary-language-2025');
 if(historical?.value!==25||historical?.causal_lift!==null||historical?.estimated_additional_revenue!==null)errors.push('Unverified revenue from selected watch time');
 return {valid:errors.length===0,errors};
}
