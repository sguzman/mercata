// Tests declared synthetic controller evidence against a *subset* of official requirements.
// This is NOT Valve's certification logic. Unknown evidence always fails closed.
const devices={deck:{minFps:30,minHeight:800},machine:{minFps:30,minHeight:1080}};
export function checkSyntheticHardwareInputQa({device,evidence}={}){
 if(typeof device!=='string'||!(device in devices))throw new TypeError('Known device deck or machine required');
 if(!evidence||typeof evidence!=='object')throw new TypeError('Evidence object required');
 const keys=['allControlsUsable','matchedGlyphs','controllerTextEntry','requiresManualConfig','noHardwareWarning'];
 for(const k of keys)if(typeof evidence[k]!=='boolean')throw new TypeError('Boolean QA evidence required for '+k);
 if(typeof evidence.fps!=='number'||!Number.isFinite(evidence.fps)||evidence.fps<0)throw new TypeError('Finite nonnegative FPS required');
 if(!Number.isSafeInteger(evidence.verticalPixels)||evidence.verticalPixels<1)throw new TypeError('Positive vertical pixel resolution required');
 const fail=[];
 if(!evidence.allControlsUsable)fail.push('default_controls_do_not_access_all_content');
 if(!evidence.matchedGlyphs)fail.push('active_controller_glyphs_mismatch');
 if(!evidence.controllerTextEntry)fail.push('controller_text_entry_missing_if_needed');
 if(evidence.requiresManualConfig)fail.push('manual_configuration_required');
 if(!evidence.noHardwareWarning)fail.push('hardware_compatibility_warning');
 if(evidence.fps<devices[device].minFps)fail.push('below_documented_fps_floor');
 if(evidence.verticalPixels<devices[device].minHeight)fail.push('below_documented_vertical_resolution');
 return {kind:'synthetic_partial_input_and_performance_check_not_official_badge',device,
  selected_requirements_pass:fail.length===0,failed_selected_requirements:fail,
  fps_floor:devices[device].minFps,vertical_pixels_floor:devices[device].minHeight,
  full_official_deck_or_machine_verified_badge:null,hardware_qa_completed_by_mercata:false,
  observed_incremental_sales:null,actual_qa_labor_hours:null,
  caveat:'Only a subset of Valve requirements checked against invented booleans, not measured runtime evidence. Other hardware, display and seamlessness criteria and Valve review are required for certification.'};
}
