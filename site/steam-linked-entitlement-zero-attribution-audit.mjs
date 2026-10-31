// Synthetic linked-edition fixture: a zero-credited AppID does not identify zero paid product buyers.
const shape=(x,allow)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>allow.includes(k));
const fixture=x=>typeof x==='string'&&/^fixture-[a-z0-9-]+$/.test(x);
export function auditLinkedEntitlementZeroAttribution(row){
 const allow=['fixture_id','base_app_fixture','linked_app_fixture','ownership_bundled',
  'base_received_reported_sales_credit','linked_edition_credited_sales',
  'linked_app_first_paid_own_checkout_verified','merchant_report_accessed'];
 if(!shape(row,allow)||!fixture(row.fixture_id)||!fixture(row.base_app_fixture)||
  !fixture(row.linked_app_fixture)||row.base_app_fixture===row.linked_app_fixture||
  row.ownership_bundled!==true||row.base_received_reported_sales_credit!==true||
  row.linked_edition_credited_sales!==0||
  row.linked_app_first_paid_own_checkout_verified!==false||
  row.merchant_report_accessed!==false)
  throw new TypeError('Bounded synthetic linked-edition sales-credit fixture required');
 return Object.freeze({
  kind:'linked_version_zero_platform_attribution_not_zero_paid_customers',
  fixture_id:row.fixture_id,linked_edition_credit_count:0,
  linked_edition_credit_is_product_wide_zero_orders:false,
  linked_app_independently_paid_original_release_proven:false,
  unrelated_originally_paid_game_census_candidate:false,
  verified_customer_count_for_linked_product:null,
  actual_base_app_paid_orders:null,actual_linked_edition_paid_orders:null,
  actual_zero_order_steam_game_fraction:null,
  product_net_legal_publisher_income:null,verified_merchant_report_accessed:false,
  interpretation:'A linked entitlement may produce a zero app-specific credit even though the product is purchased through another AppID. Neither a zero-attribution label nor retirement certifies a zero-paid-launch inclusion.'
 });
}
