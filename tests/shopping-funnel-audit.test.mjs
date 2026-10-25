import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditShoppingInference,assessMerchantMetric} from '../site/shopping-funnel-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Ranked 2025 commercial samples and 500-person Gen Z survey use different units',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/shopping-funnel-evidence-2025.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(m.frames[0].records_selected,5000);assert.equal(m.frames[1].records_selected,1000);
 assert.equal(m.frames[2].surveyed_respondents,500);
 assert.equal(m.frames[2].percent_agree_youtube_helped_discover_unfamiliar_brands_or_products,61);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Discovery is not verified purchase and top-ranked SKUs are not orders',async()=>{
 const m=await load('ontology/youtube/shopping-funnel-evidence-2025.json');
 const x=auditShoppingInference(m,'self_reported_us_genz_brand_discovery','us_genz_discovery_agreement');
 assert.equal(x.allowed,true);assert.equal(x.percentage,61);assert.equal(x.observed_purchases,null);
 assert.equal(auditShoppingInference(m,'company_selected_transaction_top_items','ranked_product_sample_size').selected_product_skus,5000);
 assert.equal(auditShoppingInference(m,'company_selected_transaction_top_items','platform_conversion_rate').allowed,false);
 assert.equal(auditShoppingInference(m,'self_reported_us_genz_brand_discovery','verified_purchase_rate').allowed,false);
});
test('Merchant metrics require access and cannot be treated as settled cash',async()=>{
 const m=await load('ontology/youtube/shopping-funnel-evidence-2025.json');
 assert.equal(m.merchant_center.metrics.length,7);
 assert.equal(assessMerchantMetric(m,'orders').available,false);
 const x=assessMerchantMetric(m,'orders',{authorized:true});
 assert.equal(x.available,true);assert.equal(x.observed_value,null);
 assert.equal(x.settled_approved_only,false);
 assert.equal(assessMerchantMetric(m,'commissions',{authorized:true}).settled_approved_only,false);
 assert.equal(m.merchant_center.verified_creator_after_cost_profit,null);
});
test('Public website labels actual attribution and missing conversions',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderShoppingFunnelEvidence'));
 assert(site.includes('shopping-funnel-evidence-2025.json'));
 assert(site.includes('no verified public conversion rate'));
});
