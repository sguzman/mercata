import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('2025 web developer survey actual income answer denominator and reporting date',()=>{
 const c=read('ontology/itch-io/web-developer-survey-crosswalk-2026.json');
 const y=c.years.find(y=>y.id==='gamedevjs_2025');
 assert.equal(y.income_question_n,435);
 assert.equal(y.survey_submissions,445);
 assert.equal(y.release,'2026-01-27');
 assert.equal(c.itch_io_only_earnings_observed,false);
 assert(Object.values(c.unobserved).every(x=>x===null));
});
test('Collected tax verification fee is distinct from publish fee and realized game profit',()=>{
 const x=read('ontology/itch-io/commercial-rules-2026.json');
 const d=read('specimens/itch-io.json');
 assert.equal(x.collected_tax_identity_validation_fee_usd,3);
 assert.equal(x.fee_type,'one_time_collected_seller_account_adjustment_not_sale_listing_fee');
 assert(d.claims.some(c=>c.id==='tax-identity-validation-usd3'&&c.source_ids.includes('itch-payments')));
 assert.equal(x.unresolved.median_developer_net_profit,null);
});
