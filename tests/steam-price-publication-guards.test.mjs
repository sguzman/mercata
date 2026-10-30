import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSyntheticSteamPricePublication as check} from '../site/steam-price-publication-guards.mjs';
import {auditSyntheticSteamDiscountSequence as discountCheck} from '../site/steam-discount-sequence-cooldown.mjs';
const base={fixture_id:'fixture-early-access-game',first_paid_release_date:'2026-01-15',
 full_release_date:'2026-10-15',price_change_kind:'increase',
 price_change_review_submitted_on:'2026-09-09',
 valve_review_approved_on:'2026-09-11',
 intended_publication_on:'2026-09-15',
 publication_mode:'self_publish_after_review',
 discounts_committed_before_publication:[],discount_schedule_complete:true};
test('An approved price can be manually published later, not auto-timed',()=>{
 const a=check(base);
 assert.equal(a.conditional_publication_rules_pass,true);
 assert.equal(a.publication_status,'passes_documented_gates_conditional_on_fixture');
 assert.equal(a.review_approval_independently_verified,false);
 assert.equal(a.automatic_future_price_publication_supported,false);
 assert.equal(a.real_valve_approval_verified,false);
 const unsupported=check({...base,publication_mode:'automatic_timed_schedule'});
 assert.equal(unsupported.conditional_publication_rules_pass,false);
 assert(unsupported.known_publication_blockers.includes('automatic_future_price_publication_not_supported'));
});
test('Valve immediate publication is distinct from later manual publication',()=>{
 const immediate=check({...base,publication_mode:'valve_publish_immediately',
  intended_publication_on:'2026-09-11'});
 assert.equal(immediate.conditional_publication_rules_pass,true);
 const mismatch=check({...base,publication_mode:'valve_publish_immediately'});
 assert.equal(mismatch.conditional_publication_rules_pass,false);
 assert(mismatch.known_publication_blockers.includes('valve_immediate_publication_must_follow_review_date'));
});
test('Approval evidence cannot be assumed merely from a submitted price proposal',()=>{
 const unknown=check({...base,valve_review_approved_on:null});
 assert.equal(unknown.conditional_publication_rules_pass,null);
 assert(unknown.unresolved_publication_gates.includes('valve_review_approval_not_attested'));
 const late=check({...base,valve_review_approved_on:'2026-09-17'});
 assert.equal(late.conditional_publication_rules_pass,false);
 assert(late.known_publication_blockers.includes('price_change_not_reviewed_before_intended_publication'));
 const same=check({...base,valve_review_approved_on:'2026-09-15'});
 assert.equal(same.conditional_publication_rules_pass,null);
 assert(same.unresolved_publication_gates.includes('same_day_approval_publication_order_unknown'));
 assert.equal(check({...base,valve_review_approved_on:'2026-09-15',
  same_day_review_precedes_publication_attested:true}).conditional_publication_rules_pass,true);
});
test('Existing future discounts block base-price changes regardless of direction',()=>{
 const scheduled=[{start:'2026-10-10',end:'2026-10-16'}];
 for(const kind of ['increase','decrease']){
  const x=check({...base,price_change_kind:kind,
   discounts_committed_before_publication:scheduled});
  assert.equal(x.conditional_publication_rules_pass,false);
  assert.equal(x.blocked_by_future_discount_count,1);
  assert(x.known_publication_blockers.includes('price_change_while_future_discount_already_scheduled'));
 }
});
test('An active discount blocks changes, but a completed earlier discount does not',()=>{
 const active={start:'2026-09-01',end:'2026-09-20'};
 const x=check({...base,discounts_committed_before_publication:[active]});
 assert.equal(x.conditional_publication_rules_pass,false);
 assert(x.known_publication_blockers.includes('price_change_while_discount_active'));
 const finished=check({...base,discounts_committed_before_publication:[
  {start:'2026-09-01',end:'2026-09-14'}]});
 assert.equal(finished.conditional_publication_rules_pass,true);
});
test('Same-day end and price change stays unresolved without exact-hour sequence evidence',()=>{
 const x=check({...base,intended_publication_on:'2026-09-14',
  discounts_committed_before_publication:[{start:'2026-09-01',end:'2026-09-14'}]});
 assert.equal(x.conditional_publication_rules_pass,null);
 assert.equal(x.unresolved_same_day_discount_end_count,1);
 assert(x.unresolved_publication_gates.includes('discount_end_and_price_publication_same_day_order_unknown'));
});
test('A complete committed-discount history is required even when no conflict is supplied',()=>{
 const x=check({...base,discount_schedule_complete:false});
 assert.equal(x.conditional_publication_rules_pass,null);
 assert(x.unresolved_publication_gates.includes('already_committed_discounts_not_exhaustively_attested'));
});
test('Price increase creates 30-day discount wait; price decrease does not',()=>{
 const increased=check({...base,proposed_later_discount_start:'2026-10-14'});
 assert.equal(increased.conditional_publication_rules_pass,true);
 assert.equal(increased.discount_cooldown_from_price_change_ends,'2026-10-15');
 assert.equal(increased.proposed_discount_clears_price_change_cooldown,false);
 assert.equal(check({...base,proposed_later_discount_start:'2026-10-15'})
  .proposed_discount_clears_price_change_cooldown,true);
 const decrease=check({...base,price_change_kind:'decrease',
  proposed_later_discount_start:'2026-09-16'});
 assert.equal(decrease.discount_cooldown_from_price_change_ends,null);
 assert.equal(decrease.proposed_discount_clears_price_change_cooldown,true);
 assert.equal(decrease.other_discount_gates_evaluated,false);
});
test('A v1 launch discount cannot coincide with a newly raised price',()=>{
 const raised={...base,price_change_review_submitted_on:'2026-10-10',
  valve_review_approved_on:'2026-10-12',intended_publication_on:'2026-10-15',
  proposed_later_discount_start:'2026-10-15'};
 const audit=check(raised);
 assert.equal(audit.conditional_publication_rules_pass,true);
 assert.equal(audit.proposed_v1_launch_discount_blocked_by_recent_price_increase,true);
 assert.equal(audit.proposed_discount_clears_price_change_cooldown,false);
 const calendar=discountCheck({
  fixture_id:'fixture-early-access-game',first_paid_release_date:'2026-01-15',
  full_release_date:'2026-10-15',discount_kind:'launch',
  discount_start:'2026-10-15',discount_end:'2026-10-21',
  discount_percent:20,last_price_increase_date:'2026-10-15',
  relevant_discount_history_complete:true
 });
 assert.equal(calendar.conditional_calendar_rules_pass,false);
 assert(calendar.known_calendar_failures.includes('price_increase_cooldown_active'));
});
test('Changing base price in initial first paid release wait is blocked by default',()=>{
 const x=check({...base,price_change_review_submitted_on:'2026-01-20',
  valve_review_approved_on:'2026-01-25',intended_publication_on:'2026-01-30'});
 assert.equal(x.conditional_publication_rules_pass,false);
 assert(x.known_publication_blockers.includes('first_paid_release_price_change_wait_active'));
 const threshold=check({...base,price_change_review_submitted_on:'2026-01-20',
  valve_review_approved_on:'2026-01-25',intended_publication_on:'2026-02-14'});
 assert.equal(threshold.conditional_publication_rules_pass,true);
});
test('Synthetic proposal schema rejects impossible review dates and unsupported account claims',()=>{
 assert.throws(()=>check({...base,price_change_kind:'everything'}),/bounded synthetic/);
 assert.throws(()=>check({...base,developer_sales:500}),/bounded synthetic/);
 assert.throws(()=>check({...base,discounts_committed_before_publication:null}),/bounded synthetic/);
 assert.throws(()=>check({...base,discounts_committed_before_publication:Array(33).fill({start:'2026-09-01',end:'2026-09-02'})}),/bounded synthetic/);
 assert.throws(()=>check({...base,price_change_review_submitted_on:'2026-09-16'}),/must follow first paid release/);
 assert.throws(()=>check({...base,valve_review_approved_on:'2026-09-01'}),/cannot predate/);
 assert.throws(()=>check({...base,proposed_later_discount_start:'2026-09-14'}),/on or after/);
 assert.throws(()=>check({...base,discounts_committed_before_publication:[{start:'2026-09-10',end:'2026-09-09'}]}),/ends before start/);
 assert.throws(()=>check({...base,intended_publication_on:'2026-02-30'}),/Invalid calendar/);
 assert.throws(()=>check({...base,same_day_review_precedes_publication_attested:true,
  publication_mode:'valve_publish_immediately'}),/requires manual/);
});
