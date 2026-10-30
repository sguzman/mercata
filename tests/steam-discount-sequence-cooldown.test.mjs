import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamDiscountSequence as check} from '../site/steam-discount-sequence-cooldown.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const base={fixture_id:'fixture-new-indie-game',first_paid_release_date:'2026-08-31',
 discount_kind:'standard',discount_start:'2026-10-02',discount_end:'2026-10-08',
 discount_percent:75,relevant_discount_history_complete:true};
test('The 30-day first-paid release cooldown ends Sep 30; Oct 2 clears that gate',()=>{
 const a=check(base);
 assert.equal(a.release_cooldown_ends,'2026-09-30');
 assert.equal(a.conditional_calendar_rules_pass,true);
 assert.equal(a.calendar_status,'passes_known_rules_conditional_on_attested_history');
 assert.equal(a.discount_duration_calendar_days,7);
 assert.equal(a.actual_partner_eligibility_verified,false);
});
test('Unknown launch or prior-promotion history never silently becomes eligibility approval',()=>{
 const a=check({...base,relevant_discount_history_complete:false});
 assert.equal(a.conditional_calendar_rules_pass,null);
 assert.equal(a.calendar_status,'unresolved_prior_discount_history');
 assert.deepEqual(a.known_calendar_failures,[]);
 assert.equal(a.verified_steam_discount_history,false);
});
test('Earlier standard or launch discount blocks Oct 2, with a 30-day wait from its own end',()=>{
 for(const kind of ['standard','launch']){
  const previous_discount={kind,start:kind==='launch'?'2026-08-31':'2026-09-30',end:kind==='launch'?'2026-09-13':'2026-10-01'};
  const a=check({...base,previous_discount});
  assert.equal(a.previous_discount_cooldown_ends,kind==='launch'?'2026-10-13':'2026-10-31');
  assert.equal(a.first_allowed_start_date_from_known_cooldowns,kind==='launch'?'2026-10-13':'2026-10-31');
  assert.equal(a.conditional_calendar_rules_pass,false);
  assert(a.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
 }
});
test('An ordinary custom promotion is not magically made seasonal by matching sale dates',()=>{
 const previous_discount={kind:'standard',start:'2026-12-01',end:'2026-12-08'};
 const winter={...base,discount_start:'2026-12-17',discount_end:'2026-12-23',discount_percent:20,previous_discount};
 const custom=check(winter);
 assert.equal(custom.conditional_calendar_rules_pass,false);
 assert(custom.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
 const seasonal=check({...winter,discount_kind:'official_seasonal',discount_end:'2027-01-04'});
 assert.equal(seasonal.conditional_calendar_rules_pass,true);
 assert.equal(seasonal.prior_discount_cooldown_exemption_applied,true);
 assert.equal(seasonal.discount_duration_calendar_days,19);
});
test('Earlier official seasonal sale does not start a discount-to-discount cooldown',()=>{
 const out=check({...base,discount_start:'2027-01-05',discount_end:'2027-01-11',discount_percent:20,
  previous_discount:{kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04'}});
 assert.equal(out.conditional_calendar_rules_pass,true);
 assert.equal(out.prior_discount_cooldown_exemption_applied,true);
});
test('Seasonal exception never bypasses the 30-day release or price-increase gates',()=>{
 const seasonal={...base,discount_kind:'official_seasonal',
  discount_start:'2026-09-20',discount_end:'2026-09-27',discount_percent:20};
 assert(check(seasonal).known_calendar_failures.includes('release_cooldown_active'));
 const increase=check({...seasonal,discount_start:'2026-12-17',discount_end:'2027-01-04',
  last_price_increase_date:'2026-12-01'});
 assert.equal(increase.conditional_calendar_rules_pass,false);
 assert(increase.known_calendar_failures.includes('price_increase_cooldown_active'));
});
test('Launch discounts are 7 to 14 days and no more than 40 percent',()=>{
 const launch={...base,discount_kind:'launch',discount_start:'2026-08-31',
  discount_end:'2026-09-07',discount_percent:20};
 assert.equal(check(launch).conditional_calendar_rules_pass,true);
 assert.equal(check({...launch,discount_percent:75}).conditional_calendar_rules_pass,false);
 assert(check({...launch,discount_percent:75}).known_calendar_failures.includes('launch_discount_percent_out_of_10_to_40_range'));
 assert(check({...launch,discount_end:'2026-09-03'}).known_calendar_failures.includes('launch_discount_days_out_of_7_to_14_range'));
 assert(check({...base,discount_start:'2026-09-20',discount_end:'2026-09-26'}).known_calendar_failures.includes('release_cooldown_active'));
});
test('Malformed fixtures and a fabricated overlapping discount history fail closed',()=>{
 assert.throws(()=>check({...base,discount_start:'2026-02-30'}),/Invalid calendar/);
 assert.throws(()=>check({...base,discount_percent:20.5}),/Only bounded synthetic/);
 assert.throws(()=>check({...base,sales_usd:100}),/Only bounded synthetic/);
 assert.throws(()=>check({...base,previous_discount:{kind:'standard',start:'2026-09-29',end:'2026-10-05'}}),/overlap/);
 assert.throws(()=>check({...base,last_price_increase_date:'2026-11-01'}),/Future price increase/);
 assert.throws(()=>check({...base,discount_end:'2026-09-01'}),/precedes/);
});
test('Structured source joins, unknown real economics and original 293-task inventory hold',()=>{
 const x=read('ontology/steam/steam-discount-history-firstpaid-eligibility-2026.json');
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert.equal(x.first_paid_game_case.discount_date,'2026-10-02');
 assert.equal(x.first_paid_game_case.promotion_percent_reported,75);
 assert.equal(x.first_paid_game_case.previous_discount_end_date_verified,null);
 assert.equal(x.policy.discount_after_another_regular_discount_wait_days,30);
 assert.equal(x.policy.seasonal_exception_waives_release_cooldown,false);
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
