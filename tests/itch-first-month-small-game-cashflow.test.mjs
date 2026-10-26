import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First-month shooter report stays unqualified earnings, not invented $5 paid copies',()=>{
 const x=get('ontology/itch-io/first-month-small-game-cashflow-2025-2026.json');
 const d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 const b=x.cases.find(c=>c.id==='basement_raid');
 assert.equal(b.release_date,'2025-08-15');
 assert.equal(b.first_month_reported_earnings_usd,10);
 assert.equal(b.first_month_itch_paid_units,null);
 assert.equal(b.developer_profit_usd,null);
 assert.equal(b.total_development_hours,null);
});
test('Real first-game donation payout arithmetic reconciles in cents without treating donations as paid game orders',()=>{
 const x=get('ontology/itch-io/first-month-small-game-cashflow-2025-2026.json');
 const a=x.verified_arithmetic;
 assert.equal(a.gross_cents-a.processor_cents-a.platform_cents-a.tax_document_cents-a.withheld_cents,a.after_platform_deductions_cents);
 assert.equal(a.after_platform_deductions_cents-a.charity_cents,a.author_take_home_cents);
 const d=x.cases.find(c=>c.id==='genetic_collections_axolotls');
 assert.equal(d.first_month_donations_count,1);
 assert.equal(d.first_month_mandatory_price_game_orders,null);
 assert.equal(d.one_donation_implies_one_paid_copy,false);
 assert.equal(d.net_economic_profit_usd,null);
 assert.equal(d.tax_final_obligation_usd,null);
});
test('Neither selected game identifies market income mean, median, profit or paid demand',()=>{
 const x=get('ontology/itch-io/first-month-small-game-cashflow-2025-2026.json');
 assert.equal(x.sampling.independent_developers,2);
 assert.equal(x.sampling.probability_sample,false);
 for(const k of ['platform_mean_first_month_income','platform_median_first_month_income','first_paid_game_earnings_distribution','genre_income_effect','platform_zero_sale_fraction'])assert.equal(x.sampling[k],null);
});
