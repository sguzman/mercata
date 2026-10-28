// Research-only deterministic bounds: these describe labels output by external models, never real Steam purchases.
const whole=(n)=>Number.isSafeInteger(n)&&n>=0;
export function boundedModelZeros({listed,estimated,modelZeros}){
 if(![listed,estimated,modelZeros].every(whole)||listed===0||estimated>listed||modelZeros>estimated)throw new RangeError('Invalid cohort model counts');
 const missing=listed-estimated;
 return {listed,estimated,modelZeros,missing,
  lower_model_zero_share:modelZeros/listed,upper_model_zero_share:(modelZeros+missing)/listed,
  observed_model_zero_share_among_estimated:estimated>0?modelZeros/estimated:null,
  exact_zero_paid_order_fraction:null,actual_zero_earning_publisher_fraction:null,
  label:'conditional model-output bounds only; not bounds for actual paid-order zeros'};
}
export function withinSnapshotShare({num,den,snapshotId}){
 if(!whole(num)||!whole(den)||den===0||num>den||typeof snapshotId!=='string'||!snapshotId.trim())throw new TypeError('Invalid within-snapshot counts');
 return {snapshotId,numerator:num,denominator:den,share:num/den,independent_validation:false};
}
export function compareSnapshots(a,b){
 if(!a||!b||typeof a.snapshotId!=='string'||typeof b.snapshotId!=='string')throw new TypeError('Missing snapshot identifiers');
 return {same_snapshot:a.snapshotId===b.snapshotId,can_combine_counts:a.snapshotId===b.snapshotId,model_output_is_true_merchant_data:false};
}
