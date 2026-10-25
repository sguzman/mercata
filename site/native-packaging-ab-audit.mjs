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
