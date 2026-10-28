// Arithmetic for public aggregate model labels only. This is NOT a bound on real zero-paid-order probability.
export function modeledZeroMissingnessBounds({listed,estimated,modeled_zero}={}){
 for(const [k,v] of Object.entries({listed,estimated,modeled_zero}))
  if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Invalid '+k);
 if(listed===0||estimated>listed||modeled_zero>estimated)throw new RangeError('Inconsistent modeled cohort counts');
 const missing=listed-estimated;
 return {listed,estimated,modeled_zero,missing,
  among_estimated:estimated?modeled_zero/estimated:null,
  lower_fraction_among_listed:modeled_zero/listed,
  upper_fraction_among_listed:(modeled_zero+missing)/listed,
  actual_zero_paid_orders_fraction:null,actual_zero_earning_publishers_fraction:null,
  note:'Bounds are about model zero-label allocation only; never actual no-sale records.'
 };
}
