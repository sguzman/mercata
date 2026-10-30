// Calendar-day Steam discount QA for invented first-paid game fixtures only.
// This is not a Steamworks account permission checker or a price/revenue predictor.
const allowed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const asDate=(s,label)=>{
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('ISO date required: '+label);
 const date=new Date(s+'T00:00:00Z');
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==s)
  throw new TypeError('Invalid calendar date: '+label);
 return date;
};
const days=(a,b)=>(b.getTime()-a.getTime())/86400000;
const plus30=d=>new Date(d.getTime()+30*86400000);
const iso=d=>d.toISOString().slice(0,10);
const maxDate=(values)=>new Date(Math.max(...values.map(x=>x.getTime())));
const kinds=['launch','standard','official_seasonal'];

export function auditSyntheticSteamDiscountSequence(args={}){
 if(!allowed(args,['fixture_id','first_paid_release_date','discount_kind','discount_start','discount_end',
  'discount_percent','full_release_date','last_price_increase_date','price_increase_dates','previous_discount','previous_discounts','relevant_discount_history_complete',
  'official_seasonal_event_verified'])||
  typeof args.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(args.fixture_id)||
  !kinds.includes(args.discount_kind)||!Number.isSafeInteger(args.discount_percent)||
  typeof args.relevant_discount_history_complete!=='boolean')
  throw new TypeError('Only bounded synthetic first-paid discount fixtures accepted');
 const release=asDate(args.first_paid_release_date,'first paid release');
 const full=args.full_release_date==null?null:asDate(args.full_release_date,'full release');
 if(full&&full<=release)throw new RangeError('Full release must follow the first paid Early Access release');
 const start=asDate(args.discount_start,'start');
 const end=asDate(args.discount_end,'end');
 if(end<start)throw new RangeError('Discount end precedes its start');
 const singlePrice=Object.hasOwn(args,'last_price_increase_date');
 const multiPrice=Object.hasOwn(args,'price_increase_dates');
 if(singlePrice&&multiPrice)
  throw new TypeError('Supply either last_price_increase_date or price_increase_dates, not both');
 const priceInput=multiPrice?args.price_increase_dates:
  args.last_price_increase_date==null?[]:[args.last_price_increase_date];
 if(!Array.isArray(priceInput)||priceInput.length>64)
  throw new TypeError('Price-increase history must be an array of at most 64 dates');
 const prices=priceInput.map((value,i)=>asDate(value,'price increase '+i));
 for(const [i,date] of prices.entries()){
  if(date>start)throw new RangeError('Future price increase cannot be treated as past history');
  if(i&&date<=prices[i-1])throw new RangeError('Price-increase dates must be strictly chronological');
 }
 const price=prices.at(-1)??null;
 const seasonalEventAttested=args.official_seasonal_event_verified===true;
 if(args.official_seasonal_event_verified!==undefined&&
    (typeof args.official_seasonal_event_verified!=='boolean'||args.discount_kind!=='official_seasonal'))
  throw new TypeError('Official event attestation is only allowed for seasonal discounts');
 const singleHistory=Object.hasOwn(args,'previous_discount');
 const arrayHistory=Object.hasOwn(args,'previous_discounts');
 if(singleHistory&&arrayHistory)
  throw new TypeError('Supply either previous_discount or previous_discounts, not both');
 const input=arrayHistory?args.previous_discounts:
  args.previous_discount==null?[]:[args.previous_discount];
 if(!Array.isArray(input)||input.length>64)
  throw new TypeError('Previous synthetic discount history must be an array of at most 64 entries');
 const previousDiscounts=input.map((raw,i)=>{
  if(!allowed(raw,['kind','start','end','official_seasonal_event_verified'])||!kinds.includes(raw.kind))
   throw new TypeError('Malformed previous synthetic discount');
  if(raw.official_seasonal_event_verified!==undefined&&
    (typeof raw.official_seasonal_event_verified!=='boolean'||raw.kind!=='official_seasonal'))
   throw new TypeError('Previous official event attestation must refer to a seasonal sale');
  return {kind:raw.kind,start:asDate(raw.start,'previous discount start '+i),
   end:asDate(raw.end,'previous discount end '+i),
   eventAttested:raw.kind==='official_seasonal'&&raw.official_seasonal_event_verified===true};
 });
 let latestNonseasonal=null;
 for(const [i,prior] of previousDiscounts.entries()){
  if(prior.end<prior.start||prior.start<release||prior.end>=start)
   throw new RangeError('Previous discount dates overlap current promotion or precede first paid release');
  if(i&&previousDiscounts[i-1].end>=prior.start)
   throw new RangeError('Previous discount history overlaps or is out of chronological order');
  const earlyLaunch=prior.start.getTime()===release.getTime();
  const fullLaunch=full&&prior.start.getTime()===full.getTime();
  if(prior.kind==='launch'&&!earlyLaunch&&!fullLaunch)
   throw new RangeError('An earlier launch discount must start on Early Access or full release day');
  if(prior.kind==='launch'&&earlyLaunch&&i!==0)
   throw new RangeError('An Early Access launch discount must be the first historical promotion');
  if(prior.kind==='launch'&&fullLaunch&&prior.start<plus30(release))
   throw new RangeError('A full-release launch discount needs 30 days since Early Access began');
  for(const increase of prices){
   if(increase>=prior.start&&increase<=prior.end)
    throw new RangeError('A base-price increase cannot occur during a previous discount');
   if(increase<prior.start&&prior.start<plus30(increase))
    throw new RangeError('A previous discount cannot begin during a price-increase cooldown');
  }
  if(prior.kind!=='launch'&&prior.start<plus30(release))
   throw new RangeError('An earlier non-launch discount cannot bypass first paid release cooldown');
  if(prior.kind!=='launch'&&full&&prior.start>=full&&prior.start<plus30(full))
   throw new RangeError('An earlier non-launch discount cannot bypass full-release cooldown');
  const priorDays=days(prior.start,prior.end)+1;
  if(prior.kind==='launch'&&(priorDays<7||priorDays>14)||
     prior.kind==='standard'&&(priorDays<1||priorDays>14))
   throw new RangeError('Previous paid discount duration is inconsistent with current Steam limits');
  // Seasonal sales never reset an ordinary discount cooldown between two
  // nonseasonal events, even when they are immediately between those events.
  if(prior.kind!=='official_seasonal'){
   if(latestNonseasonal&&prior.start<plus30(latestNonseasonal.end))
    throw new RangeError('Previous nonseasonal discounts violate discount-to-discount cooldown');
   latestNonseasonal=prior;
  }
 }
 if(args.discount_kind==='launch'&&start.getTime()===release.getTime()&&previousDiscounts.length)
  throw new RangeError('First-paid Early Access launch discount cannot have a prior paid discount');
 const previous=previousDiscounts.at(-1)??null;
 const previousEventAttested=previous?.kind==='official_seasonal'&&previous.eventAttested;
 const duration=days(start,end)+1;
 const launchStage=args.discount_kind==='launch'?
  start.getTime()===release.getTime()?'early_access':
   full&&start.getTime()===full.getTime()?'full_release':null:null;
 const reasons=[];
 if(start<release)reasons.push('starts_before_first_paid_release');
 if(args.discount_kind==='launch'){
  if(launchStage===null)reasons.push('launch_discount_not_on_release_day');
  if(launchStage==='full_release'&&start<plus30(release))
   reasons.push('early_access_to_full_release_launch_cooldown_active');
  if(args.discount_percent<10||args.discount_percent>40)reasons.push('launch_discount_percent_out_of_10_to_40_range');
  if(duration<7||duration>14)reasons.push('launch_discount_days_out_of_7_to_14_range');
 }else{
  if(args.discount_percent<10||args.discount_percent>95)reasons.push('discount_percent_out_of_10_to_95_range');
  if(args.discount_kind==='standard'&&(duration<1||duration>14))
   reasons.push('standard_discount_days_out_of_1_to_14_range');
  if(start<plus30(release))reasons.push('release_cooldown_active');
  if(full&&start>=full&&start<plus30(full))reasons.push('full_release_cooldown_active');
 }
 if(price&&start<plus30(price))reasons.push('price_increase_cooldown_active');
 const unverifiedSeasonalEvent=
  args.discount_kind==='official_seasonal'&&!seasonalEventAttested||
  previousDiscounts.some(p=>p.kind==='official_seasonal'&&!p.eventAttested);
 // Check the last nonseasonal discount, not merely the immediately preceding
 // event. An intervening seasonal sale does not waive this cooldown.
 if(latestNonseasonal&&args.discount_kind!=='official_seasonal'&&start<plus30(latestNonseasonal.end))
  reasons.push('discount_to_discount_cooldown_active');
 const earliestGates=[release];
 if(args.discount_kind!=='launch')earliestGates.push(plus30(release));
 if(full&&args.discount_kind!=='launch'&&start>=full)earliestGates.push(plus30(full));
 if(price)earliestGates.push(plus30(price));
 if(latestNonseasonal&&!seasonalEventAttested)earliestGates.push(plus30(latestNonseasonal.end));
 const firstKnown=maxDate(earliestGates);
 const history=args.relevant_discount_history_complete;
 const result=reasons.length?false:history&&!unverifiedSeasonalEvent?true:null;
 return Object.freeze({
  kind:'synthetic_first_paid_steam_discount_cooldown_not_account_authorization',
  fixture_id:args.fixture_id,discount_kind:args.discount_kind,
  launch_stage:launchStage,
  full_release_date:full?iso(full):null,
  full_release_cooldown_ends:full?iso(plus30(full)):null,
  discount_percent:args.discount_percent,discount_duration_calendar_days:duration,
  // A launch offer must begin on the actual release day. If that day misses a
  // cooldown, shifting the start date would no longer make it a launch offer.
  first_allowed_start_date_from_known_cooldowns:
   unverifiedSeasonalEvent?null:args.discount_kind==='launch'?
    reasons.length?null:iso(start):iso(firstKnown),
  release_cooldown_ends:iso(plus30(release)),
  price_increase_count:prices.length,
  price_increase_cooldown_ends:price?iso(plus30(price)):null,
  previous_discount_count:previousDiscounts.length,
  previous_discount_cooldown_ends:previous?iso(plus30(previous.end)):null,
  latest_nonseasonal_discount_cooldown_ends:latestNonseasonal?iso(plus30(latestNonseasonal.end)):null,
  prior_discount_cooldown_exemption_applied:Boolean(previous&&(
   seasonalEventAttested||(previousEventAttested&&
    (!latestNonseasonal||start>=plus30(latestNonseasonal.end))))),
  official_seasonal_event_attested:seasonalEventAttested,
  previous_official_seasonal_event_attested:Boolean(previousEventAttested),
  unresolved_official_seasonal_event: Boolean(unverifiedSeasonalEvent),
  official_event_independently_verified_by_model:false,
  known_calendar_failures:reasons,
  relevant_discount_history_complete:history,
  conditional_calendar_rules_pass:result,
  calendar_status:result===true?'passes_known_rules_conditional_on_attested_history':
   result===false?'blocked_by_known_rules':unverifiedSeasonalEvent?
   'unresolved_official_seasonal_event_attestation':'unresolved_prior_discount_history',
  actual_partner_eligibility_verified:false,
  local_currency_minimum_price_verified:false,
  verified_steam_discount_history:false,
  release_to_v1_early_access_transition_modeled:false,
  causal_discount_revenue_increment:null,
  note:'Official seasonal discounts skip only discount-to-discount cooldowns, never first-paid release or price-rise waits. Official-sale attestations are synthetic assertions, not independently checked event calendars. Release cooldowns apply separately to Early Access and full release; a launch discount is modeled only on the corresponding release date. Nonseasonal cooldowns are checked across the entire supplied ordered history, which is still only a synthetic attestation. Price-increase history is also only a dated fixture, not an authenticated price ledger. Date-only model ignores exact 10am Pacific cutoffs, country minimum prices, actual partner setup and unknown earlier discounts.'});
}
