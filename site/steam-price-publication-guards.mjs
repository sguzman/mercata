// Synthetic Steam base-price publication QA. Calendar dates cannot verify Valve's account state.
// A proposed price is not published merely because Valve reviewed it.
const fields=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(key=>keys.includes(key));
const calendar=(value,label)=>{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))
  throw new TypeError('ISO date required for '+label);
 const d=new Date(value+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==value)
  throw new TypeError('Invalid calendar date for '+label);
 return d;
};
const plus30=d=>new Date(d.getTime()+30*86400000);
const iso=d=>d.toISOString().slice(0,10);
const modes=['self_publish_after_review','valve_publish_immediately','automatic_timed_schedule'];
export function auditSyntheticSteamPricePublication(input={}){
 if(!fields(input,['fixture_id','first_paid_release_date','full_release_date',
  'price_change_kind','price_change_review_submitted_on','valve_review_approved_on',
  'intended_publication_on','publication_mode','discounts_committed_before_publication',
  'discount_schedule_complete','proposed_later_discount_start',
  'same_day_review_precedes_publication_attested'])||
  typeof input.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id)||
  !['increase','decrease'].includes(input.price_change_kind)||
  !modes.includes(input.publication_mode)||
  !Array.isArray(input.discounts_committed_before_publication)||
  input.discounts_committed_before_publication.length>32||
  typeof input.discount_schedule_complete!=='boolean')
  throw new TypeError('Only bounded synthetic Steam pricing fixtures accepted');
 const first=calendar(input.first_paid_release_date,'first paid release');
 const full=input.full_release_date==null?null:calendar(input.full_release_date,'v1 full release');
 if(full&&full<=first)throw new RangeError('Full release must follow first paid Early Access release');
 const submitted=calendar(input.price_change_review_submitted_on,'review submission');
 const approved=input.valve_review_approved_on==null?null:
  calendar(input.valve_review_approved_on,'Valve review approval');
 const publish=calendar(input.intended_publication_on,'intended publication');
 const later=input.proposed_later_discount_start==null?null:
  calendar(input.proposed_later_discount_start,'proposed later discount');
 if(submitted>publish||submitted<first||publish<first)
  throw new RangeError('Price-change proposal and publication must follow first paid release in this fixture');
 if(approved&&approved<submitted)
  throw new RangeError('Price approval cannot predate its submission');
 if(later&&later<publish)
  throw new RangeError('Proposed later discount must be on or after price publication');
 if(input.same_day_review_precedes_publication_attested!==undefined&&
   (typeof input.same_day_review_precedes_publication_attested!=='boolean'||
    input.publication_mode!=='self_publish_after_review'))
  throw new TypeError('Same-day manual publication ordering attestation requires manual publication');
 const commitments=input.discounts_committed_before_publication.map((item,i)=>{
  if(!fields(item,['start','end']))throw new TypeError('Malformed already-committed discount');
  const start=calendar(item.start,'committed discount start '+i),
   end=calendar(item.end,'committed discount end '+i);
  if(end<start)throw new RangeError('Committed discount ends before start');
  return {start,end};
 });
 const failures=[];
 const unresolved=[];
 if(publish<plus30(first))failures.push('first_paid_release_price_change_wait_active');
 if(input.publication_mode==='automatic_timed_schedule')
  failures.push('automatic_future_price_publication_not_supported');
 if(approved&&approved>publish)
  failures.push('price_change_not_reviewed_before_intended_publication');
 if(input.publication_mode==='valve_publish_immediately'&&approved&&
    approved.getTime()!==publish.getTime())
  failures.push('valve_immediate_publication_must_follow_review_date');
 if(!approved)unresolved.push('valve_review_approval_not_attested');
 if(input.publication_mode==='self_publish_after_review'&&approved&&
   approved.getTime()===publish.getTime()&&
   input.same_day_review_precedes_publication_attested!==true)
  unresolved.push('same_day_approval_publication_order_unknown');
 const blockedByFuture=commitments.filter(x=>x.start>publish);
 const blockedByActive=commitments.filter(x=>x.start<=publish&&x.end>publish);
 const sameDayEnd=commitments.filter(x=>x.end.getTime()===publish.getTime());
 if(blockedByFuture.length)failures.push('price_change_while_future_discount_already_scheduled');
 if(blockedByActive.length)failures.push('price_change_while_discount_active');
 if(sameDayEnd.length)unresolved.push('discount_end_and_price_publication_same_day_order_unknown');
 if(!input.discount_schedule_complete)unresolved.push('already_committed_discounts_not_exhaustively_attested');
 const waits=input.price_change_kind==='increase'&&later&&later<plus30(publish);
 const discountedAtV1=Boolean(full&&later&&later.getTime()===full.getTime()&&
  input.price_change_kind==='increase'&&later<plus30(publish));
 const result=failures.length?false:unresolved.length?null:true;
 return Object.freeze({
  kind:'synthetic_steam_base_price_publication_not_account_authorization',
  fixture_id:input.fixture_id,
  change_kind:input.price_change_kind,
  publication_mode:input.publication_mode,
  first_paid_release_date:iso(first),
  full_release_date:full?iso(full):null,
  intended_publication_on:iso(publish),
  first_paid_release_price_change_wait_ends:iso(plus30(first)),
  reviewed_price_change_can_be_self_published_later:
   input.publication_mode==='self_publish_after_review',
  automatic_future_price_publication_supported:false,
  review_approval_attested:Boolean(approved),
  review_approval_independently_verified:false,
  review_approved_date:approved?iso(approved):null,
  committed_discount_count:commitments.length,
  blocked_by_future_discount_count:blockedByFuture.length,
  blocked_by_active_discount_count:blockedByActive.length,
  unresolved_same_day_discount_end_count:sameDayEnd.length,
  discount_schedule_complete_as_attested:input.discount_schedule_complete,
  known_publication_blockers:failures,
  unresolved_publication_gates:unresolved,
  conditional_publication_rules_pass:result,
  publication_status:result===true?'passes_documented_gates_conditional_on_fixture':
   result===false?'blocked_by_known_publication_gate':'unresolved_publication_evidence',
  proposed_discount_start:later?iso(later):null,
  discount_cooldown_from_price_change_ends:
   input.price_change_kind==='increase'?iso(plus30(publish)):null,
  proposed_discount_clears_price_change_cooldown:
   later===null?null:input.price_change_kind==='decrease'?true:!waits,
  proposed_v1_launch_discount_blocked_by_recent_price_increase:discountedAtV1,
  real_valve_approval_verified:false,
  actual_price_publication_verified:false,
  all_currencies_validated:false,
  other_discount_gates_evaluated:false,
  customer_orders_observed:null,
  publisher_net_cash_observed:null,
  note:'Date-only synthetic checks; Valve review must precede publication. Manual publication after review is not an automatic timed schedule. Existing scheduled or active discounts block both price directions. Same-day completion order and unverified schedule history remain unresolved. A later proposed discount is hypothetical, not an already-scheduled discount. V1 launch dates and prior discount eligibility require the separate discount sequence checker.'});
}
