import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Paid 2D supply, ranked prices and all-domain visits are nonadditive and not sales',()=>{
 const r=read('ontology/itch-io/paid-game-supply-vs-attention-denominators-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 const available=new Set(s.evidence.map(x=>x.id));assert(r.source_ids.every(id=>available.has(id)));
 const lookup=id=>r.observed_filter_snapshots.find(x=>x.id===id)?.count;
 assert.equal(lookup('paid_2d_tag_pages'),12691);
 assert.equal(lookup('paid_html5_type'),7589);
 assert.equal(lookup('paid_downloadable_type'),34058);
 assert.equal(r.relative_counts_may_be_summed_to_unique_games,false);
 assert.equal(r.file_type_observations_are_mutually_exclusive,false);
 assert.equal(r.cross_snapshot_share_estimation_valid,false);
 assert.equal(r.selected_rank_sample.fully_discounted_zero_price_entries,2);
 assert.equal(r.domain_visit_models[0].estimated_all_site_visits,162370000);
 assert.equal(r.domain_visit_models[1].estimated_all_site_visits,60600000);
 assert(r.measure_contract.every(x=>x.stage==='public_listing'||x.observed_count===null));
 assert(Object.values(r.unknown).every(x=>x===null));
 for(const id of ['itch-io/market/measure-2d-game-supply','itch-io/competition/define-paid-competitor-set','itch-io/market/define-browsing-attention-measures']){
  const t=p.detail_tasks.find(x=>x.id===id);
  assert.equal(t?.percent,100,id);assert.equal(t?.status,'complete',id);
  for(const path of ['ontology/itch-io/paid-game-supply-vs-attention-denominators-2026.json','ontology/itch-io/paid-game-supply-vs-attention-denominators-2026.md','tests/itch-paid-game-supply-vs-attention-denominators.test.mjs'])assert(t.evidence.includes(path),id);
 }
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((p.detail_tasks.reduce((a,x)=>a+x.percent,0)+q.queues.flatMap(x=>x.tasks).reduce((a,x)=>a+x.progress,0))/244));
});
