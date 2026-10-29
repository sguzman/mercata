// One voluntarily published rounded case, not representative regional sales or partner cash.
const check=n=>Number.isSafeInteger(n)&&n>=0;
const iso=d=>{
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return null;
 const m=Date.parse(d+'T00:00:00Z');
 return Number.isFinite(m)&&new Date(m).toISOString().slice(0,10)===d?m:null;
};
export function auditSyntheticSteamRegionalSalesSelfReport(x){
 const keys=['release_date','post_date','horizon_label','launch_wishlists_approx','gross_units_approx',
 'net_copies_approx','gross_revenue_usd_approx','after_adjustments_before_platform_share_usd_approx',
 'china_share_percent_approx','china_share_denominator_defined','launch_day_copies_more_than',
 'demo_peak_ccu_approx','authorized_financial_export_attested','actual_bank_deposit_verified','full_labor_costs_documented'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Only public aggregate self-report fields permitted');
 const first=iso(x.release_date),last=iso(x.post_date);
 if(first===null||last===null||last<first)throw new TypeError('Invalid public chronology');
 if(x.horizon_label!=='first_two_weeks')throw new TypeError('Author-reported launch interval required');
 for(const k of keys.slice(3,9).concat(keys.slice(10,12)))if(!check(x[k]))throw new TypeError('Nonnegative integer public approximation required: '+k);
 if(!check(x.china_share_percent_approx)||x.china_share_percent_approx>100||
    x.net_copies_approx>x.gross_units_approx||
    x.after_adjustments_before_platform_share_usd_approx>x.gross_revenue_usd_approx||
    x.launch_day_copies_more_than>x.gross_units_approx)
  throw new RangeError('Conflicting author-reported sales totals');
 if(x.china_share_denominator_defined!==false||
    x.authorized_financial_export_attested!==false||x.actual_bank_deposit_verified!==false||
    x.full_labor_costs_documented!==false)
  throw new TypeError('Unsupported region denominator or verified financial records');
 return {kind:'self_reported_regional_launch_aggregates_not_audit_or_census',
  days_to_publication:(last-first)/86400000,
  approximate_gross_units:x.gross_units_approx,approximate_net_copies:x.net_copies_approx,
  author_approx_gross_revenue_usd:x.gross_revenue_usd_approx,
  author_approx_after_adjustments_before_platform_share_usd:x.after_adjustments_before_platform_share_usd_approx,
  author_approx_china_sales_share_percent:x.china_share_percent_approx,
  author_approx_launch_wishlists:x.launch_wishlists_approx,
  reported_launch_day_more_than:x.launch_day_copies_more_than,
  difference_in_rounded_unit_totals_is_exact_refund_count:false,
  china_sales_share_has_verified_order_denominator:false,
  pre_share_net_is_cash_remittance:false,
  region_unit_sales_exact:null,region_revenue_sales_exact:null,region_effective_price:null,
  verified_refund_rate:null,matched_wishlist_conversion:null,incremental_paid_streamer_orders:null,
  received_publisher_bank_cash:null,after_cost_profit:null,representative_regional_market_split:null,
  note:'Approximate self-report with undefined regional sales denominator. Gross and net units and dollars describe distinct accounting stages; no verified historical order cohort or payout was supplied.'};
}
