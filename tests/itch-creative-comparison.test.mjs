import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditItchCreativeComparison} from '../site/itch-creative-comparison.mjs';
const contract=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/creative-comparison-audit-2026.json',import.meta.url),'utf8'));
const row={impressions:200,attributed_click_events:8,start:'2026-10-19',end:'2026-10-25',surface:'browse_listing',population:'desktop_observed'};
const design={changed_feature:'cover_image',did_recreate_listing:false,truthful_assets_confirmed:true,current_metrics_verified:true,concurrent_distribution_shifts:false,allocation:'sequential',concurrent_variants:false};
test('only descriptive matched CTR; no fabricated paid customers',()=>{
 const x=auditItchCreativeComparison({a:row,b:{...row,attributed_click_events:12},design});
 assert.equal(x.comparable_descriptive,true);assert.equal(x.causal_attribution_eligible,false);
 assert.equal(x.click_through.b_minus_a,0.02);
 assert.equal(x.paid_orders,null);assert.equal(x.net_profit,null);
 assert.equal(x.unique_paying_buyers,null);assert.equal(x.seller_population_income_effect,null);
});
test('randomization eligibility is not an actual measured causal effect',()=>{
 const x=auditItchCreativeComparison({a:row,b:{...row,attributed_click_events:12},design:{...design,allocation:'randomized_user_level',concurrent_variants:true}});
 assert.equal(x.causal_attribution_eligible,true);
 assert.equal(x.net_profit,null);
});
test('rejects mismatched frames, fake click arithmetic and broken source windows',()=>{
 for(const b of [{...row,start:'2026-10-18'},{...row,surface:'search'},{...row,population:'mobile'},{...row,impressions:3,attributed_click_events:12},{...row,impressions:2.1}]){
  const x=auditItchCreativeComparison({a:row,b,design});assert.equal(x.comparable_descriptive,false);assert.equal(x.click_through.b_minus_a,null);
 }
 const x=auditItchCreativeComparison({a:row,b:row,design:{...design,current_metrics_verified:false}});
 assert.equal(x.comparable_descriptive,false);
});
test('disallows duplicate-page ranking tricks and unverifiable artwork',()=>{
 for(const change of [{did_recreate_listing:true},{truthful_assets_confirmed:false},{changed_feature:'title_and_price'},{concurrent_distribution_shifts:true}]){
  const x=auditItchCreativeComparison({a:row,b:row,design:{...design,...change}});
  assert.equal(x.comparable_descriptive,false);
 }
});
test('zero impressions means unknown CTR, never zero assumed',()=>{
 const a={...row,impressions:0,attributed_click_events:0},out=auditItchCreativeComparison({a,b:row,design});
 assert.equal(out.click_through.a,null);assert.equal(out.click_through.b_minus_a,null);
});
test('published research uses already-registered primary official sources',()=>{
 const x=JSON.parse(fs.readFileSync(new URL('../specimens/itch-io.json',import.meta.url),'utf8'));
 assert(contract.source_ids.every(id=>x.evidence.some(y=>y.id===id)));
 assert.equal(contract.authorized_live_experiment,false);
 assert.equal(contract.population_representative_publisher_income,null);
});
