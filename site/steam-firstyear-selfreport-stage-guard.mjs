// Pure arithmetic for an invented single-title approximate first-year self-report.
// Do not input real AppIDs, partner sales exports, buyer identifiers or financial records.
const only=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&
 Object.keys(v).every(k=>keys.includes(k));
const fixture=v=>typeof v==='string'&&/^fixture-[a-z0-9-]+$/.test(v);
const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&
 Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const safe=v=>Number.isSafeInteger(v)&&v>=0;
export function auditSyntheticSteamFirstYearSelfReport(input={}){
 if(!only(input,['fixture_id','release_date','post_date','reported_units','reported_refunds',
  'gross_usd_cents','author_net_usd_cents','reported_players',
  'prelaunch_wishlists','later_wishlists','demo_players'])||
  !fixture(input.fixture_id)||!day(input.release_date)||!day(input.post_date)||
  input.post_date<input.release_date||
  !['reported_units','reported_refunds','gross_usd_cents','author_net_usd_cents',
    'reported_players','prelaunch_wishlists','later_wishlists','demo_players']
   .every(k=>safe(input[k]))||
  input.reported_units>10000000||input.reported_refunds>10000000||
  input.gross_usd_cents>Number.MAX_SAFE_INTEGER/2||
  input.author_net_usd_cents>Number.MAX_SAFE_INTEGER/2)
  throw new TypeError('Bounded fictional first-year aggregate input required');
 const days=(Date.parse(input.post_date+'T00:00:00Z')-
  Date.parse(input.release_date+'T00:00:00Z'))/86400000;
 const diff=input.gross_usd_cents-input.author_net_usd_cents;
 return Object.freeze({
  kind:'synthetic_firstyear_cash_stage_comparison_not_authenticated_merchant_income',
  fixture_id:input.fixture_id,
  calendar_days_between_release_and_post:days,
  exact_365day_paid_purchase_cohort_verified:false,
  author_reported_gross_units:input.reported_units,
  author_reported_refund_events:input.reported_refunds,
  illustrative_period_refunds_over_reported_units:input.reported_units?
   input.reported_refunds/input.reported_units:null,
  matched_original_purchase_cohort_refund_fraction:null,
  illustrative_units_less_refunds_if_matched:input.reported_units>=input.reported_refunds?
   input.reported_units-input.reported_refunds:null,
  observed_net_retained_units_verified:null,
  gross_minus_author_net_usd_cents:diff,
  deducted_components_reconciled:false,
  platform_fee_included_in_author_net:null,
  publisher_remittance_verified:null,
  player_events_are_paid_customers:false,
  reported_player_events:input.reported_players,
  launch_wishlist_stock:input.prelaunch_wishlists,
  later_outstanding_wishlist_stock:input.later_wishlists,
  reported_demo_players:input.demo_players,
  matched_demo_or_wishlist_paid_conversion:null,
  developer_profit_after_labor:null,
  marketwide_publisher_income_median:null,
  marketwide_zero_paid_sale_fraction:null,
  actual_steam_financial_data_accessed:false,
  limitation:'Calendar publication gaps are not authenticated report horizons. Refund events can concern older cohorts and are not necessarily a matched original-purchase rate. Net is a source-defined label until deductions, platform share and legal payee receipts are reconciled; wishlists, demo players and lifetime players do not establish paid conversion.'
 });
}
