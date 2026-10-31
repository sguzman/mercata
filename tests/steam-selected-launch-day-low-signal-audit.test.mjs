import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSelectedSteamLowSignalPanels as audit} from '../site/steam-selected-launch-day-low-signal-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-selected-launch-day-low-signal-panel-audit-2026.json');
const panels=()=>structuredClone(study.selected_panels);
test('Selected 2025/2026 near-zero-model and July review bins are not a zero-paid-sale census',()=>{
 const a=audit(panels());
 assert.equal(a.reviewed_panel_count,3);
 assert.equal(a.distinct_selected_launch_day_count,4);
 assert.deepEqual(a.rows.map(x=>x.source_reported_selected_game_count),[53,67,69]);
 assert.deepEqual(a.rows.map(x=>x.source_reported_low_signal_games),[13,35,24]);
 assert.deepEqual(a.rows.map(x=>x.rounded_low_signal_share_percent_one_decimal),[24.5,52.2,34.8]);
 assert.equal(a.rows[1].author_reported_low_signal_percent,53);
 assert.equal(a.rows[1].author_label_matches_nearest_integer_share,false);
 assert.equal(a.rows[2].author_label_matches_nearest_integer_share,true);
 for(const key of ['pooled_low_signal_rate','measured_year_over_year_change',
  'actual_exact_zero_paid_sale_fraction','actual_total_paid_first_launch_frame',
  'actual_steam_game_sales','verified_publisher_cash'])assert.equal(a[key],null,key);
});
test('A chosen low-signal threshold never becomes verified exact zero orders',()=>{
 const a=audit(panels());
 for(const r of a.rows) {
  assert.equal(r.actual_zero_paid_orders,null);
  assert.equal(r.actual_zero_paid_fraction,null);
  assert.equal(r.original_paid_status_verified,false);
 }
 assert.equal(a.identical_method_and_representative_sample,false);
});
test('Reject unbalanced aggregate buckets and relabelled estimates as reviews',()=>{
 for(const tweak of [
  x=>x[0].reported_bucket_counts[0]++,
  x=>x[1].low_signal_count=0,
  x=>x[2].estimated_by='Gamalytic',
  x=>x[1].estimated_by=null,
  x=>x[0].outcome_measure='public_review_count_below_ten',
  x=>x[0].reported_eligible_games=0,
  x=>x[0].reported_bucket_counts[0]=-1,
  x=>x[0].reported_bucket_counts=[53],
  x=>x[0].author_reported_low_signal_percent=200
 ]){
  const p=panels();tweak(p);assert.throws(()=>audit(p));
 }
});
test('Reject duplicate days, panel IDs, real appids and unapproved review/account fields',()=>{
 for(const tweak of [
  x=>x[1].release_days[0]=x[0].release_days[0],
  x=>x[1].panel_id=x[0].panel_id,
  x=>x[0].appid=1432,
  x=>x[2].reviewer_id='real',
  x=>x[1].purchase_ledger=[],
  x=>x[2].release_days=['2026-02-30'],
  x=>x[1].release_days=['2026-06-04','2026-06-03'],
  x=>x[0].release_scope='verified_real_paid_order_frame'
 ]){
  const p=panels();tweak(p);assert.throws(()=>audit(p));
 }
});
test('Missing or empty panel arrays are rejected',()=>{
 for(const invalid of [null,undefined,[],[panels()[0]],{},'sample']){
  assert.throws(()=>audit(invalid));
 }
});
test('Structured study preserves all unknown financial quantities',()=>{
 assert.equal(study.source_ids.length,3);
 assert.equal(study.claim_ids.length,5);
 assert(Object.values(study.observation).filter(v=>v===null).length>=4);
 assert.equal(study.observation.appids_collected,0);
 assert.equal(study.observation.independent_paid_checkout_ledgers_provided,false);
});
