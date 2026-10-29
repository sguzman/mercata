// Observations are a developer's rounded public testimony, never a Steam merchant ledger.
const iso=x=>{
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return null;
 const y=Date.parse(x+'T00:00:00Z');
 return Number.isFinite(y)&&new Date(y).toISOString().slice(0,10)===x?y:null;
};
export function auditSteamPublicLaunchWindow(x){
 const keys=['release_date','publication_date','described_window','sales_cutoff_date','unit_sales_roughly_below',
  'refunds_reported','pre_steam_share_revenue_usd_approx','prelaunch_wishlistings_approx','total_wishlistings_approx',
  'author_conversion_pct_approx','independently_verified_financial_records'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Public aggregate fields only');
 const released=iso(x.release_date),posted=iso(x.publication_date);
 if(released===null||posted===null||posted<released)throw new RangeError('Invalid release/report dates');
 if(x.described_window!=='first_two_weeks'||x.sales_cutoff_date!==null)
  throw new TypeError('Source does not disclose a precise 14-day sales cutoff');
 for(const k of keys.slice(4,10))if(!Number.isSafeInteger(x[k])||x[k]<0)throw new TypeError('Invalid rounded report metric');
 if(x.unit_sales_roughly_below===0||x.refunds_reported>=x.unit_sales_roughly_below||x.author_conversion_pct_approx>100)
  throw new RangeError('Contradictory rounded sales metrics');
 if(x.independently_verified_financial_records!==false)throw new TypeError('No authenticated merchant data was disclosed');
 return {kind:'single_public_game_self_report_not_reconciled_merchant_sales',
  publication_lag_days:(posted-released)/86400000,
  author_described_window_days:14,exact_window_cutoff_documented:false,
  reported_approx_units_less_than:x.unit_sales_roughly_below,
  reported_refunds:x.refunds_reported,reported_approx_preshare_revenue_usd:x.pre_steam_share_revenue_usd_approx,
  reported_approx_prelaunch_wishlistings:x.prelaunch_wishlistings_approx,
  reported_approx_total_wishlistings:x.total_wishlistings_approx,
  reported_author_conversion_pct:x.author_conversion_pct_approx,
  exact_14day_units:null,computed_refund_rate:null,verified_cohort_conversion:null,
  received_net_cash:null,after_cost_profit:null,platform_median_publisher_income:null,real_zero_paid_sale_share:null,
  caveat:'A post published 27 days after release need not describe 27 days of sales; no exact cutoff is disclosed. Wishlist figures and author conversion cannot identify matched paying cohorts.'};
}
