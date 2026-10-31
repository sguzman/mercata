import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamArchiveCandidateCoverage as audit} from '../site/steam-archive-candidate-coverage.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const window={start:'2025-01-01',endExclusive:'2026-01-01'};
const source=(id,role,tracking_started_on,scope='selected')=>({
 source_id:'fixture-'+id,role,tracking_started_on,scope,observed_source_completeness:false});
const sources=[
 source('history','price_history','2012-01-01'),
 source('fresh','app_metadata','2026-09-01'),
 source('curated','curated_removed_list','2018-01-01'),
 source('launch','release_attestation','2025-01-01'),
 source('store','current_store_catalog','2026-10-01','observed_catalog')
];
const evt=(id,g,s,kind,observed_on='2026-10-25',extra={})=>({
 observation_id:'fixture-'+id,fixture_game_id:'fixture-'+g,source_id:'fixture-'+s,
 kind,observed_on,captured_on:'2026-10-30',provenance:'provider_observed',...extra
});
const attest=(id,g,date,paid=true)=>evt(id,g,'launch','first_paid_release_attestation','2026-10-25',{
 app_type:'game',initial_paid_status:paid,first_paid_playable_date:date,release_mode:'early_access'});
const base=()=>({fixture_id:'fixture-archives',window,sources:structuredClone(sources),observations:[
 evt('curated-a','a','curated','curated_status_label','2026-10-20',{status_label:'delisted'}),
 evt('price-a','a','history','positive_price_observed','2025-08-01'),
 attest('att-a','a','2025-04-01'),
 evt('unreleased-b','b','curated','curated_status_label','2026-10-20',{status_label:'unreleased'}),
 evt('price-c','c','history','positive_price_observed','2025-09-01'),
 evt('store-d','d','store','catalog_seen','2026-10-20'),
 attest('att-e','e','2025-05-15',false)
]});
test('Historical candidate union keeps delisted paid launch while unreleased labels are not paid games',()=>{
 const x=audit(base());
 assert.equal(x.counts.candidate_game_ids_observed,5);
 assert.equal(x.counts.first_paid_cohort_eligible,1);
 assert.equal(x.counts.clearly_outside_paid_cohort_or_initially_free,1);
 assert.equal(x.counts.unresolved_first_paid_eligibility,3);
 assert.equal(x.counts.curated_only_candidates,1);
 assert.equal(x.entries.find(r=>r.fixture_game_id==='fixture-a').first_paid_cohort_status,'eligible');
 assert.equal(x.entries.find(r=>r.fixture_game_id==='fixture-b').first_paid_cohort_status,'unresolved');
 assert.equal(x.actual_zero_paid_sale_fraction,null);
});
test('Historical sale price only proves observed price, not first paid playable date or sales',()=>{
 const x=audit(base());
 const price=x.entries.find(r=>r.fixture_game_id==='fixture-c');
 assert.equal(price.has_price_observation,true);
 assert.equal(price.first_paid_cohort_status,'unresolved');
 assert.equal(price.verified_paid_checkout_units,null);
 assert.equal(x.earliest_observed_price_is_initial_paid_launch,false);
});
test('Imported history before archive starts can be accepted but never impersonated as native tracking',()=>{
 const x=base();
 x.observations.push(evt('imported-f','f','fresh','playable_presence_observed','2025-04-01',{
  provenance:'imported_historical'}));
 const r=audit(x);
 assert.equal(r.counts.has_imported_historical_observation,1);
 assert.equal(r.entries.find(e=>e.fixture_game_id==='fixture-f').first_paid_cohort_status,'unresolved');
 x.observations.at(-1).provenance='provider_observed';
 assert.throws(()=>audit(x),/predates declared tracking start/);
});
test('Out-of-cohort paid launch and free original games are excluded without using archived current price',()=>{
 const x=base();x.observations.push(attest('old-g','g','2024-03-01'));
 x.observations.push(evt('priced-e','e','history','positive_price_observed','2026-01-05'));
 const y=audit(x);
 assert.equal(y.entries.find(r=>r.fixture_game_id==='fixture-g').reason,'first_paid_launch_outside_window');
 assert.equal(y.entries.find(r=>r.fixture_game_id==='fixture-e').reason,'not_initially_paid_base_game');
});
test('Curated unreleased label contradicting an independent first-paid record stays unresolved',()=>{
 const x=base();x.observations.push(attest('att-b','b','2025-01-12'));
 const r=audit(x);
 assert.equal(r.counts.conflicting_archive_labels,1);
 assert.equal(r.entries.find(e=>e.fixture_game_id==='fixture-b').first_paid_cohort_status,'unresolved');
});
test('Prelaunch unreleased or unpublished labels are historical states, not permanent vetoes',()=>{
 for(const label of ['unreleased','unpublished']){
  const x=base();
  x.observations.push(evt('prelaunch-a','a','curated','curated_status_label','2025-03-31',{status_label:label}));
  const r=audit(x);
  const a=r.entries.find(e=>e.fixture_game_id==='fixture-a');
  assert.equal(a.first_paid_cohort_status,'eligible');
  assert.equal(a.reason,'independently_attested_initial_paid_playable_date_in_window');
  assert.equal(r.counts.conflicting_archive_labels,0);
 }
});
test('Same-day and postlaunch unreleased or unpublished labels remain unresolved',()=>{
 for(const date of ['2025-04-01','2025-04-02']){
  for(const label of ['unreleased','unpublished']){
   const x=base();
   x.observations.push(evt('contradiction-a','a','curated','curated_status_label',date,{status_label:label}));
   const r=audit(x);
   const a=r.entries.find(e=>e.fixture_game_id==='fixture-a');
   assert.equal(a.first_paid_cohort_status,'unresolved');
   assert.equal(a.reason,'unreconciled_curated_unreleased_label_conflict');
   assert.equal(r.counts.conflicting_archive_labels,1);
  }
 }
});
test('A first paid playable launch cannot be attested as already observed before it occurred',()=>{
 const x=base();
 const a=x.observations.find(o=>o.observation_id==='fixture-att-a');
 a.observed_on='2025-03-31';
 assert.throws(()=>audit(x),/Invalid independent first paid release attestation/);
});
test('Contradictory independent first paid dates never become a majority vote',()=>{
 const x=base();x.observations.push(attest('att-a2','a','2025-06-01'));
 const y=audit(x);
 assert.equal(y.entries.find(e=>e.fixture_game_id==='fixture-a').reason,
  'conflicting_first_paid_release_attestations');
});
test('Same-day priced and playable archive snapshots still cannot establish original launch',()=>{
 const x=base();x.observations.push(evt('playable-c','c','fresh','playable_presence_observed','2026-10-25'));
 const r=audit(x);
 assert.equal(r.entries.find(e=>e.fixture_game_id==='fixture-c').has_playable_presence_observation,true);
 assert.equal(r.entries.find(e=>e.fixture_game_id==='fixture-c').first_paid_cohort_status,'unresolved');
});
test('A pretracking captured observation is not native tracking, regardless of source breadth',()=>{
 const x=base();x.sources[0].tracking_started_on='2026-01-01';
 assert.throws(()=>audit(x),/predates declared tracking start/);
 x.observations.find(o=>o.observation_id==='fixture-price-a').provenance='imported_historical';
 x.observations.find(o=>o.observation_id==='fixture-price-c').provenance='imported_historical';
 assert.equal(audit(x).counts.has_imported_historical_observation,2);
});
test('Duplicate observation IDs, invented private fields and misleading current paid launch are rejected',()=>{
 const x=base();x.observations.push(x.observations[0]);
 assert.throws(()=>audit(x),/Invalid or duplicate fictional historical observation/);
 const y=base();y.observations[0].merchant_key='secret';
 assert.throws(()=>audit(y),/Invalid or duplicate fictional historical observation/);
 const z=base();z.observations[5].first_paid_playable_date='2025-04-01';
 assert.throws(()=>audit(z),/Archive price or presence cannot assert a first release/);
});
test('Provider roles, provenance and validated dates cannot be switched silently',()=>{
 const x=base();x.observations[0].source_id='fixture-history';
 assert.throws(()=>audit(x),/Curated removal status is not a first-paid release claim/);
 const y=base();y.observations[0].status_label='zero_sales';
 assert.throws(()=>audit(y),/Curated removal status is not a first-paid release claim/);
 const z=base();z.observations[0].observed_on='2026-11-01';
 assert.throws(()=>audit(z),/Invalid or duplicate fictional historical observation/);
 const p=base();p.observations[0].captured_on='2026-10-20';p.observations[0].observed_on='2026-10-21';
 assert.throws(()=>audit(p),/Invalid or duplicate fictional historical observation/);
});
test('Complete declared archives can still exclude historical games outside their own selection',()=>{
 const x=base();x.sources.forEach(s=>{s.observed_source_completeness=true});
 const a=audit(x);
 assert.equal(a.historical_archive_coverage_complete_for_steam,null);
 assert.equal(a.true_historical_first_paid_cohort_size,null);
 assert.equal(a.missing_paid_games_count,null);
 assert.equal(a.actual_live_archive_rows_imported,false);
});
test('Dated curated public aggregate counts are not a reconciled paid-game population',()=>{
 const r=read('ontology/steam/steam-historical-snapshot-survivorship-2026.json');
 const totals=r.public_historical_archive_review.removed_games_curated_list_observation;
 const sum=Object.values(totals.displayed_status_counts).reduce((s,n)=>s+n,0);
 assert.equal(totals.catalogued_entries,3924);
 assert.equal(sum,3900);
 assert.equal(totals.unallocated_difference,24);
 assert.equal(totals.complete_first_paid_game_population,false);
 assert.equal(totals.completed_paid_orders_observed,null);
});
test('Existing public provenance and fixed 293-task inventory survive',()=>{
 const r=read('ontology/steam/steam-historical-snapshot-survivorship-2026.json');
 const s=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 for(const id of r.source_ids)assert(ids.has(id),id);
 assert.equal(r.public_historical_archive_review.model_path,'site/steam-archive-candidate-coverage.mjs');
 assert.equal(r.public_historical_archive_review.tests_path,'tests/steam-archive-candidate-coverage.test.mjs');
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

test('A 2021-only app-list archive cannot silently supply native 2025 observations',()=>{
 const x=base();
 const prior=x.sources.find(s=>s.source_id==='fixture-history');
 prior.tracking_ended_on='2021-05-29';
 x.observations=x.observations.filter(o=>o.source_id!=='fixture-history');
 const early=evt('archive-old','old','history','positive_price_observed','2021-05-01',{
  captured_on:'2021-05-29',provenance:'provider_observed'});
 x.observations.push(early);
 assert.equal(audit(x).sources_with_declared_tracking_end,1);
 const bad=structuredClone(x);bad.observations.push(evt('invented-price2025','new','history',
  'positive_price_observed','2025-04-01',{provenance:'provider_observed'}));
 assert.throws(()=>audit(bad),/postdates declared tracking end/);
});
test('Imported historical rows also cannot postdate a frozen archive last snapshot',()=>{
 const x=base();
 const src=x.sources.find(s=>s.source_id==='fixture-history');
 src.tracking_started_on='2021-01-09';src.tracking_ended_on='2021-05-29';
 x.observations=x.observations.filter(o=>o.source_id!=='fixture-history');
 const imported=evt('old-import','old','history','positive_price_observed','2020-12-31',{
  provenance:'imported_historical'});
 x.observations.push(imported);
 assert.equal(audit(x).entries.find(e=>e.fixture_game_id==='fixture-old').has_imported_historical_record,true);
 imported.observed_on='2025-05-01';
 assert.throws(()=>audit(x),/postdates declared tracking end/);
});
test('Archive end-date metadata rejects reversed or malformed tracking windows',()=>{
 for(const end of ['2011-12-31','2026-13-01','yesterday',null,42]){
  const x=base();x.sources[0].tracking_ended_on=end;
  assert.throws(()=>audit(x),/Invalid or duplicate archive source coverage declaration/);
 }
});
test('No end date is an unresolved source coverage claim, never a verified full archive',()=>{
 const r=audit(base());
 assert.equal(r.sources_with_declared_tracking_end,0);
 assert.equal(r.declared_tracking_end_dates_are_provenance_claims_not_independently_verified,true);
 assert.equal(r.any_source_snapshot_proves_complete_2025_paid_game_cohort,false);
 assert.equal(r.true_historical_first_paid_cohort_size,null);
});

test('Versioned public May 2021 archive source is present but not a 2025 paid-release census',()=>{
 const d=read('specimens/steam.json'),study=read('ontology/steam/steam-historical-snapshot-survivorship-2026.json');
 const p=read('plans/steam.json'),q=read('queues/steam.json');
 const id='steam-woctezuma-may2021-applist-snapshot-archive-20261030',entry=d.evidence.find(s=>s.id===id);
 assert(entry,id);assert(study.source_ids.includes(id));
 const v=study.public_historical_archive_review.public_snapshot_file_vintage_audit;
 assert.equal(v.source_id,id);
 assert.equal(v.latest_archived_app_data_as_of,'2021-05-29');
 assert.equal(v.qualifies_as_2025_original_paid_launch_frame,false);
 assert.equal(v.real_2025_appids_imported,0);
 assert.equal(v.complete_2025_paid_frame,null);
 assert.equal(v.public_file_histories.length,3);
 for(const item of v.public_file_histories)assert.equal(item.last_data_commit_date,'2021-05-29');
 for(const cid of ["steam-archive-woctezuma-app-data-updated-may2021","steam-archive-woctezuma-readme-date-not-snapshot","steam-archive-store-presence-not-first-paid-status","steam-archive-end-date-controls-observation-vintage"]){
  const x=d.claims.find(c=>c.id===cid);
  assert(x,cid);assert(x.source_ids.includes(id));
 }
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);
 for(const tid of ["steam/market/count-eligible-paid-releases-including-zeros","steam/market/assess-steam-catalog-growth"]){
  const t=all.find(x=>x.id===tid);
  assert(t,tid);assert(t.evidence.includes('ontology/steam/steam-historical-snapshot-survivorship-2026.md'));
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((s,x)=>s+(x.percent??x.progress),0)/293));
});
