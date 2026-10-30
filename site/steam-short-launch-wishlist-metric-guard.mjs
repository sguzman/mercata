// Audits only invented post-release fixtures; never accept real AppIDs, personal accounts or actual merchant rows.
const allowed=new Set(['fixture_id','total_reported_sales','wishlist_stock_lower_bound_exclusive','dashboard_conversion_pct_label','is_paid_release','demo_is_free']);
export function auditSyntheticOneDayWishlistReport(row){
 if(!row||Array.isArray(row)||typeof row!=='object'||Object.keys(row).some(k=>!allowed.has(k))||
  typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
  !Number.isSafeInteger(row.total_reported_sales)||row.total_reported_sales<0||
  !Number.isSafeInteger(row.wishlist_stock_lower_bound_exclusive)||row.wishlist_stock_lower_bound_exclusive<0||
  typeof row.dashboard_conversion_pct_label!=='number'||!Number.isFinite(row.dashboard_conversion_pct_label)||
  row.dashboard_conversion_pct_label<0||row.dashboard_conversion_pct_label>100||
  row.is_paid_release!==true||row.demo_is_free!==true)
  throw new TypeError('Expected synthetic paid launch and separate demo with unknown wishlist cohort');
 return Object.freeze({
  reported_total_units:row.total_reported_sales,
  reported_wishlists_more_than:row.wishlist_stock_lower_bound_exclusive,
  reported_dashboard_conversion_pct:row.dashboard_conversion_pct_label,
  total_sales_to_wishlist_threshold_upper_bound:row.wishlist_stock_lower_bound_exclusive>0?row.total_reported_sales/row.wishlist_stock_lower_bound_exclusive:null,
  authentic_matched_wishlist_buyer_count:null,authentic_wishlist_cohort_denominator:null,independently_validated_dashboard_conversion_pct:null,
  merchant_paid_orders:null,merchant_gross_usd:null,developer_profit_usd:null,
  exact_zero_paid_sale_app_fraction:null,causal_press_incremental_sales:null
 });
}
