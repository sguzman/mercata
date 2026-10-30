// Only synthetic counted catalog/profile freshness buckets, never actual game or player records.
const keys=new Set(['fixture_id','catalog_entries','published_profiles','revenue_freshness','player_freshness','capture_is_atomic']);
const bucketKeys=new Set(['recent','stale','unknown']);
export function auditSyntheticCatalogProfileFreshness(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!keys.has(k))||
 typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
 !Number.isSafeInteger(row.catalog_entries)||row.catalog_entries<1||
 !Number.isSafeInteger(row.published_profiles)||row.published_profiles<0||row.published_profiles>row.catalog_entries||
 typeof row.capture_is_atomic!=='boolean')
 throw new TypeError('Expected counted synthetic catalog and profile population');
 const check=scope=>{
  if(!scope||typeof scope!=='object'||Array.isArray(scope)||Object.keys(scope).some(k=>!bucketKeys.has(k))||
   !['recent','stale','unknown'].every(k=>Number.isSafeInteger(scope[k])&&scope[k]>=0))
   throw new TypeError('Malformed metric-age classification');
  const sum=scope.recent+scope.stale+scope.unknown;
  if(!Number.isSafeInteger(sum)||sum!==row.published_profiles)
   throw new RangeError('Each metric freshness classification must equal published profile count');
  return sum;
 };
 const revenue=check(row.revenue_freshness),player=check(row.player_freshness);
 return Object.freeze({
  tracked_catalog_entries:row.catalog_entries,published_profile_pages:row.published_profiles,
  profile_to_catalog_ratio:row.published_profiles/row.catalog_entries,
  revenue_profile_freshness_total:revenue,player_profile_freshness_total:player,
  all_profile_revenue_freshness_recent:row.revenue_freshness.recent===row.published_profiles,
  metric_observation_time_proven_by_export_timestamp:false,
  actual_full_historical_first_paid_game_frame:null,
  actual_verified_merchant_paid_orders:null,zero_paid_sale_app_fraction:null,
  representative_legal_publisher_bank_income:null,
  profile_coverage_is_market_coverage:false,
  source_multiquery_capture_is_atomic:row.capture_is_atomic
 });
}
