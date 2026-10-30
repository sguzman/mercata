import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamGameLevelCountryZeroBounds as audit} from '../site/steam-game-country-zero-identification.mjs';
const j=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const start='2026-01-01',endExclusive='2026-01-31';
const base={start,endExclusive,asOfDate:'2026-02-15',
 game_frame_complete:true,country_roster_complete:true,
 all_purchase_country_reporting_reconciled_attested:true,
 game_roster:[
  {fixture_game_id:'fixture-a',initial_paid_status:'eligible_paid_initially'},
  {fixture_game_id:'fixture-b',initial_paid_status:'eligible_paid_initially'},
  {fixture_game_id:'fixture-c',initial_paid_status:'eligible_paid_initially'},
  {fixture_game_id:'fixture-free',initial_paid_status:'ineligible_initially_free'}
 ],store_countries:['US','MX']};
const open={start,endExclusive,state:'purchasable'};
const blocked={start,endExclusive,state:'not_purchasable',reason:'missing_price'};
const zero={ledger_status:'complete_reconciled',observed_gross_paid_units:0,
 covered_from:start,covered_until_exclusive:endExclusive,
 authorized_financials_attested:true,transfers_reconciled:true,
 checkout_attribution_attested:true,country_attribution_attested:true};
const missing={ledger_status:'missing',observed_gross_paid_units:null};
const partialPositive={ledger_status:'partial',observed_gross_paid_units:2,
 covered_from:start,covered_until_exclusive:'2026-01-08',
 authorized_financials_attested:true,checkout_attribution_attested:true,
 country_attribution_attested:true};
const row=(id,country,segments=[open],financial=zero)=>({
 fixture_game_id:'fixture-'+id,store_country:country,
 initial_paid_status:'eligible_paid_initially',
 first_paid_release_date:'2025-12-01',
 availability_segments:segments,...financial
});
const fixtures=()=>[
 row('a','US'),row('a','MX',[blocked]),
 row('b','US',[open],partialPositive),row('b','MX',[blocked],missing),
 row('c','US',[blocked]),row('c','MX',[blocked])
];
test('Whole-game bound uses games rather than summing country zero-window percentages',()=>{
 const x=audit(fixtures(),base);
 assert.equal(x.counts.eligible_paid_games,3);
 assert.equal(x.counts.excluded_initially_free_games,1);
 assert.equal(x.counts.confirmed_gross_zero_games,2);
 assert.equal(x.counts.confirmed_positive_games,1);
 assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,2/3);
 assert.equal(x.whole_game_gross_zero_fraction_upper_conditional,2/3);
 assert.equal(x.real_steam_game_zero_paid_sale_fraction,null);
 assert.equal(x.actual_financial_api_data_verified,false);
});
test('Structural zero with no country ever accessible differs from a game exposed to purchase',()=>{
 const x=audit(fixtures(),base);
 assert.equal(x.counts.structural_no_checkout_access_zero_games,1);
 assert.equal(x.counts.confirmed_zero_with_some_checkout_access,1);
 assert.equal(x.counts.games_with_some_purchase_access,2);
 assert.equal(x.purchase_exposed_game_zero_fraction_lower_conditional,.5);
 assert.equal(x.purchase_exposed_game_zero_fraction_upper_conditional,.5);
 assert.equal(x.entries.find(a=>a.fixture_game_id==='fixture-c').purchase_access_class,
  'never_purchasable_in_any_listed_country');
});
test('Positive attributed country observation proves game nonzero despite other missing ledgers',()=>{
 const x=audit(fixtures(),base);
 assert.equal(x.entries.find(a=>a.fixture_game_id==='fixture-b').whole_game_gross_zero_status,
  'known_gross_paid_nonzero');
 const y=audit([...fixtures().filter(x=>x.fixture_game_id!=='fixture-b'),
  row('b','US',[open],partialPositive)],base);
 assert.equal(y.counts.confirmed_positive_games,1);
 assert.equal(y.counts.confirmed_gross_zero_games,2);
});
test('One missing country report cannot certify whole-game zero',()=>{
 const rows=fixtures().filter(x=>!(x.fixture_game_id==='fixture-a'&&x.store_country==='MX'));
 const x=audit(rows,base);
 assert.equal(x.counts.confirmed_gross_zero_games,1);
 assert.equal(x.counts.unknown_gross_zero_games,1);
 assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,1/3);
 assert.equal(x.whole_game_gross_zero_fraction_upper_conditional,2/3);
 assert.deepEqual(x.entries.find(a=>a.fixture_game_id==='fixture-a').missing_country_rows,['MX']);
 assert.equal(x.purchase_exposed_game_zero_fraction_lower_conditional,null);
});
test('Partial zero ledger in one country never becomes a whole-game zero',()=>{
 const rows=fixtures().map(x=>x.fixture_game_id==='fixture-a'&&x.store_country==='MX'?
  row('a','MX',[blocked],{ledger_status:'partial',observed_gross_paid_units:0,
   covered_from:start,covered_until_exclusive:'2026-01-10'}):x);
 const x=audit(rows,base);
 assert.equal(x.counts.confirmed_gross_zero_games,1);
 assert.equal(x.counts.unknown_gross_zero_games,1);
 assert.equal(x.whole_game_gross_zero_fraction_upper_conditional,2/3);
});
test('Incomplete market roster or unreconciled all-country sales makes zeros unidentified',()=>{
 for(const patch of [{country_roster_complete:false},
  {all_purchase_country_reporting_reconciled_attested:false}]){
  const x=audit(fixtures(),{...base,...patch});
  assert.equal(x.counts.confirmed_gross_zero_games,0);
  assert.equal(x.counts.confirmed_positive_games,1);
  assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,null);
  assert.equal(x.whole_game_gross_zero_fraction_upper_conditional,null);
 }
 assert.equal(audit(fixtures(),{...base,game_frame_complete:false})
  .whole_game_gross_zero_fraction_lower_conditional,null);
});
test('Unknown initial paid eligibility invalidates population fractions; known free excludes cleanly',()=>{
 const unknown={fixture_game_id:'fixture-unknown',initial_paid_status:'unresolved'};
 const x=audit(fixtures(),{...base,game_roster:[...base.game_roster,unknown]});
 assert.equal(x.counts.unresolved_original_paid_status_games,1);
 assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,null);
 const y=audit(fixtures(),base);
 assert.equal(y.counts.excluded_initially_free_games,1);
 assert.equal(y.whole_game_gross_zero_fraction_lower_conditional,2/3);
});
test('Unknown availability blocks purchase-exposure metric but not fully reconciled gross zero',()=>{
 const rows=fixtures().map(x=>x.fixture_game_id==='fixture-a'&&x.store_country==='MX'?
  row('a','MX',[{start,endExclusive,state:'unresolved'}]):x);
 const x=audit(rows,base);
 assert.equal(x.counts.confirmed_gross_zero_games,2);
 assert.equal(x.counts.games_with_unknown_purchase_access,1);
 assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,2/3);
 assert.equal(x.purchase_exposed_game_zero_fraction_lower_conditional,null);
});
test('An immature study window cannot certify a complete zero, even with complete date assertions',()=>{
 const rows=fixtures().map(x=>x.ledger_status==='complete_reconciled'?
  {...x,...missing,covered_from:undefined,covered_until_exclusive:undefined,
   authorized_financials_attested:undefined,transfers_reconciled:undefined,
   checkout_attribution_attested:undefined,country_attribution_attested:undefined}:x);
 const x=audit(rows,{...base,asOfDate:'2026-01-10'});
 assert.equal(x.observation_matured,false);
 assert.equal(x.whole_game_gross_zero_fraction_lower_conditional,null);
});
test('Frame rejects fabricated market-group countries and duplicate or orphan rows',()=>{
 assert.throws(()=>audit(fixtures(),{...base,store_countries:['US','USD_LATAM']}),/Unique ISO/);
 assert.throws(()=>audit(fixtures(),{...base,store_countries:['US','US']}),/Unique ISO/);
 assert.throws(()=>audit(fixtures(),{...base,game_roster:[...base.game_roster,base.game_roster[0]]}),
  /Invalid or duplicate/);
 assert.throws(()=>audit([...fixtures(),fixtures()[0]],base),/Duplicate game-country/);
 assert.throws(()=>audit([...fixtures(),row('orphan','US')],base),/Country row must belong/);
 assert.throws(()=>audit([...fixtures(),row('free','US')],base),/Country row must belong/);
});
test('A single game must use a consistent original paid date across all countries',()=>{
 const rows=fixtures().map(x=>x.fixture_game_id==='fixture-a'&&x.store_country==='MX'?
  {...x,first_paid_release_date:'2025-11-01'}:x);
 assert.throws(()=>audit(rows,base),/one original paid release date/);
});
test('A positive sale in a never-purchasable country cannot bypass existing audit validation',()=>{
 const rows=fixtures().map(x=>x.fixture_game_id==='fixture-c'&&x.store_country==='MX'?
  row('c','MX',[blocked],partialPositive):x);
 assert.throws(()=>audit(rows,base),/contradict an entirely unavailable/);
});
test('Research contracts preserve evidence attribution and unchanged task inventory',()=>{
 const d=j('ontology/steam/permissioned-ledger-coverage-and-zero-identification-2026.json');
 const specimen=j('specimens/steam.json');
 const ids=new Set(specimen.evidence.map(e=>e.id));
 for(const id of d.source_ids)assert(ids.has(id),id);
 assert.equal(d.game_level_country_rollup.model_path,
  'site/steam-game-country-zero-identification.mjs');
 assert.equal(d.game_level_country_rollup.test_path,
  'tests/steam-game-country-zero-identification.test.mjs');
 const p=j('plans/steam.json'),q=j('queues/steam.json');
 assert.equal(p.detail_tasks.length+q.queues.flatMap(g=>g.tasks).length,293);
 assert.equal(d.sample_state.real_authorized_ledger_reports,0);
});
