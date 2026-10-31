import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditPublicSteamCollectorCoverage as audit} from '../site/steam-native-tracker-coverage-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-native-tracker-coverage-boundaries-2026.json');
const sample=()=>structuredClone(study.public_snapshot);
test('Operational appinfo coverage difference is not a paid-game or delisting count',()=>{
 const result=audit(sample());
 assert.equal(result.apps_seen_in_provider_database,420362);
 assert.equal(result.apps_with_raw_appinfo,419636);
 assert.equal(result.provider_raw_appinfo_count_difference,726);
 assert.equal(result.raw_appinfo_absence_is_confirmed_historical_delisting,false);
 assert.equal(result.historical_complete_paid_game_appids,null);
 assert.equal(result.exact_zero_order_game_rate,null);
});
test('Two player collection status sections are not a common partition or sales data',()=>{
 const a=audit(sample());
 assert.equal(a.reported_apps_with_player_tracking_in_coverage,146094);
 assert.equal(a.reported_apps_tracked_in_player_collector,325429);
 assert.equal(a.reported_currently_unavailable_player_apps,117111);
 assert.equal(a.reported_failed_last_player_collection_attempt,198);
 assert.equal(a.two_player_tracking_counts_have_verified_matching_denominators,false);
 assert.equal(a.player_collector_unavailable_is_zero_purchases,false);
 assert.equal(a.author_verified_net_income,null);
});
test('Native September 2026 monitoring cannot testify to first-paid playable launches in 2025',()=>{
 const a=audit(sample());
 assert.equal(a.native_pics_history_since,'2026-09-11');
 assert.equal(a.native_price_history_since,'2026-09-11');
 assert.equal(a.can_natively_reconstruct_2025_original_paid_launches,false);
 assert.equal(study.provenance.older_prices_may_be_imported_from,'IsThereAnyDeal');
 assert.equal(study.provenance.historical_imports_source_separated,true);
 assert.equal(study.appids_imported,0);
});
test('Invalid dates, app counts, hidden ID fields, false game-only scope fail closed',()=>{
 const changes=[
  x=>x.status_page_collector_date='2026-02-30',
  x=>x.native_price_history_since='2026-11-01',
  x=>x.reported_raw_appinfo_records=x.reported_total_app_records+1,
  x=>x.reported_apps_tracked_in_player_collector=-1,
  x=>x.primary_archive_covers_base_games_only=true,
  x=>x.customer_ids=[1,2],
  x=>x.provider='Valve'
 ];
 for(const change of changes){const x=sample();change(x);assert.throws(()=>audit(x));}
});
test('Two dated public sources and claims link to existing research without changing original 293 tasks',()=>{
 const s=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const sourceIDs=new Set(s.evidence.map(x=>x.id)),claims=new Map(s.claims.map(x=>[x.id,x]));
 for(const id of study.source_ids)assert(sourceIDs.has(id),id);
 for(const id of study.claim_ids){
  const c=claims.get(id);assert(c,id);
  assert(c.source_ids.every(id=>sourceIDs.has(id)));
 }
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 const affected=all.find(x=>x.id==='steam/market/define-all-live-steam-app-population');
 assert(affected);
 for(const name of ['ontology/steam/steam-native-tracker-coverage-boundaries-2026.md',
 'ontology/steam/steam-native-tracker-coverage-boundaries-2026.json',
 'site/steam-native-tracker-coverage-audit.mjs',
 'tests/steam-native-tracker-coverage-audit.test.mjs'])assert(affected.evidence.includes(name),name);
 assert.equal(p.progress_percent,Math.round(all.reduce((n,x)=>n+(x.percent??x.progress),0)/293));
});
