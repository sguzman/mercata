const required=new Set(['control_remapping','single_input_navigation','touch_target_size','hold_timing_adjustment','speech_subtitles','non_speech_captions','sound_controls','text_legibility','ui_contrast','color_independence','motion_flicker','cognitive_pacing','settings_persistence','storefront_truthfulness']);
export function auditAccessibilityRelease(matrix,results){
 if(!matrix||!Array.isArray(matrix.checks)||!Array.isArray(results))throw new TypeError('matrix and results required');
 const ids=new Set(matrix.checks.map(x=>x.id));
 if(ids.size!==matrix.checks.length||required.size!==14||[...required].some(x=>!ids.has(x)))throw new Error('Incomplete or duplicate accessibility plan');
 const errors=[],seen=new Set();let verified=0;
 for(const x of results){
  if(!ids.has(x.id)||seen.has(x.id)){errors.push('Unknown or repeated check id');continue;}
  seen.add(x.id);
  if(!['passed','failed','not_applicable','unverified'].includes(x.outcome)){errors.push('Invalid outcome '+x.id);continue;}
  if(x.outcome==='passed'){
   if(!x.build_id||!x.device_or_browser||!x.reproduction_steps||!Number.isFinite(x.test_hours)||x.test_hours<0)errors.push('Passed check lacks build, device, reproducible steps or measured test hours: '+x.id);
   else verified++;
  } else if(x.outcome==='not_applicable'&&!x.reason){errors.push('Missing not-applicable justification: '+x.id);}
 }
 const absent=[...required].filter(id=>!seen.has(id));
 if(absent.length)errors.push('Missing '+absent.length+' planned feature checks');
 const failed=results.filter(x=>x.outcome==='failed'||x.outcome==='unverified').length;
 const passed=errors.length===0&&absent.length===0&&failed===0&&verified+results.filter(x=>x.outcome==='not_applicable').length===14;
 return {plan_complete:true,build_test_review_complete:passed,verified_pass_count:verified,errors,unknown_profit:null,unknown_customer_demand:null,certification_granted:false};
}
