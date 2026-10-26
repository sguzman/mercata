export function assessPackagingTest(model, input) {
 if(!input || typeof input !== 'object') return {eligible:false,reason:'missing_input'};
 if(!model.test_modes.includes(input.mode)) return {eligible:false,reason:'unsupported_mode'};
 if(!Number.isInteger(input.variantCount) || input.variantCount<model.minimum_variants || input.variantCount>model.maximum_variants)
   return {eligible:false,reason:'variant_count_outside_native_limit'};
 const exclusion=new Set(model.ineligible.map(x=>x.id));
 for(const label of input.conditions||[]) {
   if(exclusion.has(label))return {eligible:false,reason:label};
 }
 if(input.desktop!==true)return {eligible:false,reason:'desktop_required'};
 if(input.advancedFeatures!==true)return {eligible:false,reason:'advanced_features_required'};
 if(!['long_form','live_archive','completed_premiere_long_form'].includes(input.videoKind))
   return {eligible:false,reason:'ineligible_video_kind'};
 return {eligible:true,allocation:model.allocation,metric:model.outcome_metric,
   actual_test_results:model.measured_experiment_results.length,verified_revenue_lift:null};
}
export function interpretPackagingResult(model, result) {
 if(!result || !model.outcomes.some(x=>x.id===result.outcome))return {valid:false,reason:'unsupported_outcome'};
 // Never infer money or cross-channel effects from watch-time share.
 if(result.claimedMetric && result.claimedMetric!==model.outcome_metric)
   return {valid:false,reason:'metric_mismatch'};
 const status=model.outcomes.find(x=>x.id===result.outcome);
 return {valid:true,outcome:status.id,selection_rule:status.chosen,
   has_clear_winner:status.id==='winner',verified_buyer_conversion:null,verified_revenue_gain:null};
}

export function auditExternalPackagingRotations(model,sources){
 const errors=[],d=model?.external_rotation_observation;
 if(!d||!sources.has(d.source_id)||d.publication_date!=='2026-09-28'||
    d.query_date!=='2026-09-28'||d.observed_video_objects!==828766||
    d.served_creator_channels!==128002||d.observed_week_one_edited_video_objects!==75998||
    d.detected_rotation_video_objects!==460||d.detected_rotation_channels!==382)
    errors.push('missing or inconsistent selected external snapshot study');
 if(!d)return {valid:false,errors};
 if(d.mode_counts?.thumbnail_only+d.mode_counts?.title_only+d.mode_counts?.combined!==460||
    d.combination_counts?.two+d.combination_counts?.three+d.combination_counts?.four_to_five!==460||
    d.settled_rotations+d.unsettled_rotations!==460||
    d.settled_final_original_version+d.settled_final_changed_version!==d.settled_rotations||
    d.settled_final_original_version!==201||d.settled_final_changed_version!==241||
    Math.abs(100*d.settled_final_original_version/d.settled_rotations-d.settled_original_share_reported_pct)>0.051)
    errors.push('rotation count denominators do not reconcile');
 if(d.size_band_detections?.length!==4||
    d.size_band_detections.some((x,i)=>x.share_of_vendor_tracked_channels_with_detected_rotation_pct!==[0.075,0.278,0.464,0.767][i]))
    errors.push('subscriber band detection scope changed');
 if(d.actual_native_test_confirmations!==null||d.actual_youtube_studio_winner_labels!==null||
    d.absolute_watch_time_lift!==null||d.ctr_change!==null||d.incremental_revenue!==null||
    d.purchase_conversion!==null||d.causal_effect_of_running_test!==null||
    d.representative_all_channels!==false||d.independent_replication!==false||
    d.original_screenshot_or_thumbnail_copies_collected!==false||
    model.measured_experiment_results?.length!==0||
    Object.values(model.unmeasured||{}).some(x=>x!==null))
    errors.push('externally displayed variant misrepresented as verified native or causal result');
 return {valid:errors.length===0,errors};
}
