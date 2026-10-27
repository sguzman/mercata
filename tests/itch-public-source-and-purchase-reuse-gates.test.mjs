import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('All research provenance is linked while external copyright and private buyer data remain restricted',()=>{
 const a=load('ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(a.source_ids.every(id=>ids.has(id)));
 assert.equal(a.dossier_review.source_records,s.evidence.length);
 assert.equal(a.dossier_review.bounded_claim_records,s.claims.length);
 assert.equal(a.dossier_review.all_claim_source_ids_grounded,true);
 assert.equal(a.dossier_review.all_sources_have_reuse_note,true);
 assert.equal(a.dossier_review.private_buyer_records_collected,0);
 assert.equal(a.research_acceptance.all_external_copyright_and_database_reuse_cleared,false);
 assert.equal(a.research_acceptance.seller_private_aggregate_data_collected,false);
 assert(a.protected_fields.includes('transaction_id'));assert(a.protected_fields.includes('download_key'));
 assert(a.classes.some(x=>x.id==='buyer_purchase_entitlement_API'&&x.private_consent_required));
 assert(Object.values(a.still_unknown).every(v=>v===null));
 const review=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='review/privacy');
 assert.equal(review.progress,100);assert.equal(review.status,'complete');
 for(const f of ['ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json','ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.md','tests/itch-public-source-and-purchase-reuse-gates.test.mjs'])assert(review.evidence.includes(f));
 for(const id of ['itch-io/identity/specify-evidence-permissions','itch-io/rights/study-personal-data-rules']){
  const x=p.detail_tasks.find(t=>t.id===id);assert.equal(x.percent,100,id);assert.equal(x.status,'complete',id);
  for(const f of ['ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json','ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.md','tests/itch-public-source-and-purchase-reuse-gates.test.mjs'])assert(x.evidence.includes(f));
 }
 const x=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='rights/reuse');
 assert(x.progress<100);assert(x.evidence.includes('ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json'));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});
