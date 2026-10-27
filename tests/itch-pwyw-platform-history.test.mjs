import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('The 2015 platform source separates extra tipping on paid orders from donation choice among free downloads',()=>{
 const x=read('ontology/itch-io/pwyw-platform-history-2015.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.paid_minimum_purchase_events.extra_payment_share_approx,0.30);
 assert.equal(x.paid_minimum_purchase_events.extra_payment_mean_conditional_usd,3.67);
 assert.equal(x.zero_minimum_content.donation_mean_conditional_positive_usd,3.68);
 assert.equal(x.zero_minimum_content.zero_dollar_downloads_count,null);
 assert.equal(x.zero_minimum_content.proportion_all_downloaders_who_donate,null);
 assert.equal(x.historic_payouts.per_seller_mean,null);
 assert.equal(x.study_limits.contemporary_2026_buyer_rates,null);
});
test('Free nonpayer population remains unresolved and its research task stays in progress',()=>{
 const p=read('plans/itch-io.json'),x=read('ontology/itch-io/pwyw-platform-history-2015.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/sales/model-pay-what-you-want-amounts');
 assert.equal(t.percent,98);assert.equal(t.status,'in_progress');
 assert(t.evidence.includes('ontology/itch-io/pwyw-platform-history-2015.md'));
 assert.equal(x.checkout_attribution.dimensions_overlap,true);
});
