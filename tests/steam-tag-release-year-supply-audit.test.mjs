import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditPublicSteamTagReleaseYearSupply as audit} from '../site/steam-tag-release-year-supply-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-four-tag-2024-2025-public-release-supply-2026.json');
const f=()=>structuredClone(study.observed_aggregate);
test('Four observed yearly Steam tag supply counts reconcile to each reported provider denominator',()=>{
 const r=audit(f());assert.equal(r.row_count,4);
 assert.equal(r.overall_2024_store_game_releases,17393);
 assert.equal(r.overall_2025_store_game_releases,20561);
 assert.deepEqual(r.rows.map(x=>x.additional_tagged_release_records_2025),[834,1212,791,521]);
 assert.deepEqual(r.rows.map(x=>x.reported_share_change_percentage_points),[-2,2.4,0.6,-0.9]);
 for(const k of ['unique_games_across_selected_tags','exact_simultaneous_tag_overlap',
  'original_paid_release_counts_by_tag','refund_adjusted_sales_by_tag',
  'representative_creator_income_by_tag','exact_zero_paid_sale_fraction_by_tag'])
  assert.equal(r[k],null,k);
});
test('2025 tag counts can rise even where the share of releases falls',()=>{
 const x=audit(f());for(const tag of ['Action','Puzzle']){
  const row=x.rows.find(r=>r.tag===tag);
  assert(row.additional_tagged_release_records_2025>0);assert(row.reported_share_change_percentage_points<0);
 }
});
test('Tag membership cannot be silently treated as mutually exclusive paid games',()=>{
 const s=study.observed_aggregate;
 assert(s.tag_rows.reduce((n,x)=>n+x.release_count_2025,0)>s.year_totals[1].store_game_releases);
 const r=audit(f());assert.equal(r.unique_games_across_selected_tags,null);
 assert.equal(r.tags_are_nonexclusive_and_can_change_over_time,true);
 assert.equal(r.tag_pages_may_have_different_refresh_times,true);
});
test('Reject wrong tags, denominators, shares, raw game records and inconsistent scope',()=>{
 const changes=[
  x=>{x.tag_rows[0].release_count_2025=999999;},
  x=>{x.tag_rows[0].provider_share_pct_2025=99;},
  x=>{x.tag_rows.push({...x.tag_rows[0]});},
  x=>{x.year_totals[1].year=2024;},
  x=>{x.tag_rows[0].appids=[100,200];},
  x=>{x.api_key='secret';},
  x=>{x.tag_rows[0].source_id='private';},
  x=>{x.tag_rows[0].release_count_2024=-1;}
 ];
 for(const change of changes){const x=f();change(x);assert.throws(()=>audit(x));}
});
test('Source metadata explicitly preserves only game-tag supply and unknown financial outcomes',()=>{
 assert.equal(study.observed_aggregate.tag_rows.length,4);
 assert.equal(study.source_ids.length,5);
 assert(study.selection_limitations.some(s=>/paid status/.test(s)));
 assert(Object.values(study.unknown).every(v=>v===null));
 assert.equal(study.appids_imported,0);assert.equal(study.commercial_transactions_imported,0);
});

test('Documented next-day Puzzle snapshot is a dated revision, not extra paid game sales',()=>{
 const r=study.followup_public_snapshot;
 assert.equal(r.observed_on,'2026-10-31');
 assert.equal(r.earlier_observation_on,'2026-10-30');
 assert.equal(r.original_tagged_release_count,4374);
 assert.equal(r.followup_tagged_release_count,4373);
 assert.equal(r.changed_tagged_release_count,-1);
 assert.equal(study.observed_aggregate.tag_rows.find(x=>x.tag==='Puzzle').release_count_2025,4374);
 assert.equal(r.changes_retroactively_edit_original_record,false);
 assert.equal(r.actual_paid_sales_estimate,null);
});
test('Reject fake observation calendar date and reuse of one provider URL for multiple tag series',()=>{
 const a=f();a.observed_on='2026-02-30';assert.throws(()=>audit(a),/Two adjacent/);
 const b=f();b.tag_rows[1].source_id=b.tag_rows[0].source_id;
 assert.throws(()=>audit(b),/Invalid or duplicate public tag aggregate/);
});
test('Registered source claims and original Steam task weights match the public study',()=>{
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){
  const x=claims.get(id);assert(x,id);
  assert(x.source_ids.every(s=>sources.has(s)),id);
 }
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 for(const id of ['steam/market/study-genre-paid-release-supply',
  'steam/market/assess-steam-catalog-growth','steam/competition/audit-genre-intersections']){
  const x=all.find(t=>t.id===id);assert(x,id);
  assert(x.evidence.includes('ontology/steam/steam-four-tag-2024-2025-public-release-supply-2026.json'));
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((a,x)=>a+(x.percent??x.progress),0)/293));
});
