import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Publisher ownership, nonexclusive platform license and nontransferable account are not conflated',()=>{
 const r=get('ontology/itch-io/publisher-ip-licensing-and-account-nontransfer-2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 assert(r.source_ids.every(x=>s.evidence.some(z=>z.id===x)));
 assert.equal(r.publisher_rights.publisher_retains_uploaded_content_ownership,true);
 assert.equal(r.publisher_rights.site_receives_nonexclusive_license,true);
 assert.equal(r.publisher_rights.third_party_game_assets_automatically_cross_store_cleared,false);
 assert.equal(r.transferability.find(x=>x.id==='site_account').automatic_transfer_allowed,false);
 assert.equal(r.transferability.find(x=>x.id==='licensed_buyer_copy').automatic_transfer_allowed,null);
 assert.equal(r.distribution_routes.find(x=>x.id==='external_key_only_page').supported_by_default,false);
 assert.equal(r.distribution_routes.find(x=>x.id==='DRM_free_download').binary_itself_DRM_free_verified,null);
 assert(Object.values(r.unresolved).every(x=>x===null));
 for(const id of ['rights/exclusive','special-games/special-5']){
  const t=q.queues.flatMap(z=>z.tasks).find(x=>x.id===id);
  assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const x of ['ontology/itch-io/publisher-ip-licensing-and-account-nontransfer-2026.json','ontology/itch-io/publisher-ip-licensing-and-account-nontransfer-2026.md','tests/itch-publisher-ip-and-nontransfer.test.mjs'])assert(t.evidence.includes(x));
 }
 for(const id of ['itch-io/rights/verify-developer-ip-position','itch-io/rights/check-resale-and-transfer-conditions']){
  const t=p.detail_tasks.find(x=>x.id===id);
  assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const x of ['ontology/itch-io/publisher-ip-licensing-and-account-nontransfer-2026.json','ontology/itch-io/publisher-ip-licensing-and-account-nontransfer-2026.md','tests/itch-publisher-ip-and-nontransfer.test.mjs'])assert(t.evidence.includes(x));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(z=>z.tasks).reduce((a,x)=>a+x.progress,0)+p.detail_tasks.reduce((a,x)=>a+x.percent,0))/244));
});
