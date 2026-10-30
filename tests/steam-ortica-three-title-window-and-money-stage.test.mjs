import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-ortica-three-title-selfreport-currency-window-audit-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('Three official first-paid app identities are one selected studio, not three independent earners',()=>{
 assert.equal(x.titles.length,3);assert.equal(new Set(x.titles.map(y=>y.appid)).size,3);
 assert.deepEqual(x.titles.map(y=>y.first_paid_release),['2025-08-08','2026-03-06','2026-08-27']);
 assert.equal(x.interpretation.independent_studios,1);
 assert.equal(x.interpretation.independently_audited_merchant_ledgers,0);
 assert.equal(x.interpretation.can_infer_representative_developer_median,false);
});
test('Visible publication date must not silently absorb a later author-as-of date',()=>{
 assert(x.source_chronology.contains_loan_shark_as_of_date>x.source_chronology.post_publication_date);
 assert.equal(x.source_chronology.future_dated_relative_to_original_publication,true);
 assert.equal(x.source_chronology.edit_history_verified,false);
 assert.equal(x.titles[0].observation_window_compatible_with_publication_date,false);
 assert.equal(x.titles[2].later_cumulative_net_copies_reported,2600);
 assert.equal(x.titles[2].gross_usd_approx,7150);
});
test('Mixed currencies, tax assumptions, and nonconcurrent figures do not become audited cash',()=>{
 assert.equal(x.descriptive_sum_of_nonsynchronous_figures.gross_usd,x.titles.reduce((a,b)=>a+b.gross_usd_approx,0));
 assert.equal(x.descriptive_sum_of_nonsynchronous_figures.author_eur_after_deductions,x.titles.reduce((a,b)=>a+b.author_eur_after_deductions_approx,0));
 assert.equal(x.descriptive_sum_of_nonsynchronous_figures.is_same_date_portfolio_statement,false);
 assert.equal(x.interpretation.eur_amounts_are_bank_receipts,false);
 assert.equal(x.interpretation.eur_amounts_are_profit_after_costs,false);
 assert.equal(x.interpretation.can_infer_festival_sales_effect,false);
 assert(Object.values(x.unknown).every(y=>y===null));
});
test('Each fact belongs to a public source; no new research tasks or private ledgers',()=>{
 const sources=new Set(d.evidence.map(y=>y.id)),claims=new Map(d.claims.map(y=>[y.id,y]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,13);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(y=>y.percent),...q.queues.flatMap(y=>y.tasks.map(z=>z.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert.equal(x.private_financial_records_used,false);
});
