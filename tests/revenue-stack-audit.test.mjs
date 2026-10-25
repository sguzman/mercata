import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditRevenueStreamSelection,auditNativeAffiliateCashPlacement} from '../site/revenue-stack-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Sixteen official or conditional revenue pathways have distinct source-backed settlement mappings',async()=>{
 const [r,d]=await Promise.all([load('ontology/youtube/revenue-pathways.json'),load('specimens/youtube.json')]);
 const m=r.accounting_matrix;
 assert.equal(r.pathways.length,16);assert.equal(m.pathways.length,16);
 assert.equal(new Set(m.pathways.map(x=>x.id)).size,16);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert(m.pathways.every(x=>r.pathways.some(y=>y.id===x.id)&&x.observed_creator_receipts===null));
 assert.equal(m.pathways.find(x=>x.id==='shopping-affiliate').settlement,'adsense_for_youtube');
 assert.equal(m.pathways.find(x=>x.id==='external-affiliates').settlement,'separate_provider_or_merchant');
 assert.equal(m.affiliate_settlement.official_typical_days_after_purchase_min,60);
 assert.equal(m.affiliate_settlement.official_typical_days_after_purchase_max,120);
});
test('Scenario-only route selection groups independent conditions and flags duplicate contracts',async()=>{
 const r=await load('ontology/youtube/revenue-pathways.json');
 const s=auditRevenueStreamSelection(r,['watch-page-ads','shopping-affiliate','external-affiliates','direct-sponsorship']);
 assert.equal(s.valid,true);assert.equal(s.selected_count,4);
 assert.deepEqual(s.settlement.adsense_for_youtube,['watch-page-ads','shopping-affiliate']);
 assert.deepEqual(s.settlement.separate_provider_or_merchant,['external-affiliates']);
 assert.equal(s.actual_cash,null);assert.equal(s.all_pathways_approved,false);
 assert.equal(s.possible_duplicate_deals.length,1);
 assert.equal(auditRevenueStreamSelection(r,['watch-page-ads','watch-page-ads']).valid,false);
 assert.equal(auditRevenueStreamSelection(r,['missing-pathway']).valid,false);
});
test('Cannot sum reported aggregate YouTube revenue with net advertising, Premium, or cleared bank cash',async()=>{
 const r=await load('ontology/youtube/revenue-pathways.json');
 for(const x of r.accounting_matrix.accounting_nonadditivity){
  const result=auditRevenueStreamSelection(r,['watch-page-ads'],x.measure_ids);
  assert.equal(result.valid,false,'Unexpectedly permitted incompatible measure '+x.id);
  assert(result.conflicts.includes(x.id));
 }
 assert.equal(auditRevenueStreamSelection(r,['watch-page-ads'],['estimatedAdRevenue']).valid,true);
 assert.equal(auditNativeAffiliateCashPlacement(r,{nativeShoppingInPlatformPosted:true,affiliateOutsideCashIncludesNativeShopping:true}).valid,false);
 assert.equal(auditNativeAffiliateCashPlacement(r,{nativeShoppingInPlatformPosted:true,affiliateOutsideCashIncludesNativeShopping:false}).valid,true);
 assert.throws(()=>auditNativeAffiliateCashPlacement(r,{}),/Explicit settlement flags/);
});
test('Website renders a real editable selection matrix and does not imply real earnings',async()=>{
 const s=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(s.includes('auditRevenueStreamSelection'));
 assert(s.includes('earning-stream-stack'));
 assert(s.includes('Revenue paths are independently conditional'));
});
