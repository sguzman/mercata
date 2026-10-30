// Pure synthetic game-by-store-country observation audit.
// Never place actual partner financial records or account identifiers in this repository.
const allowed=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const date=(s)=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const next=s=>{const d=new Date(s+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10)};
const safe=n=>Number.isSafeInteger(n)&&n>=0;
const states=['purchasable','not_purchasable','unresolved'];
const reasons=['missing_price','below_transaction_floor','store_restriction','other_verified_block'];
const ledgers=['complete_reconciled','partial','missing'];
const eligibility=['eligible_paid_initially','ineligible_initially_free','unresolved'];
const rowFields=['fixture_game_id','store_country','initial_paid_status','first_paid_release_date',
 'availability_segments','ledger_status','observed_gross_paid_units','covered_from','covered_until_exclusive',
 'authorized_financials_attested','transfers_reconciled','checkout_attribution_attested',
 'country_attribution_attested'];
export function auditSyntheticSteamCountryAvailabilityZeroBounds(rows,options={}){
 if(!Array.isArray(rows)||rows.length>128||!allowed(options,['start','endExclusive','asOfDate',
  'game_frame_complete','country_roster_complete'])||
  !date(options.start)||!date(options.endExclusive)||options.start>=options.endExclusive||
  !date(options.asOfDate)||typeof options.game_frame_complete!=='boolean'||
  typeof options.country_roster_complete!=='boolean')
  throw new TypeError('Bounded fixed-period synthetic observation frame required');
 const mature=options.endExclusive<=next(options.asOfDate);
 const ids=new Set();
 const counts={eligible_country_windows:0,excluded_initially_free_windows:0,
  unresolved_initial_paid_status_windows:0,
  fully_purchasable_windows:0,never_purchasable_windows:0,
  mixed_purchasability_windows:0,unresolved_purchasability_windows:0,
  fully_purchasable_confirmed_zero:0,fully_purchasable_known_nonzero:0,
  fully_purchasable_unknown_zero:0,never_purchasable_confirmed_zero:0,
  mixed_or_unresolved_access_confirmed_zero:0};
 const entries=[];
 for(const row of rows){
  if(!allowed(row,rowFields)||typeof row.fixture_game_id!=='string'||
     !/^fixture-[a-z0-9-]+$/.test(row.fixture_game_id)||
     typeof row.store_country!=='string'||!/^[A-Z]{2}$/.test(row.store_country)||
     !eligibility.includes(row.initial_paid_status))
   throw new TypeError('Only fictional game IDs, two-letter store countries and documented fields');
  const key=row.fixture_game_id+'|'+row.store_country;
  if(ids.has(key))throw new RangeError('Duplicate game and store-country observation');
  ids.add(key);
  if(row.initial_paid_status!=='eligible_paid_initially'){
   if(row.availability_segments!==undefined||row.ledger_status!==undefined||
     row.observed_gross_paid_units!==undefined||row.covered_from!==undefined||
     row.covered_until_exclusive!==undefined||row.authorized_financials_attested!==undefined||
     row.transfers_reconciled!==undefined||row.checkout_attribution_attested!==undefined||
     row.country_attribution_attested!==undefined)
    throw new RangeError('Ineligible or unresolved initial paid status cannot carry paid checkout observations');
   const knownFree=row.initial_paid_status==='ineligible_initially_free';
   counts[knownFree?'excluded_initially_free_windows':'unresolved_initial_paid_status_windows']++;
   entries.push({fixture_game_id:row.fixture_game_id,store_country:row.store_country,
    availability_class:knownFree?'excluded_initially_free':'unresolved_initial_paid_status',
    zero_class:'not_identifiable'});
   continue;
  }
  counts.eligible_country_windows++;
  if(!date(row.first_paid_release_date)||row.first_paid_release_date>options.start)
   throw new TypeError('First paid release must precede the fixed observation window');
  if(!Array.isArray(row.availability_segments)||!row.availability_segments.length||
    row.availability_segments.length>32)
   throw new TypeError('A bounded complete availability timeline is required');
  let cursor=options.start,anyOpen=false,anyBlocked=false,anyUnresolved=false;
  for(const seg of row.availability_segments){
   if(!allowed(seg,['start','endExclusive','state','reason'])||
     !date(seg.start)||!date(seg.endExclusive)||seg.start!==cursor||
     seg.endExclusive<=seg.start||seg.endExclusive>options.endExclusive||
     !states.includes(seg.state))
    throw new RangeError('Availability intervals must be contiguous and within the complete study window');
   if(seg.state==='not_purchasable'&&!reasons.includes(seg.reason)||
      seg.state!=='not_purchasable'&&seg.reason!==undefined)
    throw new TypeError('A blocked period requires a precise market-access reason');
   anyOpen ||= seg.state==='purchasable';
   anyBlocked ||= seg.state==='not_purchasable';
   anyUnresolved ||= seg.state==='unresolved';
   cursor=seg.endExclusive;
  }
  if(cursor!==options.endExclusive)throw new RangeError('Incomplete availability coverage');
  const access=anyUnresolved?'unresolved':anyOpen&&anyBlocked?'mixed':
   anyOpen?'fully_purchasable':'never_purchasable';
  counts[access==='fully_purchasable'?'fully_purchasable_windows':
   access==='never_purchasable'?'never_purchasable_windows':
   access==='mixed'?'mixed_purchasability_windows':'unresolved_purchasability_windows']++;
  if(!ledgers.includes(row.ledger_status))
   throw new TypeError('Explicit missing, partial or complete ledger status required');
  const fields=['covered_from','covered_until_exclusive','authorized_financials_attested',
    'transfers_reconciled','checkout_attribution_attested','country_attribution_attested'];
  if(row.ledger_status==='missing'){
   if(row.observed_gross_paid_units!==null&&row.observed_gross_paid_units!==undefined||
     fields.some(k=>row[k]!==undefined&&row[k]!==null&&row[k]!==false))
    throw new RangeError('Missing ledger cannot certify zero sales or financial coverage');
  }else{
   if(!safe(row.observed_gross_paid_units)||!date(row.covered_from)||
     !date(row.covered_until_exclusive)||row.covered_from<options.start||
     row.covered_until_exclusive>options.endExclusive||
     row.covered_until_exclusive>next(options.asOfDate)||
     row.covered_from>=row.covered_until_exclusive)
    throw new TypeError('Observed units need bounded ledger coverage');
   const allAttested=row.authorized_financials_attested===true&&
     row.checkout_attribution_attested===true&&
     row.country_attribution_attested===true;
   if(row.ledger_status==='complete_reconciled'&&
     (!mature||row.covered_from!==options.start||
      row.covered_until_exclusive!==options.endExclusive||
      row.transfers_reconciled!==true||!allAttested))
    throw new RangeError('Complete ledger requires matured full-period country and game attribution, access and transfers');
   if(row.observed_gross_paid_units>0&&!allAttested)
    throw new RangeError('Partial positive sales need authorized game and country checkout attribution');
   if(row.observed_gross_paid_units>0&&access==='never_purchasable')
    throw new RangeError('Paid store-country purchases contradict an entirely unavailable fixture window');
  }
  const provenZero=row.ledger_status==='complete_reconciled'&&row.observed_gross_paid_units===0;
  const knownPositive=row.ledger_status!=='missing'&&row.observed_gross_paid_units>0&&
    row.authorized_financials_attested===true&&row.checkout_attribution_attested===true&&
    row.country_attribution_attested===true;
  const zeroClass=provenZero?(access==='fully_purchasable'?'observed_zero_with_full_purchase_access':
   access==='never_purchasable'?'observed_structural_zero_without_purchase_access':
    'observed_zero_without_full_access'):
   knownPositive?'observed_positive_paid_units':'unresolved_paid_zero_status';
  if(provenZero){
   if(access==='fully_purchasable')counts.fully_purchasable_confirmed_zero++;
   else if(access==='never_purchasable')counts.never_purchasable_confirmed_zero++;
   else counts.mixed_or_unresolved_access_confirmed_zero++;
  }
  if(access==='fully_purchasable'){
   if(knownPositive)counts.fully_purchasable_known_nonzero++;
   else if(!provenZero)counts.fully_purchasable_unknown_zero++;
  }
  entries.push({fixture_game_id:row.fixture_game_id,store_country:row.store_country,
   availability_class:access,ledger_status:row.ledger_status,
   zero_class:zeroClass,observed_paid_units:row.ledger_status==='missing'?null:row.observed_gross_paid_units});
 }
 const denominatorIdentified=options.game_frame_complete&&options.country_roster_complete&&mature&&
   counts.unresolved_purchasability_windows===0&&
   counts.unresolved_initial_paid_status_windows===0&&counts.fully_purchasable_windows>0;
 const lower=denominatorIdentified?
  counts.fully_purchasable_confirmed_zero/counts.fully_purchasable_windows:null;
 const upper=denominatorIdentified?
  (counts.fully_purchasable_confirmed_zero+counts.fully_purchasable_unknown_zero)/
   counts.fully_purchasable_windows:null;
 return Object.freeze({
  kind:'synthetic_steam_game_store_country_access_stratified_zero_bounds',
  window_start:options.start,window_end_exclusive:options.endExclusive,
  observation_matured:mature,
  game_frame_complete_attested:options.game_frame_complete,
  country_roster_complete_attested:options.country_roster_complete,
  counts,entries,
  fully_purchasable_country_window_zero_share_lower_conditional:lower,
  fully_purchasable_country_window_zero_share_upper_conditional:upper,
  actual_steam_game_zero_sale_fraction:null,
  actual_country_demand_zero_fraction:null,
  actual_publisher_net_income:null,
  game_level_zero_sales_inferred_from_country_rows:false,
  price_group_to_country_mapping_inferred:false,
  missing_financial_report_interpreted_as_zero:false,
  real_financial_or_private_account_data_used:false,
  caveat:'This is a synthetic AppID-by-store-country window, not a person denominator or an actual market census. Only full-period purchasable windows enter the conditional exposure denominator. An entirely unavailable market can have an observed structural zero but cannot establish failed demand. Do not sum country zero-window fractions into a game-level zero rate. Retail keys, bundles, returns and partner payouts are not observed; real financial data require authorization and package-to-game attribution.'
 });
}
