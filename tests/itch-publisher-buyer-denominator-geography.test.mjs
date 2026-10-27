import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Buyer/publisher identity, geography and periods are defined but no actual sales census is inferred',()=>{
 const d=get('ontology/itch-io/publisher-buyer-denominator-geography-2026.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(d.source_ids.every(id=>ids.has(id)));
 for(const group of [d.seller_segments,d.merchant_modes,d.buyer_segments,d.geo_frames])for(const z of group)assert(z.source_ids.every(id=>ids.has(id)));
 assert(d.buyer_segments.some(z=>z.id==='paid_game_purchaser'&&z.buyer_account_required===false));
 assert(d.buyer_segments.some(z=>z.id==='game_download_key_recipient'&&z.is_paid_customer===null));
 assert(d.buyer_segments.some(z=>z.id==='repeat_paid_game_purchaser'&&z.unique_person_supported==='requires_private_consent_and_deduplication'));
 assert.deepEqual(d.period_contract.first_paid_game_release_cohort_windows_days,[30,90,365]);
 assert.equal(d.period_contract.include_zero_paid_titles,true);
 assert(d.geo_frames.some(z=>z.id==='mexico_example'&&z.population_coverage_verified===false));
 assert(Object.values(d.unavailable).every(v=>v===null));
 assert.equal(d.privacy.no_buyer_identifiers_stored,true);
 for(const id of ['identity/audience','market/buyers']){
   const x=q.queues.flatMap(g=>g.tasks).find(t=>t.id===id);assert.equal(x.progress,100,id);assert.equal(x.status,'complete',id);
   for(const f of ['ontology/itch-io/publisher-buyer-denominator-geography-2026.json','ontology/itch-io/publisher-buyer-denominator-geography-2026.md','tests/itch-publisher-buyer-denominator-geography.test.mjs'])assert(x.evidence.includes(f));
 }
 for(const id of ['itch-io/identity/define-buyer-populations','itch-io/identity/choose-geographic-scope']){
   const x=p.detail_tasks.find(t=>t.id===id);assert.equal(x.percent,100,id);assert.equal(x.status,'complete',id);
   for(const f of ['ontology/itch-io/publisher-buyer-denominator-geography-2026.json','ontology/itch-io/publisher-buyer-denominator-geography-2026.md','tests/itch-publisher-buyer-denominator-geography.test.mjs'])assert(x.evidence.includes(f));
 }
 assert.equal(q.queues.flatMap(g=>g.tasks).find(t=>t.id==='market/sellers').progress,42);
 assert.equal(p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-active-sellers').percent,44);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(g=>g.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
