// Validates published selected aggregate model bins, not actual transactions or income.
const safe=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticMonthlyNetModelBuckets(x){
 const keys=['fixture_id','tracked_games','under100','from100to500','from500to2000',
 'from2000to10000','over10000','reported_over2000','model_median_usd',
 'all_original_paid_games_included','bank_deposits_verified'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k))||
 typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError('Synthetic aggregate model bins only');
 for(const k of keys.filter(k=>!['fixture_id','all_original_paid_games_included','bank_deposits_verified'].includes(k)))
  if(!safe(x[k]))throw new TypeError('Invalid aggregate count: '+k);
 if(x.all_original_paid_games_included!==false||x.bank_deposits_verified!==false)
  throw new TypeError('Unverified population or bank statement claim');
 const sum=x.under100+x.from100to500+x.from500to2000+x.from2000to10000+x.over10000;
 if(sum!==x.tracked_games||x.from2000to10000+x.over10000!==x.reported_over2000)
  throw new RangeError('Published sample bins and threshold count do not match');
 if(x.tracked_games===0)throw new RangeError('No sampled titles');
 return {selected_tracked_titles:x.tracked_games,model_median_usd_as_reported:x.model_median_usd,
 fraction_selected_estimated_over2000:x.reported_over2000/x.tracked_games,
 all_paid_games_sampled:false,modelled_monthly_not_actual_income:true,
 actual_legal_payee_net_median:null,actual_zero_sales_fraction:null,
 actual_personal_profit:null,comparable_lifetime_gross_median:null};
}
