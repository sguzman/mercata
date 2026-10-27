import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Popular paid 2D prices use the ranked-sample denominator and separate sale badges',()=>{
 const x=load('ontology/itch-io/paid-2d-listed-price-observation-boundary-2026.json'),s=load('specimens/itch-io.json'),orig=load('ontology/itch-io/paid-2d-popular-prices-2026.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(orig.entries.length,x.prices.items_count);
 assert.equal(x.prices.median_of_all_fifteen_displayed_usd,5.99);
 assert.equal(x.prices.median_non_full_discount_displayed_usd,10);
 assert.equal(x.prices.median_plain_badge_usd,10);
 assert.equal(orig.entries.filter(e=>e.price_badge_type==='100_percent_discount').length,2);
 assert.equal(x.sampling.random_sample,false);
 assert.equal(x.prices.prices_are_realized_paid_order_amounts,false);
 assert.equal(x.commercial_unit_contract.no_valid_platform_price_median,true);
 assert(Object.values(x.unmeasured).every(v=>v===null));
 for(const id of ['competition/sample','competition/prices']){
  const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/paid-2d-listed-price-observation-boundary-2026.json','ontology/itch-io/paid-2d-listed-price-observation-boundary-2026.md','tests/itch-paid-2d-price-observation-boundary.test.mjs'])assert(t.evidence.includes(f));
 }
 const z=p.detail_tasks.find(t=>t.id==='itch-io/competition/record-price-distributions');assert.equal(z.percent,100);assert.equal(z.status,'complete');
 const comparator=p.detail_tasks.find(t=>t.id==='itch-io/competition/define-paid-competitor-set');
 assert.equal(comparator.percent,100);assert.equal(comparator.status,'complete');
 assert(comparator.evidence.includes('ontology/itch-io/paid-game-supply-vs-attention-denominators-2026.json'));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
