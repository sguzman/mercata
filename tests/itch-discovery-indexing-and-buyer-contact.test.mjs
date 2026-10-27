import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('New 2026 index-eligibility release is not a new-game or paid-buyer census',()=>{
 const d=read('ontology/itch-io/discovery-indexing-and-buyer-contact-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.first_party_event.reported_unblocked_projects_approx,215000);
 assert.equal(d.first_party_event.reported_total_indexed_projects_lower_bound_exclusive,2000000);
 assert.equal(d.first_party_event.new_game_uploads_measured,null);
 assert(d.listing_mechanics.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(d.distribution_paths.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert.equal(d.buyer_contact.buyer_email_available_only_after_first_sale,true);
 assert.equal(d.buyer_contact.buyer_email_max_per_day,1);
 assert.equal(d.methodological_controls.causal_sales_lift_claimed,false);
 assert(Object.values(d.unknown).every(v=>v===null));
 assert(d.candidate_metrics.every(x=>x.observed===null));
 for(const id of ['sales/listing']){
  const t=q.queues.flatMap(x=>x.tasks).find(x=>x.id===id);assert.equal(t.progress,100);assert.equal(t.status,'complete');
  for(const f of ['ontology/itch-io/discovery-indexing-and-buyer-contact-2026.json','ontology/itch-io/discovery-indexing-and-buyer-contact-2026.md','tests/itch-discovery-indexing-and-buyer-contact.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/discovery/enumerate-discovery-surfaces','itch-io/discovery/map-tag-search-mechanics','itch-io/sales/map-customer-update-routes','itch-io/discovery/design-discovery-analytics-protocol','itch-io/strategy/plan-launch-window-experiment']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/discovery-indexing-and-buyer-contact-2026.json','ontology/itch-io/discovery-indexing-and-buyer-contact-2026.md','tests/itch-discovery-indexing-and-buyer-contact.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
