// Date-free synthetic Steam regional minimum-price and discount-depth QA.
// No real currency minima, exchange rates, live package prices or partner permissions are inferred.
const allowed=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const money=(n)=>n===null||(Number.isSafeInteger(n)&&n>=0);
const marketName=(s)=>typeof s==='string'&&/^([A-Z]{3}|USD_(CIS|LATAM|MENA|SASIA))$/.test(s);
const pctOK=n=>Number.isInteger(n)&&n>=10&&n<=95;

export function auditSyntheticSteamRegionalDiscountFloors(input={}){
 if(!allowed(input,['fixture_id','discount_percent','price_state','post_change_prices_published_in_fixture',
   'market_roster_complete_in_fixture','markets'])||
  typeof input.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id)||
  !pctOK(input.discount_percent)||!['current','post_change'].includes(input.price_state)||
  typeof input.market_roster_complete_in_fixture!=='boolean'||
  !Array.isArray(input.markets)||!input.markets.length||input.markets.length>64)
  throw new TypeError('Bounded synthetic regional discount fixture required');
 if(input.price_state==='post_change'&&typeof input.post_change_prices_published_in_fixture!=='boolean'||
    input.price_state==='current'&&input.post_change_prices_published_in_fixture!==undefined)
  throw new TypeError('Proposed price publication attestation must match price_state');
 const seen=new Set();
 let knownBlock=false,unknown=false;
 const rows=input.markets.map(raw=>{
  if(!allowed(raw,['market','current_base_price_units','post_change_base_price_units',
    'minimum_base_price_units','minimum_transaction_price_units'])||
    !marketName(raw.market)||seen.has(raw.market)||
    !money(raw.current_base_price_units)||!money(raw.minimum_base_price_units)||
    !money(raw.minimum_transaction_price_units)||
    raw.post_change_base_price_units!==undefined&&!money(raw.post_change_base_price_units)||
    raw.minimum_base_price_units!==null&&raw.minimum_base_price_units===0||
    raw.minimum_transaction_price_units!==null&&raw.minimum_transaction_price_units===0)
   throw new TypeError('Malformed, duplicate or unsafe regional price row');
  seen.add(raw.market);
  const changed=input.price_state==='post_change'&&
    Object.hasOwn(raw,'post_change_base_price_units');
  const base=changed?raw.post_change_base_price_units:raw.current_base_price_units;
  const minBase=raw.minimum_base_price_units,minTx=raw.minimum_transaction_price_units;
  const unavailable=base===null?true:minTx===null?null:base<minTx;
  const baseEntry=changed?base===null||minBase===null?null:base>=minBase:null;
  const rounded=(base===null)?null:(BigInt(base)*BigInt(100-input.discount_percent));
  const low=rounded===null?null:Number(rounded/100n);
  const high=rounded===null?null:Number((rounded+99n)/100n);
  const discountFloor=minTx===null||low===null?null:
    high<minTx?false:low>=minTx?true:null;
  const marketBlocked=unavailable===true||discountFloor===false||baseEntry===false;
  const marketUnknown=unavailable===null||discountFloor===null||
    changed&&baseEntry===null;
  if(marketBlocked)knownBlock=true;
  if(marketUnknown||base===null)unknown=true;
  return Object.freeze({
   market:raw.market,price_change_applied_to_market_in_fixture:changed,
   base_price_units:base,minimum_base_price_units:minBase,
   minimum_transaction_price_units:minTx,
   current_price_unavailable_in_market:unavailable,
   newly_entered_base_price_meets_minimum:baseEntry,
   proposed_discount_price_lower_bound_units:low,
   proposed_discount_price_upper_bound_units:high,
   proposed_discount_meets_transaction_floor:discountFloor,
   proposed_discount_market_status:marketBlocked?'blocked_by_known_local_minimum':
    marketUnknown?'unresolved_missing_threshold_or_rounding':'clears_supplied_transaction_minimum'
  });
 });
 const proposalUnknown=input.price_state==='post_change'&&
   !input.post_change_prices_published_in_fixture;
 const incomplete=!input.market_roster_complete_in_fixture;
 const pass=knownBlock?false:unknown||incomplete||proposalUnknown?null:true;
 return Object.freeze({
  kind:'synthetic_steam_regional_discount_floor_not_actual_discount_permission',
  fixture_id:input.fixture_id,discount_percent:input.discount_percent,
  price_state:input.price_state,markets_examined:rows.length,
  market_roster_complete_in_fixture:input.market_roster_complete_in_fixture,
  post_change_prices_published_in_fixture:input.price_state==='post_change'?
   input.post_change_prices_published_in_fixture:null,
  market_results:rows,
  markets_with_known_local_blockers:rows.filter(x=>x.proposed_discount_market_status==='blocked_by_known_local_minimum').map(x=>x.market),
  markets_with_unresolved_price_or_floor:rows.filter(x=>x.proposed_discount_market_status==='unresolved_missing_threshold_or_rounding').map(x=>x.market),
  new_discount_scheduling_clears_supplied_minimums:pass,
  floor_status:pass===true?'passes_supplied_minimums_conditional_on_synthetic_completeness':
   pass===false?'blocked_by_supplied_currency_minimum':
   'unresolved_missing_market_price_threshold_rounding_or_publication',
  all_steam_live_currencies_independently_verified:false,
  real_local_minimum_thresholds_independently_verified:false,
  final_steam_rounding_rules_verified:false,
  real_price_change_publication_verified:false,
  steamworks_discount_permission_verified:false,
  sales_in_missing_or_blocked_markets:null,
  true_price_elasticity:null,publisher_receipts:null,
  note:'Units are each market\'s explicitly supplied integral denomination, not globally interchangeable cents. Bounds use floor and ceiling of the unrounded percentage result and cannot resolve a threshold that falls between them. Currency minima, local price increments, live-region coverage, published price history, currency conversion and actual permission must be checked independently. No cross-market monetary summing is performed.'
 });
}
