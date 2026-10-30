// Synthetic aggregate arithmetic only; never assign a meaning to an undefined net label.
const whole=x=>Number.isSafeInteger(x)&&x>=0;
export function auditSyntheticCumulativeLaunchWindows(x){
 const allowed=['fixture_id','early_days','late_days','early_units_approx','late_units_approx',
  'early_gross_cents','late_gross_cents','early_author_net_cents','late_author_net_cents',
  'author_net_is_verified_bank_receipt'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!allowed.includes(k))||
   typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError('Only labeled synthetic cumulative postmortem fields accepted');
 for(const key of allowed.filter(k=>!['fixture_id','author_net_is_verified_bank_receipt'].includes(k)))
  if(!whole(x[key]))throw new TypeError('Nonnegative safe-integer aggregate required: '+key);
 if(x.author_net_is_verified_bank_receipt!==false)
  throw new TypeError('Unaudited net cannot be promoted to bank receipts');
 if(x.early_days<1||x.late_days<=x.early_days)
  throw new RangeError('Later observation must follow earlier cumulative observation');
 for(const [early,late] of [['early_units_approx','late_units_approx'],['early_gross_cents','late_gross_cents'],
  ['early_author_net_cents','late_author_net_cents']])
  if(x[late]<x[early])throw new RangeError('Source-described cumulative figures must not regress');
 return {fixture_id:x.fixture_id,observation_windows_matched:true,
  descriptive_units_change_approx:x.late_units_approx-x.early_units_approx,
  descriptive_gross_change_usd:(x.late_gross_cents-x.early_gross_cents)/100,
  descriptive_author_net_change_undefined_basis_usd:(x.late_author_net_cents-x.early_author_net_cents)/100,
  author_net_is_settled_payout:false,
  actual_refunded_orders:null,verified_incremental_paid_orders:null,
  bank_cash_received_usd:null,after_labor_profit_usd:null,
  matched_launch_wishlist_conversion:null,representative_first_paid_median_usd:null,
  zero_actual_paid_sales_fraction:null};
}
