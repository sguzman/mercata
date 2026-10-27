import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('The same three titles are paired across two creator snapshots, not six independent sellers',()=>{
 const x=get('ontology/itch-io/spiral-atlas-four-year-game-payment-deltas-2020-2024.json'),s=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.num_distinct_publishers,1);
 assert.equal(x.num_overlap_titles,3);
 assert.equal(x.title_comparisons[0].download_events_change,1931);
 assert.equal(x.title_comparisons[0].payment_events_change,24);
 assert.equal(x.title_comparisons[0].reported_revenue_usd_change,201);
 assert.equal(x.title_comparisons[1].reported_revenue_usd_change,5);
 assert.equal(x.title_comparisons[2].payment_events_change,0);
 assert.equal(x.title_comparisons[2].download_events_change,59);
});
test('Two published Perpixeled ratio mistakes are flagged and kept separate from event arithmetic',()=>{
 const x=get('ontology/itch-io/spiral-atlas-four-year-game-payment-deltas-2020-2024.json').title_comparisons.find(x=>x.name==='Perpixeled');
 assert.equal(x.reported_payment_download_percent_2020,0.5);assert.equal(x.reported_payment_download_percent_2024,0.3);
 assert(Math.abs(x.arithmetic_event_ratio_percent_2020-100*6/122)<1e-9);
 assert(Math.abs(x.arithmetic_event_ratio_percent_2024-100*6/181)<1e-9);
 assert.equal(x.source_reported_percent_2020_inconsistent,true);
 assert.equal(x.source_reported_percent_2024_inconsistent,true);
});
test('Pairing selected voluntary cumulative results cannot identify a population income trend',()=>{
 const x=get('ontology/itch-io/spiral-atlas-four-year-game-payment-deltas-2020-2024.json');
 for(const k of Object.keys(x.noncomparable))assert.equal(x.noncomparable[k],null);
});
