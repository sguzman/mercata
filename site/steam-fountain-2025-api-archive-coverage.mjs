// Dated aggregate audit of a public third-party 2025 API archive, not a game/transaction ingestion.
const plain=(x,fields)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>fields.includes(k));
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const count=n=>Number.isSafeInteger(n)&&n>0&&n<=10000000;
export function auditPublishedSteam2025ArchiveCoverage(x){
 if(!plain(x,['collection_start','collection_end','master_list_application_ids',
  'stored_application_rows','reported_detail_request_success_percent',
  'reported_review_records','initially_sampled_reviews_per_application','app_categories_mixed','download_in_this_study'])||
  !validDate(x.collection_start)||!validDate(x.collection_end)||x.collection_start>x.collection_end||
  !count(x.master_list_application_ids)||!count(x.stored_application_rows)||
  x.stored_application_rows>x.master_list_application_ids||
  !Number.isFinite(x.reported_detail_request_success_percent)||
  x.reported_detail_request_success_percent<=0||x.reported_detail_request_success_percent>100||
  !count(x.reported_review_records)||!count(x.initially_sampled_reviews_per_application)||
  x.app_categories_mixed!==true||x.download_in_this_study!==false)
  throw new TypeError('Only explicit, bounded public 2025 archive method aggregates are accepted');
 const missing=x.master_list_application_ids-x.stored_application_rows;
 return Object.freeze({
  kind:'attributed_2025_app_archive_capture_not_complete_paid_release_or_sales_population',
  collection_window:{start:x.collection_start,end:x.collection_end},
  initial_master_app_ids_reported:x.master_list_application_ids,
  archived_application_rows_reported:x.stored_application_rows,
  difference_between_reported_master_and_stored_rows:missing,
  retained_application_rows_as_fraction_of_initial_master_list:
   x.stored_application_rows/x.master_list_application_ids,
  author_reported_detail_success_percent:x.reported_detail_request_success_percent,
  detail_success_denominator_independently_reconciled:false,
  success_percentage_not_derived_from_app_roster_retention:true,
  reported_review_records_not_transactions:x.reported_review_records,
  sample_limit_per_game_not_complete_review_census:x.initially_sampled_reviews_per_application,
  mixed_app_types:true,
  historical_paid_playable_release_attestations_present:false,
  app_level_data_imported:0,reviewer_level_data_imported:0,
  number_of_excluded_originally_paid_games:null,
  number_of_games_delisted_since_snapshot:null,
  exact_zero_paid_game_count:null,publisher_income_distribution:null,
  caveat:'An archived app listing contains games and non-games; gaps between master IDs and stored rows cannot be assigned to missing paid games, nor can a separately reported success percentage be applied to the retained row count. A date-stamped metadata snapshot alone cannot establish original paid release, actual checkout, delisting or net publisher outcomes.'
 });
}
