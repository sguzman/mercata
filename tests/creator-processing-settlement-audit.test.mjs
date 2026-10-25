import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inspectCreatorSettlement,validateAffiliatePendingDays,inferActualCreatorNetFromMerchantReport} from '../site/creator-processing-settlement-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official processing and payment source links are registered and product-specific',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-processing-settlement-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(x=>d.evidence.some(e=>e.id===x)));
 assert.deepEqual(m.channels.map(x=>x.id),['membership','supers','shopify_affiliate_merchant']);
 assert.equal(m.channels[0].creator_share_of_eligible_net,0.7);
 assert.equal(m.channels[1].creator_share_of_eligible_net,0.7);
 assert.equal(m.channels[2].creator_share_of_eligible_net,null);
 assert.equal(m.channels[0].credit_card_processor_cost_payer,'youtube');
 assert.equal(m.channels[1].credit_card_processor_cost_payer,'youtube');
 assert(Object.values(m.unknown).every(x=>x===null));
});
test('Native fan funding must not pay a fictional extra credit card processing rate',async()=>{
 const m=await load('ontology/youtube/creator-processing-settlement-2026.json');
 for(const channel of ['membership','supers']){
  assert.equal(inspectCreatorSettlement(m,{channel,stage:'eligible_net',applyCommerceSeventyPercent:true}).valid,true);
  assert.equal(inspectCreatorSettlement(m,{channel,stage:'eligible_net',deductSecondCardProcessorFee:true}).valid,false);
 }
 assert.equal(inspectCreatorSettlement(m,{channel:'shopify_affiliate_merchant',stage:'eligible_net',applyCommerceSeventyPercent:true}).valid,false);
 assert.equal(inspectCreatorSettlement(m,{channel:'unregistered',stage:'eligible_net'}).valid,false);
});
test('Shopify pending commissions may reverse and cannot be counted as creator bank cash',async()=>{
 const m=await load('ontology/youtube/creator-processing-settlement-2026.json');
 assert.equal(m.affiliate_shopify.default_attribution_days,30);
 assert.equal(m.affiliate_shopify.last_qualifying_creator_click_receives_attribution,true);
 assert.equal(validateAffiliatePendingDays(m,29),false);
 assert.equal(validateAffiliatePendingDays(m,30),true);
 assert.equal(validateAffiliatePendingDays(m,50),true);
 assert.equal(validateAffiliatePendingDays(m,51),false);
 const pending=inspectCreatorSettlement(m,{channel:'shopify_affiliate_merchant',stage:'transaction_pending'});
 assert.equal(pending.valid,true);
 assert.equal(pending.is_creator_bank_receipt,false);
 assert.equal(pending.can_reverse,true);
 assert.equal(pending.creator_cash_received,null);
 const locked=inspectCreatorSettlement(m,{channel:'shopify_affiliate_merchant',stage:'transaction_locked'});
 assert.equal(locked.is_creator_bank_receipt,false);
 assert.equal(inferActualCreatorNetFromMerchantReport(m,'net_sales').allowed,false);
});
test('Dossier displays four processing boundaries and no public creator margin estimate',async()=>{
 const src=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(src.includes('renderCreatorProcessingSettlement'));
 assert(src.includes('creator-processing-settlement-2026.json'));
 assert(src.includes('not verified creator bank cash'));
});
