import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Unknown marketwide publisher mean/median explicitly depend on a zero-inclusive eligible seller frame',()=>{
 const r=get('ontology/itch-io/paid-seller-mean-median-identification-2026.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json'),s=get('specimens/itch-io.json');
 assert(r.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(r.target_population.sample_frame_available,false);
 assert.deepEqual(r.target_population.first_release_window_days,[30,90,365]);
 assert(r.target_population.inclusions.some(z=>z.includes('zero_settled_orders')));
 assert(r.evidence_classes.every(x=>x.source_ids.every(id=>s.evidence.some(y=>y.id===id))));
 assert(r.evidence_classes.every(x=>x.has_complete_seller_population===false));
 assert(Object.values(r.results).every(x=>x===null));
 for(const id of ['income/average','income/median','income/population']){
  const t=q.queues.flatMap(z=>z.tasks).find(t=>t.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const file of ['ontology/itch-io/paid-seller-mean-median-identification-2026.json','ontology/itch-io/paid-seller-mean-median-identification-2026.md','tests/itch-paid-seller-mean-median-identification.test.mjs'])assert(t.evidence.includes(file));
 }
 const cohort=p.detail_tasks.find(t=>t.id==='itch-io/income/define-eligible-seller-cohort');
 assert.equal(cohort.percent,100);assert.equal(cohort.status,'complete');
 const mean=p.detail_tasks.find(t=>t.id==='itch-io/income/estimate-mean-seller-income');
 const median=p.detail_tasks.find(t=>t.id==='itch-io/income/estimate-median-seller-income');
 assert(mean.percent<100);assert(median.percent<100);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(z=>z.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});

test('Official owner portfolio summaries cannot identify representative seller receipts',()=>{
 const r=get('ontology/itch-io/paid-seller-mean-median-identification-2026.json');
 const creator=get('ontology/itch-io/creator-population-account-person-game-2026.json');
 const example=r.evidence_classes.find(x=>x.id==='authorized_owner_profile_games_summary');
 assert(example&&example.example_only_not_a_real_seller_observation);
 assert.equal(example.has_complete_seller_population,false);
 assert.equal(example.returns_complete_refund_adjusted_periodized_seller_proceeds,false);
 assert.equal(example.owner_vs_editor_payout_identity_resolved,false);
 assert.equal(creator.owner_scoped_possible_observation_route.authenticated_requests_made,0);
 assert.equal(creator.owner_scoped_possible_observation_route.supplies_verified_all_active_paid_seller_census,false);
 assert(Object.values(r.results).every(x=>x===null));
});
