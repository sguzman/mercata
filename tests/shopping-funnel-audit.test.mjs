import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditShoppingInference,assessMerchantMetric,auditShoppingIntentFrames} from '../site/shopping-funnel-audit.mjs';
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

test('Independent 2025 Kantar attitudes and 2023 Material shopper typology are distinct bounded samples',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/shopping-funnel-evidence-2025.json'),load('specimens/youtube.json')]);
 const audit=auditShoppingIntentFrames(m,new Set(d.evidence.map(x=>x.id)));
 assert.deepEqual(audit,{valid:true,errors:[]});
 const [k,j]=m.intent_reference_frames;
 assert.equal(k.overall_sample_n,2160);
 assert.equal(k.per_question_n,null);
 assert.deepEqual(k.observations.map(x=>x.percent),[69,70,63,91,81,76,81]);
 assert.equal(j.survey_sample_n,2420);
 assert.equal(j.journeys.length,7);
 assert.equal(j.youtube_attributable_orders,null);
 assert.equal(k.verified_purchase_events,null);
});
test('Survey awareness and shopper categories cannot be promoted to measured YouTube conversions',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/shopping-funnel-evidence-2025.json'),load('specimens/youtube.json')]);
 const s=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.intent_reference_frames[0].verified_purchase_events=132;
 assert(auditShoppingIntentFrames(a,s).errors.includes('survey attitudinal claims converted to transactions'));
 const b=structuredClone(m);b.intent_reference_frames[1].category_proportions={impulse:30};
 assert(auditShoppingIntentFrames(b,s).errors.includes('invented shopper journey outcomes'));
 const c=structuredClone(m);c.intent_reference_frames[0].per_question_n=2160;
 assert(auditShoppingIntentFrames(c,s).errors.includes('misrepresented Kantar denominator or scope'));
});
