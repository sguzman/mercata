// Pure synthetic whole-game zero-sales sensitivity over country purchase windows.
// No real partner financial data, API keys, customer identifiers or real game IDs.
import {auditSyntheticSteamCountryAvailabilityZeroBounds} from './steam-country-availability-zero-bounds.mjs';
const allowed=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const gameID=id=>typeof id==='string'&&/^fixture-[a-z0-9-]+$/.test(id);
const country=id=>typeof id==='string'&&/^[A-Z]{2}$/.test(id);
const classes=['eligible_paid_initially','ineligible_initially_free','unresolved'];
export function auditSyntheticSteamGameLevelCountryZeroBounds(rows,opts={}){
 const keys=['start','endExclusive','asOfDate','game_frame_complete',
  'country_roster_complete','game_roster','store_countries',
  'all_purchase_country_reporting_reconciled_attested'];
 if(!allowed(opts,keys)||!Array.isArray(opts.game_roster)||!opts.game_roster.length||
    opts.game_roster.length>64||!Array.isArray(opts.store_countries)||
    !opts.store_countries.length||opts.store_countries.length>64||
    typeof opts.all_purchase_country_reporting_reconciled_attested!=='boolean')
  throw new TypeError('Bounded synthetic game and store-country rosters required');
 const gameIndex=new Map();
 for(const item of opts.game_roster){
  if(!allowed(item,['fixture_game_id','initial_paid_status'])||
    !gameID(item.fixture_game_id)||!classes.includes(item.initial_paid_status)||
    gameIndex.has(item.fixture_game_id))
   throw new TypeError('Invalid or duplicate synthetic game roster');
  gameIndex.set(item.fixture_game_id,item.initial_paid_status);
 }
 const markets=new Set();
 for(const market of opts.store_countries){
  if(!country(market)||markets.has(market))
   throw new TypeError('Unique ISO two-letter store-country codes required');
  markets.add(market);
 }
 if(!Array.isArray(rows)||rows.length>128)
  throw new TypeError('Bounded country checkout observations required');
 const actualByGame=new Map();
 const releaseByGame=new Map();
 for(const row of rows){
  if(!row||!gameIndex.has(row.fixture_game_id)||!markets.has(row.store_country)||
     gameIndex.get(row.fixture_game_id)!=='eligible_paid_initially'||
     row.initial_paid_status!=='eligible_paid_initially')
   throw new RangeError('Country row must belong to an eligible roster game and listed store country');
  if(releaseByGame.has(row.fixture_game_id)&&
     releaseByGame.get(row.fixture_game_id)!==row.first_paid_release_date)
   throw new RangeError('Same game must use one original paid release date in every country');
  releaseByGame.set(row.fixture_game_id,row.first_paid_release_date);
  if(!actualByGame.has(row.fixture_game_id))actualByGame.set(row.fixture_game_id,new Set());
  if(actualByGame.get(row.fixture_game_id).has(row.store_country))
   throw new RangeError('Duplicate game-country row');
  actualByGame.get(row.fixture_game_id).add(row.store_country);
 }
 // Reuse the existing per-country validation, financial proof gates and access
 // interval checks. That audit does not infer a game-level sale count.
 const countryAudit=auditSyntheticSteamCountryAvailabilityZeroBounds(rows,{
  start:opts.start,endExclusive:opts.endExclusive,asOfDate:opts.asOfDate,
  game_frame_complete:opts.game_frame_complete,country_roster_complete:opts.country_roster_complete
 });
 const grouped=new Map();
 for(const entry of countryAudit.entries){
  if(!grouped.has(entry.fixture_game_id))grouped.set(entry.fixture_game_id,[]);
  grouped.get(entry.fixture_game_id).push(entry);
 }
 const globalCountryProof=opts.country_roster_complete&&
  opts.all_purchase_country_reporting_reconciled_attested&&
  countryAudit.observation_matured;
 const counts={eligible_paid_games:0,excluded_initially_free_games:0,
  unresolved_original_paid_status_games:0,confirmed_gross_zero_games:0,
  confirmed_positive_games:0,unknown_gross_zero_games:0,
  structural_no_checkout_access_zero_games:0,
  confirmed_zero_with_some_checkout_access:0,
  games_with_some_purchase_access:0,
  games_with_unknown_purchase_access:0};
 const entries=[];
 for(const [id,status] of gameIndex){
  if(status!=='eligible_paid_initially'){
   counts[status==='ineligible_initially_free'?'excluded_initially_free_games':
    'unresolved_original_paid_status_games']++;
   entries.push(Object.freeze({fixture_game_id:id,initial_paid_status:status,
    whole_game_gross_zero_status:'excluded_or_unknown_initial_paid',
    purchase_access_class:'not_assessed',countries_supplied:0,
    missing_country_rows:opts.store_countries.slice()}));
   continue;
  }
  counts.eligible_paid_games++;
  const supplied=grouped.get(id)||[];
  const countries=new Set(supplied.map(x=>x.store_country));
  const missing=opts.store_countries.filter(c=>!countries.has(c));
  const positive=supplied.some(x=>x.zero_class==='observed_positive_paid_units');
  const allComplete=supplied.length===opts.store_countries.length&&
   missing.length===0&&supplied.every(x=>x.ledger_status==='complete_reconciled');
  const accessible=supplied.some(x=>x.availability_class==='fully_purchasable'||
   x.availability_class==='mixed');
  const unknownAccess=missing.length>0||supplied.some(x=>x.availability_class==='unresolved');
  const neverAvailable=!unknownAccess&&!accessible;
  const access=unknownAccess?'unresolved':accessible?'at_least_one_purchasable_country_window':
   neverAvailable?'never_purchasable_in_any_listed_country':'unresolved';
  if(access==='at_least_one_purchasable_country_window')counts.games_with_some_purchase_access++;
  if(access==='unresolved')counts.games_with_unknown_purchase_access++;
  // One authenticated positive proves nonzero even if another country is
  // unobserved. A zero, however, requires every country and complete reports.
  const zero=positive?'known_gross_paid_nonzero':
   globalCountryProof&&allComplete?'known_gross_paid_zero':'unknown_gross_paid_zero';
  if(zero==='known_gross_paid_nonzero')counts.confirmed_positive_games++;
  else if(zero==='known_gross_paid_zero'){
   counts.confirmed_gross_zero_games++;
   if(neverAvailable)counts.structural_no_checkout_access_zero_games++;
   if(access==='at_least_one_purchasable_country_window')
    counts.confirmed_zero_with_some_checkout_access++;
  }else counts.unknown_gross_zero_games++;
  entries.push(Object.freeze({fixture_game_id:id,initial_paid_status:status,
   whole_game_gross_zero_status:zero,purchase_access_class:access,
   countries_supplied:supplied.length,missing_country_rows:missing,
   all_supplied_country_ledgers_complete:allComplete,
   any_attributed_positive_country_checkout:positive}));
 }
 // Population inference is conditional even if the synthetic inputs are
 // perfectly complete; account authorization is never independently verified.
 const publishable=opts.game_frame_complete&&globalCountryProof&&
  counts.unresolved_original_paid_status_games===0&&counts.eligible_paid_games>0;
 const lower=publishable?counts.confirmed_gross_zero_games/counts.eligible_paid_games:null;
 const upper=publishable?(counts.confirmed_gross_zero_games+
  counts.unknown_gross_zero_games)/counts.eligible_paid_games:null;
 const exposedOK=publishable&&counts.games_with_unknown_purchase_access===0&&
  counts.games_with_some_purchase_access>0;
 const exposedEntries=entries.filter(x=>x.initial_paid_status==='eligible_paid_initially'&&
  x.purchase_access_class==='at_least_one_purchasable_country_window');
 const exposedZero=exposedEntries.filter(x=>x.whole_game_gross_zero_status==='known_gross_paid_zero').length;
 const exposedUnknown=exposedEntries.filter(x=>x.whole_game_gross_zero_status==='unknown_gross_paid_zero').length;
 return Object.freeze({
  kind:'synthetic_steam_whole_game_zero_from_reconciled_country_frames',
  game_frame_complete_attested:opts.game_frame_complete,
  country_roster_complete_attested:opts.country_roster_complete,
  all_purchase_country_reporting_reconciled_attested:opts.all_purchase_country_reporting_reconciled_attested,
  observation_matured:countryAudit.observation_matured,
  store_countries_attested:opts.store_countries.slice(),
  counts,entries,
  whole_game_gross_zero_fraction_lower_conditional:lower,
  whole_game_gross_zero_fraction_upper_conditional:upper,
  purchase_exposed_game_zero_fraction_lower_conditional:
   exposedOK?exposedZero/counts.games_with_some_purchase_access:null,
  purchase_exposed_game_zero_fraction_upper_conditional:
   exposedOK?(exposedZero+exposedUnknown)/counts.games_with_some_purchase_access:null,
  real_steam_game_zero_paid_sale_fraction:null,
  actual_steam_purchase_exposed_zero_fraction:null,
  actual_developer_net_income:null,
  actual_zero_demand_rate:null,
  actual_financial_api_data_verified:false,
  real_currency_to_store_country_mapping_inferred:false,
  actual_partner_transfer_history_verified:false,
  caveat:'Conditional mathematics on invented original-paid-game and purchase-country frames only. Observed gross paid zero across all countries differs from unavailable-for-checkout structural zero or a zero among games exposed to some purchase opportunity. A single positive country report proves nonzero only with authorized package-to-game and purchase-country attribution. A complete game zero additionally needs an exhaustive country roster and all-country reconciled full-period ledgers, including no missing country rows. This does not identify marketwide gross zeros, developer receipts or causal demand.'
 });
}
