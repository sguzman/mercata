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
 const seasonal=check({...winter,discount_kind:'official_seasonal',official_seasonal_event_verified:true,discount_end:'2027-01-04'});
 assert.equal(seasonal.conditional_calendar_rules_pass,true);
 assert.equal(seasonal.prior_discount_cooldown_exemption_applied,true);
 assert.equal(seasonal.discount_duration_calendar_days,19);
});
test('Earlier official seasonal sale does not start a discount-to-discount cooldown',()=>{
 const out=check({...base,discount_start:'2027-01-05',discount_end:'2027-01-11',discount_percent:20,
  previous_discount:{kind:'official_seasonal',official_seasonal_event_verified:true,start:'2026-12-17',end:'2027-01-04'}});
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

test('A bare seasonal label must not manufacture an exemption for a fictional official event',()=>{
 const prior={kind:'standard',start:'2026-12-01',end:'2026-12-08'};
 const x=check({...base,discount_kind:'official_seasonal',discount_start:'2026-12-17',
  discount_end:'2027-01-04',discount_percent:20,previous_discount:prior});
 assert.equal(x.conditional_calendar_rules_pass,null);
 assert.equal(x.calendar_status,'unresolved_official_seasonal_event_attestation');
 assert.equal(x.prior_discount_cooldown_exemption_applied,false);
 assert.equal(x.first_allowed_start_date_from_known_cooldowns,null);
 assert.equal(x.official_event_independently_verified_by_model,false);
});
test('A previous unverified seasonal label does not silently remove the next discount cooldown',()=>{
 const prev={kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04'};
 const unresolved=check({...base,discount_start:'2027-01-05',
  discount_end:'2027-01-11',discount_percent:20,previous_discount:prev});
 assert.equal(unresolved.conditional_calendar_rules_pass,null);
 assert.equal(unresolved.unresolved_official_seasonal_event,true);
 const attested=check({...base,discount_start:'2027-01-05',discount_end:'2027-01-11',
  discount_percent:20,previous_discount:{...prev,official_seasonal_event_verified:true}});
 assert.equal(attested.conditional_calendar_rules_pass,true);
 assert.equal(attested.prior_discount_cooldown_exemption_applied,true);
 assert.equal(attested.official_event_independently_verified_by_model,false);
});
test('A standard promotion cannot misrepresent an official seasonal-sale attestation',()=>{
 assert.throws(()=>check({...base,official_seasonal_event_verified:true}),/only allowed for seasonal/);
 assert.throws(()=>check({...base,official_seasonal_event_verified:'true'}),/only allowed for seasonal/);
 assert.throws(()=>check({...base,previous_discount:{kind:'standard',start:'2026-09-30',
  end:'2026-10-01',official_seasonal_event_verified:true}}),/Previous official event/);
});
test('Earlier discounts cannot be used as valid history across a price-increase conflict',()=>{
 const prior={kind:'standard',start:'2026-12-01',end:'2026-12-08'};
 const later={...base,discount_start:'2027-01-15',discount_end:'2027-01-21',
  discount_percent:20,previous_discount:prior};
 for(const last_price_increase_date of ['2026-12-01','2026-12-04','2026-12-08']){
  assert.throws(()=>check({...later,last_price_increase_date}),/cannot occur during a previous discount/);
 }
 assert.throws(()=>check({...later,last_price_increase_date:'2026-11-02'}),
  /previous discount cannot begin during a price-increase cooldown/i);
 // 30 whole days, not a blanket 31-day prohibition.
 assert.equal(check({...later,last_price_increase_date:'2026-11-01'}).conditional_calendar_rules_pass,true);
 assert.equal(check({...later,last_price_increase_date:'2026-12-09'}).conditional_calendar_rules_pass,true);
 const official={kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04',
  official_seasonal_event_verified:true};
 assert.throws(()=>check({...later,previous_discount:official,last_price_increase_date:'2026-12-20'}),
  /cannot occur during a previous discount/);
});
test('Multiple previous standard discounts carry the latest cooldown forward',()=>{
 const history=[
  {kind:'standard',start:'2026-09-30',end:'2026-10-06'},
  {kind:'standard',start:'2026-11-10',end:'2026-11-17'}
 ];
 const a=check({...base,discount_start:'2026-12-18',discount_end:'2026-12-24',
  discount_percent:20,previous_discounts:history});
 assert.equal(a.conditional_calendar_rules_pass,true);
 assert.equal(a.previous_discount_count,2);
 assert.equal(a.previous_discount_cooldown_ends,'2026-12-17');
 assert.equal(a.latest_nonseasonal_discount_cooldown_ends,'2026-12-17');
 assert.equal(a.first_allowed_start_date_from_known_cooldowns,'2026-12-17');
 const b=check({...base,discount_start:'2026-12-16',discount_end:'2026-12-22',
  discount_percent:20,previous_discounts:history});
 assert.equal(b.conditional_calendar_rules_pass,false);
 assert(b.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
});
test('An attested intervening seasonal sale cannot erase an earlier regular cooldown',()=>{
 const history=[
  {kind:'standard',start:'2026-12-01',end:'2026-12-08'},
  {kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04',
   official_seasonal_event_verified:true}
 ];
 const current={...base,discount_start:'2027-01-05',discount_end:'2027-01-11',
  discount_percent:20,previous_discounts:history};
 const blocked=check(current);
 assert.equal(blocked.conditional_calendar_rules_pass,false);
 assert.equal(blocked.previous_discount_cooldown_ends,'2027-02-03');
 assert.equal(blocked.latest_nonseasonal_discount_cooldown_ends,'2027-01-07');
 assert(blocked.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
 assert.equal(blocked.prior_discount_cooldown_exemption_applied,false);
 const allowed=check({...current,discount_start:'2027-01-08',discount_end:'2027-01-14'});
 assert.equal(allowed.conditional_calendar_rules_pass,true);
 assert.equal(allowed.first_allowed_start_date_from_known_cooldowns,'2027-01-07');
 assert.equal(allowed.prior_discount_cooldown_exemption_applied,true);
});
test('Seasonal events are exempt only with separate synthetic attestations',()=>{
 const history=[{kind:'standard',start:'2026-12-01',end:'2026-12-08'}];
 const current={...base,discount_kind:'official_seasonal',discount_start:'2026-12-17',
  discount_end:'2027-01-04',discount_percent:20,previous_discounts:history};
 assert.equal(check({...current,official_seasonal_event_verified:true}).conditional_calendar_rules_pass,true);
 assert.equal(check(current).conditional_calendar_rules_pass,null);
 const unknown=[...history,{kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04'}];
 const later={...base,discount_start:'2027-01-09',discount_end:'2027-01-15',
  discount_percent:20,previous_discounts:unknown};
 const unresolved=check(later);
 assert.equal(unresolved.conditional_calendar_rules_pass,null);
 assert.equal(unresolved.first_allowed_start_date_from_known_cooldowns,null);
 const knownBlock=check({...later,discount_start:'2027-01-05',discount_end:'2027-01-11'});
 assert.equal(knownBlock.conditional_calendar_rules_pass,false);
});
test('Earlier ordinary discounts remain separate even with seasonal sale between them',()=>{
 const prior=[
  {kind:'standard',start:'2026-12-01',end:'2026-12-08'},
  {kind:'official_seasonal',start:'2026-12-17',end:'2027-01-04',
   official_seasonal_event_verified:true},
  {kind:'standard',start:'2027-01-05',end:'2027-01-11'}
 ];
 assert.throws(()=>check({...base,discount_start:'2027-03-01',discount_end:'2027-03-07',
  discount_percent:20,previous_discounts:prior}),/nonseasonal discounts violate/);
});
test('Multiple discounts must be ordered, nonoverlapping and within price-increase gates',()=>{
 const first={kind:'standard',start:'2026-10-01',end:'2026-10-07'};
 const second={kind:'standard',start:'2026-11-10',end:'2026-11-16'};
 const current={...base,discount_start:'2027-01-15',discount_end:'2027-01-21',
  discount_percent:20,previous_discounts:[first,second]};
 assert.throws(()=>check({...current,previous_discounts:[second,first]}),/chronological order/);
 assert.throws(()=>check({...current,previous_discounts:[first,first]}),/overlaps/);
 assert.throws(()=>check({...current,last_price_increase_date:'2026-10-04'}),
  /cannot occur during a previous discount/);
 assert.throws(()=>check({...current,last_price_increase_date:'2026-09-20'}),
  /cannot begin during a price-increase cooldown/);
 assert.throws(()=>check({...current,previous_discount:first}),/either previous_discount or previous_discounts/);
 assert.throws(()=>check({...current,previous_discounts:null}),/array of at most/);
 assert.throws(()=>check({...current,previous_discounts:Array(65).fill(first)}),/at most 64/);
 const single=check({...base,discount_start:'2026-11-12',discount_end:'2026-11-18',
  discount_percent:20,previous_discount:first});
 const equivalent=check({...base,discount_start:'2026-11-12',discount_end:'2026-11-18',
  discount_percent:20,previous_discounts:[first]});
 assert.deepEqual(equivalent,single);
});
test('Complete empty history remains synthetic; missing history attestation remains unresolved',()=>{
 const complete=check({...base,previous_discounts:[]});
 assert.equal(complete.conditional_calendar_rules_pass,true);
 assert.equal(complete.previous_discount_count,0);
 assert.equal(complete.actual_partner_eligibility_verified,false);
 assert.equal(check({...base,previous_discounts:[],relevant_discount_history_complete:false})
  .conditional_calendar_rules_pass,null);
});
test('Ordered multiple price increases preserve their last active cooldown',()=>{
 const fixture={...base,discount_start:'2026-12-15',discount_end:'2026-12-21',
  discount_percent:20,price_increase_dates:['2026-09-05','2026-11-20']};
 const valid=check(fixture);
 assert.equal(valid.conditional_calendar_rules_pass,false);
 assert.equal(valid.price_increase_count,2);
 assert.equal(valid.price_increase_cooldown_ends,'2026-12-20');
 assert(valid.known_calendar_failures.includes('price_increase_cooldown_active'));
 const cleared=check({...fixture,discount_start:'2026-12-20',discount_end:'2026-12-26'});
 assert.equal(cleared.conditional_calendar_rules_pass,true);
 assert.equal(cleared.first_allowed_start_date_from_known_cooldowns,'2026-12-20');
 assert.equal(cleared.actual_partner_eligibility_verified,false);
});
test('An older price increase cannot be hidden by a later price increase',()=>{
 const prior={kind:'standard',start:'2026-10-15',end:'2026-10-21'};
 const fixture={...base,discount_start:'2027-01-10',discount_end:'2027-01-16',
  discount_percent:20,previous_discounts:[prior],
  price_increase_dates:['2026-10-01','2026-11-20']};
 assert.throws(()=>check(fixture),/previous discount cannot begin during a price-increase cooldown/i);
 const permitted=check({...fixture,price_increase_dates:['2026-09-01','2026-11-20']});
 assert.equal(permitted.conditional_calendar_rules_pass,true);
 assert.equal(permitted.price_increase_count,2);
});
test('A price increase during any earlier promotion is rejected',()=>{
 const history=[
  {kind:'standard',start:'2026-10-01',end:'2026-10-07'},
  {kind:'standard',start:'2026-11-10',end:'2026-11-16'}
 ];
 const fixture={...base,discount_start:'2027-01-15',discount_end:'2027-01-21',
  discount_percent:20,previous_discounts:history};
 for(const inDiscount of ['2026-10-01','2026-10-05','2026-10-07',
  '2026-11-10','2026-11-14','2026-11-16']){
  assert.throws(()=>check({...fixture,price_increase_dates:[inDiscount]}),
   /base-price increase cannot occur during a previous discount/);
 }
});
test('Price history is bounded, strictly chronological and backward compatible',()=>{
 const fixture={...base,discount_start:'2027-01-15',discount_end:'2027-01-21',
  discount_percent:20};
 for(const dates of [null,Array(65).fill('2026-10-01')])
  assert.throws(()=>check({...fixture,price_increase_dates:dates}),/at most 64 dates/);
 assert.throws(()=>check({...fixture,price_increase_dates:['2026-11-10','2026-10-01']}),/strictly chronological/);
 assert.throws(()=>check({...fixture,price_increase_dates:['2026-10-01','2026-10-01']}),/strictly chronological/);
 assert.throws(()=>check({...fixture,price_increase_dates:['2027-02-01']}),/Future price increase/);
 assert.throws(()=>check({...fixture,price_increase_dates:['2026-02-30']}),/Invalid calendar/);
 assert.throws(()=>check({...fixture,last_price_increase_date:'2026-10-01',
  price_increase_dates:['2026-10-01']}),/either last_price_increase_date or price_increase_dates/);
 const legacy=check({...fixture,last_price_increase_date:'2026-10-01'});
 const array=check({...fixture,price_increase_dates:['2026-10-01']});
 assert.deepEqual(array,legacy);
 assert.equal(check({...fixture,price_increase_dates:[]}).price_increase_cooldown_ends,null);
});
test('Early Access graduation creates a second release cooldown for standard and seasonal offers',()=>{
 const fixture={...base,first_paid_release_date:'2026-01-15',full_release_date:'2026-10-15',
  discount_start:'2026-10-20',discount_end:'2026-10-26',discount_percent:20};
 const regular=check(fixture);
 assert.equal(regular.full_release_cooldown_ends,'2026-11-14');
 assert.equal(regular.full_release_date,'2026-10-15');
 assert.equal(regular.conditional_calendar_rules_pass,false);
 assert(regular.known_calendar_failures.includes('full_release_cooldown_active'));
 assert.equal(regular.first_allowed_start_date_from_known_cooldowns,'2026-11-14');
 const seasonal=check({...fixture,discount_kind:'official_seasonal',official_seasonal_event_verified:true});
 assert.equal(seasonal.conditional_calendar_rules_pass,false);
 assert(seasonal.known_calendar_failures.includes('full_release_cooldown_active'));
 assert.equal(check({...fixture,discount_start:'2026-11-14',discount_end:'2026-11-20'})
  .conditional_calendar_rules_pass,true);
});
test('Full-release launch offer is a distinct release-day exception, not a second first-paid launch',()=>{
 const ea='2026-01-15',full='2026-10-15';
 const scenario={...base,first_paid_release_date:ea,full_release_date:full,
  discount_kind:'launch',discount_start:full,discount_end:'2026-10-21',discount_percent:20};
 const result=check(scenario);
 assert.equal(result.conditional_calendar_rules_pass,true);
 assert.equal(result.launch_stage,'full_release');
 assert.equal(result.release_cooldown_ends,'2026-02-14');
 assert.equal(result.full_release_cooldown_ends,'2026-11-14');
 assert.equal(result.actual_partner_eligibility_verified,false);
 assert.equal(check({...scenario,discount_start:ea,discount_end:'2026-01-21'}).launch_stage,'early_access');
 assert(check({...scenario,discount_start:'2026-10-16',discount_end:'2026-10-22'})
  .known_calendar_failures.includes('launch_discount_not_on_release_day'));
});
test('An Early Access period shorter than 30 days blocks its full-release launch offer',()=>{
 const scenario={...base,first_paid_release_date:'2026-10-01',full_release_date:'2026-10-25',
  discount_kind:'launch',discount_start:'2026-10-25',discount_end:'2026-10-31',
  discount_percent:20};
 const out=check(scenario);
 assert.equal(out.conditional_calendar_rules_pass,false);
 assert(out.known_calendar_failures.includes('early_access_to_full_release_launch_cooldown_active'));
 const boundary=check({...scenario,full_release_date:'2026-10-31',
  discount_start:'2026-10-31',discount_end:'2026-11-06'});
 assert.equal(boundary.conditional_calendar_rules_pass,true);
});
test('A near-graduation base-price increase prevents a v1 launch discount',()=>{
 const scenario={...base,first_paid_release_date:'2026-01-15',full_release_date:'2026-10-15',
  discount_kind:'launch',discount_start:'2026-10-15',discount_end:'2026-10-21',
  discount_percent:20};
 const blocked=check({...scenario,price_increase_dates:['2026-09-20']});
 assert.equal(blocked.conditional_calendar_rules_pass,false);
 assert(blocked.known_calendar_failures.includes('price_increase_cooldown_active'));
 assert.equal(check({...scenario,price_increase_dates:['2026-09-15']}).conditional_calendar_rules_pass,true);
 assert.equal(check({...scenario,price_increase_dates:['2026-10-15']}).conditional_calendar_rules_pass,false);
});
test('Full-release launch cannot evade an ordinary Early Access discount cooldown',()=>{
 const prior={kind:'standard',start:'2026-09-15',end:'2026-09-25'};
 const full='2026-10-15';
 const scenario={...base,first_paid_release_date:'2026-01-15',full_release_date:full,
  discount_kind:'launch',discount_start:full,discount_end:'2026-10-21',
  discount_percent:20,previous_discounts:[prior]};
 const blocked=check(scenario);
 assert.equal(blocked.conditional_calendar_rules_pass,false);
 assert(blocked.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
 const eligible=check({...scenario,previous_discounts:[{...prior,end:'2026-09-15'}]});
 assert.equal(eligible.conditional_calendar_rules_pass,true);
});
test('Two independent release-day launch discounts are permitted in ordered history',()=>{
 const ea='2026-01-15',full='2026-10-15';
 const history=[
  {kind:'launch',start:ea,end:'2026-01-21'},
  {kind:'standard',start:'2026-05-01',end:'2026-05-07'},
  {kind:'launch',start:full,end:'2026-10-21'}
 ];
 const proposed={...base,first_paid_release_date:ea,full_release_date:full,
  discount_start:'2026-11-21',discount_end:'2026-11-27',
  discount_percent:20,previous_discounts:history};
 const result=check(proposed);
 assert.equal(result.conditional_calendar_rules_pass,true);
 assert.equal(result.previous_discount_count,3);
 assert.equal(result.full_release_cooldown_ends,'2026-11-14');
 assert.equal(result.latest_nonseasonal_discount_cooldown_ends,'2026-11-20');
 const premature=check({...proposed,discount_start:'2026-11-18',discount_end:'2026-11-24'});
 assert(premature.known_calendar_failures.includes('discount_to_discount_cooldown_active'));
 const invalidHistory=[...history,{kind:'launch',start:'2026-12-01',end:'2026-12-07'}];
 assert.throws(()=>check({...proposed,discount_start:'2027-01-15',discount_end:'2027-01-21',
  previous_discounts:invalidHistory}),/must start on Early Access or full release day/);
});
test('Prior regular offers inside the full-release cooldown are invalid history',()=>{
 const history=[{kind:'standard',start:'2026-10-20',end:'2026-10-25'}];
 const scenario={...base,first_paid_release_date:'2026-01-15',full_release_date:'2026-10-15',
  discount_start:'2026-12-15',discount_end:'2026-12-21',discount_percent:20,
  previous_discounts:history};
 assert.throws(()=>check(scenario),/cannot bypass full-release cooldown/);
 assert.throws(()=>check({...scenario,full_release_date:'2026-01-15'}),/Full release must follow/);
 assert.throws(()=>check({...scenario,full_release_date:'2025-12-31'}),/Full release must follow/);
 assert.throws(()=>check({...scenario,full_release_date:'2026-02-30'}),/Invalid calendar/);
});
test('A future graduation does not incorrectly block an ordinary Early Access discount',()=>{
 const proposed={...base,first_paid_release_date:'2026-01-15',
  full_release_date:'2026-12-15',discount_start:'2026-09-20',
  discount_end:'2026-09-26',discount_percent:20};
 const result=check(proposed);
 assert.equal(result.conditional_calendar_rules_pass,true);
 assert.equal(result.first_allowed_start_date_from_known_cooldowns,'2026-02-14');
 assert.equal(result.full_release_cooldown_ends,'2027-01-14');
 assert.equal(check({...base,discount_start:'2026-10-02',discount_end:'2026-10-08'})
  .full_release_date,null);
});
test('Launch offers do not suggest an impossible delayed launch date',()=>{
 const good={...base,first_paid_release_date:'2026-01-15',full_release_date:'2026-10-15',
  discount_kind:'launch',discount_start:'2026-10-15',discount_end:'2026-10-21',
  discount_percent:20};
 assert.equal(check(good).first_allowed_start_date_from_known_cooldowns,'2026-10-15');
 const price=check({...good,last_price_increase_date:'2026-10-01'});
 assert.equal(price.conditional_calendar_rules_pass,false);
 assert.equal(price.first_allowed_start_date_from_known_cooldowns,null);
 const recent=check({...good,first_paid_release_date:'2026-10-01'});
 assert.equal(recent.conditional_calendar_rules_pass,false);
 assert.equal(recent.first_allowed_start_date_from_known_cooldowns,null);
 const early=check({...good,discount_start:'2026-01-15',discount_end:'2026-01-21'});
 assert.equal(early.first_allowed_start_date_from_known_cooldowns,'2026-01-15');
});
