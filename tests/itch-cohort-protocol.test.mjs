import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analyzeSellerCohort,describePurchaseEvents} from '../site/itch-cohort-protocol.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const synthetic={owner_authorized:true,aggregated_only:true,research_redistribution_allowed:true,
 followup_days:90,publisher_definition:'first_commercial_game_seller',
 proceeds_unit:'settled_net_seller_proceeds_cents',
 eligible_publishers:4,covered_publishers:4,zero_proceeds_publishers:2,
 settled_net_proceeds_cents:28000,includes_zero_sale_publishers:true,includes_delisted_publishers:true};
test('Aggregate cohort does not invent platform median and never mistakes excluded zero earners',()=>{
 const full=analyzeSellerCohort(synthetic);
 assert.equal(full.sample_zero_proceeds_fraction,0.5);
 assert.equal(full.sample_mean_seller_net_proceeds_cents,7000);
 assert.equal(full.platform_zero_earner_fraction,null);
 assert.equal(full.platform_median_seller_net_proceeds_cents,null);
 assert.equal(full.developer_profit_cents,null);
 const partial=analyzeSellerCohort({...synthetic,covered_publishers:3,zero_proceeds_publishers:1});
 assert.equal(partial.sample_coverage_complete,false);
 assert.equal(partial.sample_zero_proceeds_fraction,null);
 assert.equal(partial.sample_mean_seller_net_proceeds_cents,null);
 for(const bad of [{owner_authorized:false},{aggregated_only:false},{research_redistribution_allowed:false},
 {followup_days:31},{eligible_publishers:0},{zero_proceeds_publishers:10},
 {includes_zero_sale_publishers:false,covered_publishers:4}]) {
  const attempt={...synthetic,...bad};
  if(bad.includes_zero_sale_publishers===false)
   assert.equal(analyzeSellerCohort(attempt).sample_zero_proceeds_fraction,null);
  else assert.throws(()=>analyzeSellerCohort(attempt));
 }
});
test('Purchase-event ratio is not individual buyer conversion',()=>{
 const sample={owner_authorized:true,aggregated_only:true,same_game_and_period:true,
  page_views:100,browser_plays:75,free_demo_downloads:50,settled_paid_orders:4,refunded_orders:1};
 const r=describePurchaseEvents(sample);
 assert.equal(r.order_events_per_page_view,0.04);
 assert.equal(r.buyer_conversion_probability,null);
 assert.equal(r.unique_paying_buyers,null);
 assert.equal(r.causal_discovery_effect,null);
 assert.equal(describePurchaseEvents({...sample,page_views:0}).order_events_per_page_view,null);
 assert.throws(()=>describePurchaseEvents({...sample,refunded_orders:10}));
 assert.throws(()=>describePurchaseEvents({...sample,same_game_and_period:false}));
});
test('Live itch.io research has no authorized seller cohort observations yet',()=>{
 const p=load('ontology/itch-io/transaction-cohort-protocol-2026.json');
 assert.equal(p.observed_authorized_seller_cohorts,0);
 assert.equal(p.observed_median_net_seller_proceeds,null);
 assert.equal(p.observed_mean_net_seller_proceeds,null);
 assert.equal(p.observed_representative_seller_zero_rate,null);
 const d=load('specimens/itch-io.json');
 assert(p.source_ids.every(x=>d.evidence.some(s=>s.id===x)));
});
