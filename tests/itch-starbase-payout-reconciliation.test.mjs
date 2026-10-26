import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Starbase year counts, actual self-reported cash and transaction payout windows remain distinct',()=>{
 const x=load('ontology/itch-io/starbase-first-year-payout-reconciliation-2022.json');
 const d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(z=>z.id===id)));
 assert.equal(x.year_observation.game_page_view_events,6542);
 assert.equal(x.year_observation.file_download_events,1425);
 assert.equal(x.year_observation.payment_events,13);
 assert.equal(x.year_observation.reported_game_gross_revenue_usd,95.35);
 assert.equal(x.year_equals_payout_window,false);
 assert.equal(x.year_observation.mandatory_price_game,false);
 assert.equal(x.year_observation.verified_positive_price_game_copies,null);
});
test('Reported $66.40 payout conflicts with fee-only arithmetic by 23 cents without speculative missing fee',()=>{
 const x=load('ontology/itch-io/starbase-first-year-payout-reconciliation-2022.json').payout_observation;
 const result=Math.round((x.reported_payout_gross_usd-x.reported_itch_share_usd-x.reported_payment_processor_fees_usd)*100)/100;
 assert.equal(result,x.computed_gross_less_two_fee_lines_usd);
 assert.equal(Math.round((result-x.reported_net_payout_usd)*100),23);
 assert.equal(x.unreconciled_difference_usd,0.23);
 assert.equal(x.private_payout_ledger_seen,false);
});
test('Single game free-download donation events do not estimate paid game population and profits',()=>{
 const x=load('ontology/itch-io/starbase-first-year-payout-reconciliation-2022.json');
 assert.equal(x.year_observation.net_business_profit_usd,null);
 assert.equal(x.year_observation.unique_paid_buyers,null);
 assert.equal(x.population_estimates.median_first_paid_game_income,null);
 assert.equal(x.population_estimates.platformwide_paying_customer_population,null);
 assert.equal(x.population_estimates.genre_profitability,null);
});
