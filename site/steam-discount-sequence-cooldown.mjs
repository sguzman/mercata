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
  'discount_percent','last_price_increase_date','previous_discount','relevant_discount_history_complete',
  'official_seasonal_event_verified'])||
  typeof args.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(args.fixture_id)||
  !kinds.includes(args.discount_kind)||!Number.isSafeInteger(args.discount_percent)||
  typeof args.relevant_discount_history_complete!=='boolean')
  throw new TypeError('Only bounded synthetic first-paid discount fixtures accepted');
 const release=asDate(args.first_paid_release_date,'first paid release');
 const start=asDate(args.discount_start,'start');
 const end=asDate(args.discount_end,'end');
 if(end<start)throw new RangeError('Discount end precedes its start');
 const price=args.last_price_increase_date==null?null:asDate(args.last_price_increase_date,'last price increase');
 const seasonalEventAttested=args.official_seasonal_event_verified===true;
 if(args.official_seasonal_event_verified!==undefined&&
    (typeof args.official_seasonal_event_verified!=='boolean'||args.discount_kind!=='official_seasonal'))
  throw new TypeError('Official event attestation is only allowed for seasonal discounts');
 if(price&&price>start)throw new RangeError('Future price increase cannot be treated as past history');
 const prior=args.previous_discount??null;
 if(prior!==null&&(!allowed(prior,['kind','start','end','official_seasonal_event_verified'])||!kinds.includes(prior.kind)))
  throw new TypeError('Malformed previous synthetic discount');
 const previous=prior===null?null:{
  kind:prior.kind,start:asDate(prior.start,'previous discount start'),
  end:asDate(prior.end,'previous discount end')
 };
 const previousEventAttested=previous?.kind==='official_seasonal'&&
  prior.official_seasonal_event_verified===true;
 if(previous&&prior.official_seasonal_event_verified!==undefined&&
    (typeof prior.official_seasonal_event_verified!=='boolean'||previous.kind!=='official_seasonal'))
  throw new TypeError('Previous official event attestation must refer to a seasonal sale');
 if(previous&&(previous.end<previous.start||previous.start<release||previous.end>=start))
  throw new RangeError('Previous discount dates overlap current promotion or precede first paid release');
 if(previous?.kind==='launch'&&previous.start.getTime()!==release.getTime())
  throw new RangeError('An earlier launch discount must begin on first paid release');
 if(previous){
  if(previous.kind!=='launch'&&previous.start<plus30(release))
   throw new RangeError('An earlier non-launch discount cannot bypass first paid release cooldown');
  const priorDays=days(previous.start,previous.end)+1;
  if(previous.kind==='launch'&&(priorDays<7||priorDays>14)||
     previous.kind==='standard'&&priorDays>14)
   throw new RangeError('Previous paid discount duration is inconsistent with current Steam limits');
 }
 if(args.discount_kind==='launch'&&previous)
  throw new RangeError('First-paid launch discount cannot have a prior paid discount');
 const duration=days(start,end)+1;
 const reasons=[];
 if(start<release)reasons.push('starts_before_first_paid_release');
 if(args.discount_kind==='launch'){
  if(start.getTime()!==release.getTime())reasons.push('launch_discount_not_on_release_day');
  if(args.discount_percent<10||args.discount_percent>40)reasons.push('launch_discount_percent_out_of_10_to_40_range');
  if(duration<7||duration>14)reasons.push('launch_discount_days_out_of_7_to_14_range');
 }else{
  if(args.discount_percent<10||args.discount_percent>95)reasons.push('discount_percent_out_of_10_to_95_range');
  if(args.discount_kind==='standard'&&(duration<1||duration>14))
   reasons.push('standard_discount_days_out_of_1_to_14_range');
  if(start<plus30(release))reasons.push('release_cooldown_active');
 }
 if(price&&start<plus30(price))reasons.push('price_increase_cooldown_active');
 const skipPrior=seasonalEventAttested||previousEventAttested;
 const unverifiedSeasonalEvent=
  args.discount_kind==='official_seasonal'&&!seasonalEventAttested||
  previous?.kind==='official_seasonal'&&!previousEventAttested;
 if(previous&&!skipPrior&&!unverifiedSeasonalEvent&&start<plus30(previous.end))
  reasons.push('discount_to_discount_cooldown_active');
 const earliestGates=[release];
 if(args.discount_kind!=='launch')earliestGates.push(plus30(release));
 if(price)earliestGates.push(plus30(price));
 if(previous&&!skipPrior&&!unverifiedSeasonalEvent)earliestGates.push(plus30(previous.end));
 const firstKnown=maxDate(earliestGates);
 const history=args.relevant_discount_history_complete;
 const result=reasons.length?false:history&&!unverifiedSeasonalEvent?true:null;
 return Object.freeze({
  kind:'synthetic_first_paid_steam_discount_cooldown_not_account_authorization',
  fixture_id:args.fixture_id,discount_kind:args.discount_kind,
  discount_percent:args.discount_percent,discount_duration_calendar_days:duration,
  first_allowed_start_date_from_known_cooldowns:unverifiedSeasonalEvent?null:iso(firstKnown),
  release_cooldown_ends:iso(plus30(release)),
  price_increase_cooldown_ends:price?iso(plus30(price)):null,
  previous_discount_cooldown_ends:previous?iso(plus30(previous.end)):null,
  prior_discount_cooldown_exemption_applied:Boolean(previous&&skipPrior),
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
  note:'Official seasonal discounts skip only discount-to-discount cooldowns, never first-paid release or price-rise waits. Official-sale attestations are synthetic assertions, not independently checked event calendars. Date-only model ignores exact 10am Pacific cutoffs, country minimum prices, actual partner setup and unknown earlier discounts.'});
}
