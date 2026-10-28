// Structural evidence eligibility check; not a sales estimator.
export function monthlyDistributionEligibility(record){
 if(!record||typeof record!=='object')throw new TypeError('Coverage record required');
 const reasons=[];
 if(record.frame!=='all_paid_first_releases')reasons.push('not_full_paid_release_frame');
 if(record.includes_low_and_zero_sellers!==true)reasons.push('low_or_zero_sellers_missing');
 if(!Number.isSafeInteger(record.denominator)||record.denominator<=0)reasons.push('invalid_denominator');
 if(!Number.isSafeInteger(record.horizon_days)||record.horizon_days<=0)reasons.push('missing_horizon');
 if(!['audited_paid_orders','attributed_model_gross'].includes(record.measure))reasons.push('unknown_measure_or_provenance');
 return {eligible_for_bounded_distribution:reasons.length===0,reasons,merchandise_sales_verified:record.measure==='audited_paid_orders'&&reasons.length===0};
}
export function compareEarlyAccessWindows(x){
 if(!x||!Number.isFinite(x.ea_first30)||!Number.isFinite(x.v1_first30)||x.ea_first30<0||x.v1_first30<0)throw new TypeError('Nonnegative numeric estimates required');
 return {v1_greater_than_ea:x.v1_first30>x.ea_first30,sales_causally_attributed_to_v1:null,developer_profit:null};
}
