// Public operational counts from different collection stages must not become a Steam sales census.
const plain=(o,fields)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&
 Object.keys(o).every(k=>fields.includes(k));
const iso=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const n=x=>Number.isSafeInteger(x)&&x>=0&&x<=10000000;
export function auditPublicSteamCollectorCoverage(data){
 const fields=['provider','status_page_collector_date','reported_total_app_records',
  'reported_raw_appinfo_records','reported_apps_with_player_tracking_in_coverage',
  'reported_apps_tracked_in_player_collector',
  'reported_currently_unavailable_player_apps',
  'reported_failed_last_player_collection_attempt',
  'pics_changelist_history_since','native_price_history_since',
  'primary_archive_covers_base_games_only'];
 if(!plain(data,fields)||data.provider!=='SteamRaw'||!iso(data.status_page_collector_date)||
  !iso(data.pics_changelist_history_since)||!iso(data.native_price_history_since)||
  data.pics_changelist_history_since>data.status_page_collector_date||
  data.native_price_history_since>data.status_page_collector_date||
  !n(data.reported_total_app_records)||data.reported_total_app_records===0||
  !n(data.reported_raw_appinfo_records)||data.reported_raw_appinfo_records>data.reported_total_app_records||
  !n(data.reported_apps_with_player_tracking_in_coverage)||
  !n(data.reported_apps_tracked_in_player_collector)||
  !n(data.reported_currently_unavailable_player_apps)||
  !n(data.reported_failed_last_player_collection_attempt)||
  data.primary_archive_covers_base_games_only!==false)
  throw new TypeError('Expected bounded, dated public SteamRaw collector status summary');
 return Object.freeze({
  kind:'same_provider_distinct_collection_stages_not_originally_paid_steam_population',
  as_displayed_date:data.status_page_collector_date,
  apps_seen_in_provider_database:data.reported_total_app_records,
  apps_with_raw_appinfo:data.reported_raw_appinfo_records,
  provider_raw_appinfo_count_difference:
   data.reported_total_app_records-data.reported_raw_appinfo_records,
  reported_apps_with_player_tracking_in_coverage:
   data.reported_apps_with_player_tracking_in_coverage,
  reported_apps_tracked_in_player_collector:
   data.reported_apps_tracked_in_player_collector,
  reported_currently_unavailable_player_apps:
   data.reported_currently_unavailable_player_apps,
  reported_failed_last_player_collection_attempt:
   data.reported_failed_last_player_collection_attempt,
  two_player_tracking_counts_have_verified_matching_denominators:false,
  player_collector_unavailable_is_zero_purchases:false,
  raw_appinfo_absence_is_confirmed_historical_delisting:false,
  native_pics_history_since:data.pics_changelist_history_since,
  native_price_history_since:data.native_price_history_since,
  can_natively_reconstruct_2025_original_paid_launches:false,
  historical_complete_paid_game_appids:null,exact_zero_order_game_rate:null,
  author_verified_net_income:null,any_public_customer_records_imported:false
 });
}
