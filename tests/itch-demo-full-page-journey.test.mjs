import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('One-game initial purchase and demo-to-paid-page events stay unjoined and nonrepresentative',()=>{
 const x=get('ontology/itch-io/demo-full-page-journey-first-sale-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.case_measurements.initial_copy_purchase_self_reported,true);
 assert.equal(x.case_measurements.first_copy_payment_receipt_verified,false);
 assert.equal(x.case_measurements.declared_browser_demo_to_full_page_navigation_fraction_approximate,0.2);
 assert.equal(x.case_measurements.raw_demo_events_numerator,null);assert.equal(x.case_measurements.raw_demo_events_denominator,null);
 assert.equal(x.case_measurements.one_sale_attributed_to_demo,false);
 assert(Object.values(x.not_inferred).every(v=>v===null));
});
test('Only the existing browser-play conversion task advances within unchanged inventory',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/sales/study-browser-play-conversion');
 assert.equal(t.percent,70);assert.equal(t.status,'in_progress');
 for(const evidence of ['ontology/itch-io/demo-full-page-journey-first-sale-2026.json','ontology/itch-io/demo-full-page-journey-first-sale-2026.md','tests/itch-demo-full-page-journey.test.mjs'])assert(t.evidence.includes(evidence));
});
