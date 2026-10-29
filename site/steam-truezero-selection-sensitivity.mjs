// Conditional identification, never a factual bound on Steam orders.
const good=n=>Number.isSafeInteger(n)&&n>=0;
export function conditionalTrueZeroSensitivity({listed,estimated,modeled_zero,
 assumed_false_zero_cap=null,assumed_missed_zero_cap=null,assumed_omitted_paid_games_cap=null}={}){
 for(const [k,v] of Object.entries({listed,estimated,modeled_zero}))
  if(!good(v))throw new TypeError('Invalid published aggregate '+k);
 if(listed===0||estimated>listed||modeled_zero>estimated)throw new RangeError('Contradictory published aggregate totals');
 const missing_estimates=listed-estimated,modeled_nonzero=estimated-modeled_zero;
 const assumptions={assumed_false_zero_cap,assumed_missed_zero_cap,assumed_omitted_paid_games_cap};
 for(const [name,v] of Object.entries(assumptions))
  if(v!==null&&!good(v))throw new TypeError('Sensitivity cap must be a nonnegative integer: '+name);
 if(assumed_false_zero_cap!==null&&assumed_false_zero_cap>modeled_zero)throw new RangeError('False-zero cap exceeds modeled zeros');
 if(assumed_missed_zero_cap!==null&&assumed_missed_zero_cap>modeled_nonzero)throw new RangeError('Missed-zero cap exceeds modeled nonzeros');
 const fullySpecified=Object.values(assumptions).every(x=>x!==null);
 const omitted=fullySpecified?assumed_omitted_paid_games_cap:null;
 const denominatorMax=fullySpecified?listed+omitted:null;
 if(denominatorMax!==null&&!Number.isSafeInteger(denominatorMax))throw new RangeError('Unsafe assumed denominator');
 const confirmedMin=fullySpecified?modeled_zero-assumed_false_zero_cap:null;
 const confirmedMax=fullySpecified?modeled_zero+assumed_missed_zero_cap+missing_estimates:null;
 const lower=fullySpecified?confirmedMin/denominatorMax:null;
 const upper=fullySpecified?(confirmedMax+omitted)/denominatorMax:null;
 return {kind:'assumption_bounded_true_zero_sensitivity_not_empirical_identification',
  listed,estimated,modeled_zero,modeled_nonzero,missing_estimates,
  assumed_false_zero_cap,assumed_missed_zero_cap,assumed_omitted_paid_games_cap,
  caps_complete:fullySpecified,
  conditional_true_zero_lower:lower,conditional_true_zero_upper:upper,
  sensitivity_min_possible_zeros_in_observed_frame:confirmedMin,
  sensitivity_max_possible_zeros_in_observed_frame:confirmedMax,
  modeled_zero_share_among_estimated:estimated?modeled_zero/estimated:null,
  actual_original_paid_frame_size:null,actual_zero_paid_orders_fraction:null,
  calibrated_model_error_rates:null,independently_verified_omitted_game_bound:null,
  confidence_interval:false,empirical_claim:false,
  explanation:fullySpecified?'Pure logical extreme under three unverified assumed caps; not a statistical confidence interval or Steam sales observation.':'Without all independently supported sensitivity caps, no nontrivial true-zero fraction is identified from modeled sales labels.'};
}
