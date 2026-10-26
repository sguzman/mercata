import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Same-game week and five-year payment events are not a marketwide revenue series',()=>{
 const a=get('ontology/itch-io/year-of-springs-long-tail-2021-2026.json'),s=get('specimens/itch-io.json');
 assert(a.source_ids.every(x=>s.evidence.some(e=>e.id===x)));
 assert.deepEqual(a.snapshots.map(x=>x.itch_payment_events),[324,1789]);
 assert.equal(a.post_week_through_year_five_payment_events,1465);
 assert(Math.abs(a.after_week_fraction_of_five_year_payment_events-(1465/1789))<0.000001);
 assert.equal(a.downloads_are_paid_units,false);
 assert(Object.values(a.unobserved).every(v=>v===null));
});
