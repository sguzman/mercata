// Synthetic Steamworks financial categories only. No real app IDs, key material or real payment rows.
const fixture=s=>typeof s==='string'&&/^fixture-[a-z0-9-]{1,60}$/.test(s);
const plain=(o,ks)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>ks.includes(k));
const day=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const units=n=>Number.isSafeInteger(n)&&n>=0&&n<=100000;
const keys=['fixture_id','window','coverage','rows'];
const covKeys=['verified_first_paid_base_game','financial_access_authorized','all_pacific_dates_and_pages_complete','historical_partner_transfers_reconciled','paid_package_entitlements_attributed','changed_dates_requeried'];
const rowKeys=['row_id','date','kind','package_fixture','key_request_fixture','positive_paid_price_attested','gross_units_sold','gross_units_returned','gross_units_activated'];
export function auditSyntheticFinancialKeyBatches(input){
 if(!plain(input,keys)||!fixture(input.fixture_id)||!plain(input.window,['start','endExclusive'])||
  !day(input.window.start)||!day(input.window.endExclusive)||input.window.start>=input.window.endExclusive||
  !plain(input.coverage,covKeys)||covKeys.some(k=>typeof input.coverage[k]!=='boolean')||
  input.coverage.verified_first_paid_base_game!==true||
  !Array.isArray(input.rows)||input.rows.length>100)
  throw new TypeError('Bounded fictional paid base-game reporting period required');
 const seen=new Set(),batches=new Map();let storeGross=0,storeReturns=0,keyActivations=0,microtxn=0,hasUncertainStorePrice=false;
 for(const row of input.rows){
  if(!plain(row,rowKeys)||!fixture(row.row_id)||seen.has(row.row_id)||
   !day(row.date)||row.date<input.window.start||row.date>=input.window.endExclusive||
   !['steam_store_package','retail_key_activation','microtransaction'].includes(row.kind)||
   !units(row.gross_units_sold)||!units(row.gross_units_returned)||!units(row.gross_units_activated)||
   !(row.package_fixture===null||fixture(row.package_fixture))||
   !(row.key_request_fixture===null||fixture(row.key_request_fixture))||
   typeof row.positive_paid_price_attested!=='boolean')
   throw new TypeError('Only explicit fictional sale category rows permitted');
  seen.add(row.row_id);
  if(row.kind==='steam_store_package'){
   if(!fixture(row.package_fixture)||row.key_request_fixture!==null||row.gross_units_activated!==0)
    throw new TypeError('Store package rows cannot carry retail key activation fields');
   storeReturns+=row.gross_units_returned;
   if(row.positive_paid_price_attested)storeGross+=row.gross_units_sold;
   else if(row.gross_units_sold>0)hasUncertainStorePrice=true;
  }else if(row.kind==='retail_key_activation'){
   if(!fixture(row.package_fixture)||!fixture(row.key_request_fixture)||
    row.gross_units_sold!==0||row.gross_units_returned!==0||row.positive_paid_price_attested)
    throw new TypeError('Retail key activation is not a Steam purchase');
   keyActivations+=row.gross_units_activated;
   batches.set(row.key_request_fixture,(batches.get(row.key_request_fixture)||0)+row.gross_units_activated);
  }else{
   if(row.package_fixture!==null||row.key_request_fixture!==null||row.gross_units_activated!==0||
    row.gross_units_returned!==0||row.positive_paid_price_attested)
    throw new TypeError('In-game transactions are not base game store packages');
   microtxn+=row.gross_units_sold;
  }
 }
 const complete=covKeys.every(k=>input.coverage[k])&&!hasUncertainStorePrice;
 // A partial positive within an authorized/attributed window rules out zero.
 const attestedPositive=storeGross>0&&input.coverage.financial_access_authorized&&
   input.coverage.paid_package_entitlements_attributed;
 const zeroStatus=complete?(storeGross===0?'zero':'nonzero'):(attestedPositive?'nonzero':'unknown');
 return Object.freeze({
  kind:'synthetic_partner_report_categories_not_public_market_sample',
  fixture_id:input.fixture_id,reported_gross_paid_steam_package_units:storeGross,
  reported_steam_package_returns:storeReturns,
  conditional_gross_minus_returns:storeGross-storeReturns,
  retail_key_activations_not_steam_store_sales:keyActivations,
  distinct_key_request_batches:batches.size,
  microtransaction_units_not_base_game_checkouts:microtxn,
  has_unresolved_zero_price_package_sales:hasUncertainStorePrice,
  full_paid_window_coverage_attested:complete,
  period_steam_store_paid_order_status:zeroStatus,
  external_key_paid_purchasers:null,verified_real_world_paid_order_count:null,
  complete_historical_paid_game_population:null,marketwide_zero_order_fraction:null,
  verified_legal_publisher_net_profit:null,actual_private_financial_rows_processed:false
 });
}
