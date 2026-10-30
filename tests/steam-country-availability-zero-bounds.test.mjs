import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamCountryAvailabilityZeroBounds as audit} from '../site/steam-country-availability-zero-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const options={start:'2026-01-01',endExclusive:'2026-01-31',asOfDate:'2026-02-14',
 game_frame_complete:true,country_roster_complete:true};
const open={start:'2026-01-01',endExclusive:'2026-01-31',state:'purchasable'};
const blocked={...open,state:'not_purchasable',reason:'missing_price'};
const f=(id,country,segments=[open],extras={})=>({
 fixture_game_id:'fixture-'+id,store_country:country,
 initial_paid_status:'eligible_paid_initially',first_paid_release_date:'2025-12-01',
 availability_segments:segments,ledger_status:'missing',observed_gross_paid_units:null,...extras
});
const complete=(units)=>({ledger_status:'complete_reconciled',observed_gross_paid_units:units,
 covered_from:options.start,covered_until_exclusive:options.endExclusive,
 authorized_financials_attested:true,transfers_reconciled:true,
 checkout_attribution_attested:true,country_attribution_attested:true});
const positive=(units)=>({ledger_status:'partial',observed_gross_paid_units:units,
 covered_from:options.start,covered_until_exclusive:'2026-01-09',
 authorized_financials_attested:true,checkout_attribution_attested:true,
 country_attribution_attested:true});
test('Fully purchasable zero, positive and missing records produce conditional lower and upper bounds',()=>{
 const rows=[f('a','US',[open],complete(0)),f('b','US',[open],positive(2)),
  f('c','US'),f('d','US',[open],{ledger_status:'partial',observed_gross_paid_units:0,
   covered_from:options.start,covered_until_exclusive:'2026-01-08'})];
 const a=audit(rows,options);
 assert.equal(a.counts.fully_purchasable_windows,4);
 assert.equal(a.counts.fully_purchasable_confirmed_zero,1);
 assert.equal(a.counts.fully_purchasable_known_nonzero,1);
 assert.equal(a.counts.fully_purchasable_unknown_zero,2);
 assert.equal(a.fully_purchasable_country_window_zero_share_lower_conditional,0.25);
 assert.equal(a.fully_purchasable_country_window_zero_share_upper_conditional,0.75);
 assert.equal(a.actual_steam_game_zero_sale_fraction,null);
});
test('Complete inaccessible zero remains observed but is never counted as demand-exposed zero',()=>{
 const rows=[f('a','JP',[blocked],complete(0)),f('b','US',[open],complete(0))];
 const a=audit(rows,options);
 assert.equal(a.counts.never_purchasable_windows,1);
 assert.equal(a.counts.never_purchasable_confirmed_zero,1);
 assert.equal(a.counts.fully_purchasable_confirmed_zero,1);
 assert.equal(a.fully_purchasable_country_window_zero_share_lower_conditional,1);
 assert.equal(a.entries[0].zero_class,'observed_structural_zero_without_purchase_access');
 assert.equal(a.game_level_zero_sales_inferred_from_country_rows,false);
});
test('Market intermittently closed has its own stratum, not full purchase exposure',()=>{
 const segments=[
  {start:'2026-01-01',endExclusive:'2026-01-10',state:'purchasable'},
  {start:'2026-01-10',endExclusive:'2026-01-20',state:'not_purchasable',reason:'below_transaction_floor'},
  {start:'2026-01-20',endExclusive:'2026-01-31',state:'purchasable'}];
 const a=audit([f('a','MX',segments,complete(0)),f('b','US',[open],complete(10))],options);
 assert.equal(a.counts.mixed_purchasability_windows,1);
 assert.equal(a.counts.mixed_or_unresolved_access_confirmed_zero,1);
 assert.equal(a.counts.fully_purchasable_windows,1);
 assert.equal(a.fully_purchasable_country_window_zero_share_lower_conditional,0);
});
test('Unknown pricing or access destroys identified exposed-market denominator',()=>{
 const unknown=[{...open,state:'unresolved'}];
 const a=audit([f('a','JP',unknown),f('b','US',[open],complete(0))],options);
 assert.equal(a.counts.unresolved_purchasability_windows,1);
 assert.equal(a.fully_purchasable_country_window_zero_share_upper_conditional,null);
 assert.equal(audit([f('b','US',[open],complete(0))],{...options,game_frame_complete:false})
  .fully_purchasable_country_window_zero_share_lower_conditional,null);
 assert.equal(audit([f('b','US',[open],complete(0))],{...options,country_roster_complete:false})
  .fully_purchasable_country_window_zero_share_lower_conditional,null);
});
test('An unavailable market cannot simultaneously have an attributed paid Steam checkout',()=>{
 for(const report of [complete(1),positive(1)]){
  assert.throws(()=>audit([f('a','JP',[blocked],report)],options),
   /contradict an entirely unavailable/);
 }
 const partial=[{start:'2026-01-01',endExclusive:'2026-01-10',state:'not_purchasable',reason:'missing_price'},
 {start:'2026-01-10',endExclusive:'2026-01-31',state:'purchasable'}];
 assert.equal(audit([f('a','JP',partial,complete(1))],options).counts.mixed_purchasability_windows,1);
});
test('A partial financial positive needs permission plus game and store-country checkout attribution',()=>{
 const p=positive(2);
 for(const field of ['authorized_financials_attested','checkout_attribution_attested','country_attribution_attested']){
  assert.throws(()=>audit([f('a','US',[open],{...p,[field]:false})],options),
   /Partial positive sales need/);
 }
 assert.equal(audit([f('a','US',[open],p)],options).counts.fully_purchasable_known_nonzero,1);
});
test('A complete observed zero needs financial and transfer reconciliation for full matured period',()=>{
 for(const patch of [{transfers_reconciled:false},{country_attribution_attested:false},
  {covered_until_exclusive:'2026-01-30'}]){
  assert.throws(()=>audit([f('a','US',[open],{...complete(0),...patch})],options),
   /Complete ledger requires|Observed units need bounded ledger coverage/);
 }
 assert.throws(()=>audit([f('a','US',[open],complete(0))],
  {...options,asOfDate:'2026-01-12'}),
  /Complete ledger requires|Observed units need bounded ledger coverage/);
});
test('Missing and partial ledgers never fabricate complete zero observations',()=>{
 assert.throws(()=>audit([f('a','US',[open],{observed_gross_paid_units:0})],options),
  /Missing ledger cannot certify/);
 assert.throws(()=>audit([f('a','US',[open],{authorized_financials_attested:true})],options),
  /Missing ledger cannot certify/);
 const a=audit([f('a','US')],options);
 assert.equal(a.counts.fully_purchasable_unknown_zero,1);
 assert.equal(a.fully_purchasable_country_window_zero_share_lower_conditional,0);
 assert.equal(a.fully_purchasable_country_window_zero_share_upper_conditional,1);
});
test('Unresolved first-paid status cannot silently enter a paid-sale country sample',()=>{
 const excluded={fixture_game_id:'fixture-x',store_country:'US',initial_paid_status:'ineligible_initially_free'};
 const unresolved={fixture_game_id:'fixture-y',store_country:'US',initial_paid_status:'unresolved'};
 const a=audit([excluded,unresolved],options);
 assert.equal(a.counts.ineligible_or_unresolved_windows,2);
 assert.equal(a.fully_purchasable_country_window_zero_share_lower_conditional,null);
 assert.throws(()=>audit([{...excluded,ledger_status:'complete_reconciled',
  observed_gross_paid_units:0}],options),/cannot carry paid checkout/);
 assert.throws(()=>audit([{...unresolved,availability_segments:[open]}],options),
  /cannot carry paid checkout/);
});
test('Time intervals must cover the entire window without overlap, gaps or unexplained blocks',()=>{
 const cases=[
  [{start:'2026-01-01',endExclusive:'2026-01-15',state:'purchasable'}],
  [{start:'2026-01-01',endExclusive:'2026-01-15',state:'purchasable'},
   {start:'2026-01-16',endExclusive:'2026-01-31',state:'purchasable'}],
  [{start:'2026-01-01',endExclusive:'2026-01-20',state:'purchasable'},
   {start:'2026-01-19',endExclusive:'2026-01-31',state:'purchasable'}],
  [{...blocked,reason:undefined}]
 ];
 for(const segments of cases)assert.throws(()=>audit([f('a','US',segments)],options),
  /Availability intervals|blocked period|Incomplete availability coverage/);
});
test('No private identifiers, duplicate countries, or misleading pricing market group units',()=>{
 const one=f('a','US');
 assert.throws(()=>audit([one,one],options),/Duplicate game/);
 assert.throws(()=>audit([f('a','USD_LATAM')],options),/two-letter store countries/);
 assert.throws(()=>audit([{...one,partner_account_key:'private'}],options),/documented fields/);
 assert.throws(()=>audit([f('a','US',[open],{first_paid_release_date:'2026-01-15'})],options),
  /First paid release/);
 assert.equal(audit([f('a','US'),f('a','MX')],options).counts.eligible_country_windows,2);
});
test('Source and inventory contracts retain original 293 tasks without a real zero estimator',()=>{
 const x=read('ontology/steam/permissioned-ledger-coverage-and-zero-identification-2026.json');
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of x.source_ids)assert(ids.has(id),id);
 for(const id of x.claim_ids)assert(claims.has(id),id);
 assert.equal(x.market_access_sensitivity.model_path,'site/steam-country-availability-zero-bounds.mjs');
 assert.equal(x.market_access_sensitivity.test_path,'tests/steam-country-availability-zero-bounds.test.mjs');
 assert.equal(x.sample_state.real_authorized_ledger_reports,0);
 assert.equal(p.detail_tasks.length+q.queues.flatMap(g=>g.tasks).length,293);
});
test('Partial financial coverage cannot extend past the as-of observation date',()=>{
 const rows=[f('a','US',[open],positive(2))];
 assert.throws(()=>audit(rows,{...options,asOfDate:'2026-01-06'}),/Observed units need bounded ledger coverage/);
 const mature=audit(rows,{...options,asOfDate:'2026-01-31'});
 assert.equal(mature.counts.fully_purchasable_known_nonzero,1);
 assert.equal(mature.observation_matured,true);
 const immature=audit([f('a','US')],{...options,asOfDate:'2026-01-08'});
 assert.equal(immature.observation_matured,false);
 assert.equal(immature.fully_purchasable_country_window_zero_share_upper_conditional,null);
});
