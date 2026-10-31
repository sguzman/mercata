import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditPublishedSteam2025ArchiveCoverage as audit} from '../site/steam-fountain-2025-api-archive-coverage.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-fountain-2025-api-archive-coverage-2026.json');
const sample=()=>({collection_start:study.collection_start,collection_end:study.collection_end,
 ...structuredClone(study.public_document_report)});
test('2025 archival roster counts do not collapse distinct API stages or app types',()=>{
 const r=audit(sample());
 assert.equal(r.initial_master_app_ids_reported,263890);
 assert.equal(r.archived_application_rows_reported,239664);
 assert.equal(r.difference_between_reported_master_and_stored_rows,24226);
 assert(Math.abs(r.retained_application_rows_as_fraction_of_initial_master_list-.9082)<.001);
 assert.equal(r.author_reported_detail_success_percent,56);
 assert.equal(r.detail_success_denominator_independently_reconciled,false);
 assert.equal(r.success_percentage_not_derived_from_app_roster_retention,true);
 assert.equal(r.mixed_app_types,true);
});
test('No first-paid game census, financial ledger or reviewer import is conjured from published archived metadata',()=>{
 const r=audit(sample());
 assert.equal(r.historical_paid_playable_release_attestations_present,false);
 for(const k of ['number_of_excluded_originally_paid_games','number_of_games_delisted_since_snapshot',
  'exact_zero_paid_game_count','publisher_income_distribution'])assert.equal(r[k],null,k);
 assert.equal(r.app_level_data_imported,0);assert.equal(r.reviewer_level_data_imported,0);
 assert.equal(r.reported_review_records_not_transactions,1048148);
 assert.equal(study.unknown.paid_games_with_exactly_zero_orders,null);
});
test('Reject impossible counts, claimed private rows and disguised success-denominator inference',()=>{
 const mods=[
  x=>x.collection_start='2025-02-30',
  x=>x.collection_end='2025-01-01',
  x=>x.stored_application_rows=x.master_list_application_ids+1,
  x=>x.reported_detail_request_success_percent=0,
  x=>x.reported_detail_request_success_percent=101,
  x=>x.app_categories_mixed=false,
  x=>x.download_in_this_study=true,
  x=>x.reviewer_steamid='private',
  x=>x.appid=123
 ];
 for(const f of mods){const x=sample();f(x);assert.throws(()=>audit(x));}
});
test('Source, claims and original research-task links are registered without changing the 293-task scope',()=>{
 const specimen=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const sources=new Set(specimen.evidence.map(x=>x.id)),claims=new Map(specimen.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,1);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)),id);}
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(t=>t.id)).size,293);
 for(const id of ['steam/market/define-all-live-steam-app-population','steam/market/count-eligible-paid-releases-including-zeros']){
  const task=all.find(x=>x.id===id);assert(task,id);
  for(const path of ['ontology/steam/steam-fountain-2025-api-archive-coverage-2026.md',
   'ontology/steam/steam-fountain-2025-api-archive-coverage-2026.json',
   'site/steam-fountain-2025-api-archive-coverage.mjs',
   'tests/steam-fountain-2025-api-archive-coverage.test.mjs'])assert(task.evidence.includes(path),id+' '+path);
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((n,x)=>n+(x.percent??x.progress),0)/293));
});
