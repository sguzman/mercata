import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('VN theme ratings and listed prices cannot be promoted into purchase or profit evidence',()=>{
 const d=read('ontology/itch-io/visual-novel-niche-attention-hypotheses-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.frame.analyzed_digital_VN_pages,10427);
 assert.equal(d.frame.unique_tags,3195);
 assert.equal(d.frame.actual_buyer_transactions_in_study,false);
 assert.equal(d.reported_thematic_clusters.find(x=>x.id==='otome_dark_romance').pages_with_at_least_50_public_ratings,92);
 assert.equal(d.reported_thematic_clusters.find(x=>x.id==='otome_dark_romance').high_rated_with_yandere_tag,48);
 assert(d.niche_candidates.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert.equal(d.niche_candidates.length,3);
 assert.equal(d.sampling_contract.require_private_seller_authorization,true);
 assert(Object.values(d.unknown).every(x=>x===null));
 assert.equal(d.experiment_authorized,false);
 for(const id of ['discovery/keywords','competition/position','competition/quality']){
  const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/visual-novel-niche-attention-hypotheses-2026.json','ontology/itch-io/visual-novel-niche-attention-hypotheses-2026.md','tests/itch-visual-novel-niche-attention-hypotheses.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/strategy/compare-genre-positioning','itch-io/competition/model-first-time-versus-established-creators']){
  const t=p.detail_tasks.find(x=>x.id===id);assert(t.percent<100);assert(t.evidence.includes('ontology/itch-io/visual-novel-niche-attention-hypotheses-2026.json'));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
