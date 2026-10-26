import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('2D paid public filter is an intersection not paid unit sales',()=>{
 const c=read('ontology/itch-io/catalog-snapshot-2026.json'),d=read('specimens/itch-io.json');
 const o=c.observations.find(x=>x.id==='games_paid_2d');
 assert.equal(o.value,12691);assert.equal(o.paid_sales,null);assert.equal(o.money_earned,null);
 assert.equal(c.derived.paid_2d_to_all_2d_filter_percent,2.96);
 assert(d.evidence.some(s=>s.id===o.source_id));assert(Object.values(c.unsupported).every(x=>x===null));
});
test('Popular 2D pilot reports discounted zero tags and no merchant outcomes',()=>{
 const p=read('ontology/itch-io/paid-2d-popular-prices-2026.json');
 assert.equal(p.entries.length,15);
 assert.deepEqual(p.entries.map(e=>e.rank_in_observed_popular_page),Array.from({length:15},(_,i)=>i+1));
 assert(p.entries.some(e=>e.displayed_price_usd===0 && e.price_badge_type==='100_percent_discount'));
 assert(p.entries.every(e=>e.product_units_sold===null&&e.developer_profit===null));
 for(const k of ['representative_price_median_usd','representative_paid_game_mean_price_usd','sales_weighted_price_usd','profit_by_genre_usd','first_timer_earnings_usd'])assert.equal(p[k],null);
});
