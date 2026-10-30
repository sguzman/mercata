import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamZeroStudyReadiness as audit} from '../site/steam-zero-study-evidence-join.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const financial=load('ontology/steam/steam-financial-changed-date-requery-2026.json');
const first='2026-01-01',end='2026-02-01';
const open={start:first,endExclusive:end,state:'purchasable'};
const zero={ledger_status:'complete_reconciled',observed_gross_paid_units:0,
 covered_from:first,covered_until_exclusive:end,
 authorized_financials_attested:true,transfers_reconciled:true,
 checkout_attribution_attested:true,country_attribution_attested:true};
const positive={ledger_status:'partial',observed_gross_paid_units:2,
 covered_from:first,covered_until_exclusive:'2026-01-08',
 authorized_financials_attested:true,checkout_attribution_attested:true,
 country_attribution_attested:true};
const row=(game,store_country,financial=zero)=>({
 fixture_game_id:'fixture-'+game,store_country,initial_paid_status:'eligible_paid_initially',
 first_paid_release_date:'2025-12-01',availability_segments:[open],...financial
});
const gates={
 historical_original_paid_game_roster_reconciled:true,
 retired_and_delisted_games_in_frame:true,
 early_access_first_paid_dates_and_free_starts_resolved:true,
 independent_nontransaction_game_discovery_included:true,
 full_paid_period_days_accounted_for_including_no_activity:true,
 financial_coverage_for_all_payment_partner_eras:true,
 pretransfer_financial_visibility_reconciled:true,
 complete_purchase_country_and_package_attribution:true,
 country_ledger_rows_linked_to_reconciled_financial_batches:true,
 latest_financial_changes_refreshed_through_study_asof:true
};
const base=()=>({
 fixture_id:'fixture-cohort-joined',
 game_country_rows:[row('zero','US'),row('zero','MX'),row('sale','US',positive),row('sale','MX',zero)],
 country_options:{start:first,endExclusive:end,asOfDate:'2026-02-15',
  game_frame_complete:true,country_roster_complete:true,
  all_purchase_country_reporting_reconciled_attested:true,
  game_roster:[
   {fixture_game_id:'fixture-zero',initial_paid_status:'eligible_paid_initially'},
   {fixture_game_id:'fixture-sale',initial_paid_status:'eligible_paid_initially'},
   {fixture_game_id:'fixture-free',initial_paid_status:'ineligible_initially_free'}
  ],store_countries:['US','MX']},
 financial_refresh_log:{polls:structuredClone(financial.synthetic_changed_date_polls),
  batches:structuredClone(financial.synthetic_batches),
  events:structuredClone(financial.synthetic_refresh_events)},
 independent_attestations:{...gates}
});
test('Fully synthetic attested study joins two existing guards, without claiming a real estimate',()=>{
 const a=audit(base());
 assert.equal(a.conditional_study_readiness,true);
 assert.equal(a.status,'conditional_evidence_protocol_pass');
 assert.equal(a.zero_fraction_lower_conditional,.5);
 assert.equal(a.zero_fraction_upper_conditional,.5);
 assert.equal(a.purchase_exposed_zero_fraction_lower_conditional,.5);
 assert.equal(a.changed_date_polls_committed,3);
 assert.equal(a.changed_dates_refreshed,3);
 assert.equal(a.changed_date_checkpoint_last_marker,120);
 assert.equal(a.final_reconciled_daily_aggregate_is_game_specific,false);
 assert.equal(a.any_actual_merchant_financial_report_accessed,false);
 assert.equal(a.actual_zero_paid_sale_fraction,null);
});
test('A perfectly reconciled financial API log cannot prove retired or missing no-sale games exist in its frame',()=>{
 for(const name of ['historical_original_paid_game_roster_reconciled',
  'retired_and_delisted_games_in_frame','independent_nontransaction_game_discovery_included']){
  const x=base();x.independent_attestations[name]=false;
  const a=audit(x);
  assert.equal(a.conditional_study_readiness,false);
  assert(a.known_failed_gates.includes(name));
  assert.equal(a.zero_fraction_lower_conditional,null);
 }
});
test('Transfer-era and pretransfer historical visibility are independent of current partner polling',()=>{
 for(const name of ['financial_coverage_for_all_payment_partner_eras',
  'pretransfer_financial_visibility_reconciled']){
  const x=base();x.independent_attestations[name]=null;
  const a=audit(x);
  assert.equal(a.conditional_study_readiness,null);
  assert(a.unresolved_gates.includes(name));
  assert.equal(a.changed_date_polls_committed,3);
  assert.equal(a.zero_fraction_upper_conditional,null);
 }
});
test('Per-day API cursor correctness does not establish calendar days without transactions',()=>{
 const x=base();
 x.independent_attestations.full_paid_period_days_accounted_for_including_no_activity=false;
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,false);
 assert(a.known_failed_gates.includes('full_paid_period_days_accounted_for_including_no_activity'));
 assert.equal(a.complete_synthetic_change_refresh_sequence,true);
});
test('Changed-date checkpoint must follow every fully paginated changed-date refresh',()=>{
 const x=base();x.financial_refresh_log.events=x.financial_refresh_log.events.filter(e=>
  !(e.kind==='refresh'&&e.fixture_batch_id==='fixture-may2'));
 assert.throws(()=>audit(x),/Cannot checkpoint before/);
 const y=base();y.financial_refresh_log.batches[1].pages.pop();
 assert.throws(()=>audit(y),/Incomplete daily page sequence|Missing terminal page/);
});
test('Missing refresh proof blocks conditional result, even with an attested whole-game zero',()=>{
 const x=base();x.financial_refresh_log=null;
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,null);
 assert(a.unresolved_gates.includes('financial_change_refresh_log_not_supplied'));
 assert.equal(a.zero_fraction_lower_conditional,null);
 assert.equal(a.actual_zero_paid_sale_fraction,null);
});
test('Incomplete original-paid AppID frame cannot pass from a complete sample of visible games',()=>{
 const x=base();x.country_options.game_frame_complete=false;
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,false);
 assert(a.known_failed_gates.includes('game_frame_not_complete'));
});
test('A missing country ledger remains an unknown game, not a zero despite a perfect API sync',()=>{
 const x=base();x.game_country_rows=x.game_country_rows.filter(r=>
  !(r.fixture_game_id==='fixture-zero'&&r.store_country==='MX'));
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,true);
 assert.equal(a.game_counts.unknown_gross_zero_games,1);
 assert.equal(a.game_counts.confirmed_gross_zero_games,0);
 assert.equal(a.zero_fraction_lower_conditional,0);
 assert.equal(a.zero_fraction_upper_conditional,.5);
 assert(a.unresolved_gates.includes('some_game_gross_zero_outcomes_partially_observed'));
});
test('Unknown first-paid status blocks a population-level fraction, even with valid financial checkpoints',()=>{
 const x=base();x.country_options.game_roster.push({
  fixture_game_id:'fixture-undated',initial_paid_status:'unresolved'});
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,null);
 assert(a.unresolved_gates.includes('initial_paid_status_unresolved_for_some_games'));
 assert.equal(a.zero_fraction_lower_conditional,null);
});
test('Uncertain checkout availability blocks exposure-specific bound but not gross zero-study bound',()=>{
 const x=base();x.game_country_rows[0].availability_segments=[{
  start:first,endExclusive:end,state:'unresolved'}];
 const a=audit(x);
 assert.equal(a.conditional_study_readiness,true);
 assert.equal(a.zero_fraction_lower_conditional,.5);
 assert.equal(a.purchase_exposed_zero_fraction_lower_conditional,null);
 assert(a.unresolved_gates.includes('purchase_access_unresolved_for_some_games'));
});
test('Independent assertions must be explicit, and hidden account records are disallowed',()=>{
 const x=base();delete x.independent_attestations.retired_and_delisted_games_in_frame;
 assert.throws(()=>audit(x),/explicit true\/false\/null/);
 const y=base();y.independent_attestations.financial_coverage_for_all_payment_partner_eras='likely';
 assert.throws(()=>audit(y),/explicit true\/false\/null/);
 const z=base();z.financial_api_key='secret';
 assert.throws(()=>audit(z),/Bounded synthetic/);
});
test('Unreconciled partner dates, price-group countries and credentials fail closed',()=>{
 const a=base();a.country_options.store_countries=['USD_LATAM'];
 assert.throws(()=>audit(a),/Unique ISO two-letter store-country codes/);
 const b=base();b.country_options.all_purchase_country_reporting_reconciled_attested=false;
 assert.equal(audit(b).conditional_study_readiness,false);
 const c=base();c.financial_refresh_log.events[4].partner_key='not-permitted';
 assert.throws(()=>audit(c),/Invalid or nonfixture/);
});
test('Evidence contract uses known Steam claims and original 293 tasks',()=>{
 const d=load('ontology/steam/permissioned-ledger-coverage-and-zero-identification-2026.json');
 const specimen=load('specimens/steam.json');
 const src=new Set(specimen.evidence.map(x=>x.id));
 for(const id of d.source_ids)assert(src.has(id),id);
 assert.equal(d.study_evidence_join.model_path,'site/steam-zero-study-evidence-join.mjs');
 assert.equal(d.study_evidence_join.test_path,'tests/steam-zero-study-evidence-join.test.mjs');
 assert.equal(d.sample_state.real_authorized_ledger_reports,0);
 const p=load('plans/steam.json'),q=load('queues/steam.json');
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
