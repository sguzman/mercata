// Synthetic data study-design QA only. Do not feed private publisher reports into a public repository.
// Partial identification, not a representative income estimator.
export function boundGrossPaidGameLowerMedian({eligibleFrameSize,observedGrossUsd,frameComplete=false}={}){
 if(!Number.isSafeInteger(eligibleFrameSize)||eligibleFrameSize<1)throw new TypeError('Eligible frame size must be a positive integer');
 if(!Array.isArray(observedGrossUsd)||observedGrossUsd.length>eligibleFrameSize)throw new TypeError('Observed outcomes exceed or lack the frame');
 if(typeof frameComplete!=='boolean')throw new TypeError('frameComplete must be boolean');
 for(const value of observedGrossUsd)if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new TypeError('Gross paid sales must be nonnegative finite numbers');
 const n=eligibleFrameSize,m=n-observedGrossUsd.length,k=Math.ceil(n/2);
 const values=[...observedGrossUsd].sort((a,b)=>a-b);
 const lower=frameComplete?(k<=m?0:values[k-m-1]):null;
 const upper=frameComplete?(k>values.length?null:values[k-1]):null;
 return {
  lower_median_dollars_lower_bound:lower,
  lower_median_dollars_upper_bound:upper,
  upper_is_unbounded:frameComplete&&upper===null,
  frame_complete_attested:frameComplete,eligible_frame_size:n,
  observed_complete_values:values.length,missing_values:m,
  median_point_identified:frameComplete&&lower!==null&&upper!==null&&lower===upper,
  exact_zero_sale_fraction:null,developer_net_payout_median:null,after_cost_profit_median:null,
  real_steam_outcomes_verified_by_mercata:false,
  caveat:'Bounds hold only if the full original-paid frame and every supplied complete gross value are independently authentic. Null upper means unbounded, not a recorded infinite amount.'
 };
}
