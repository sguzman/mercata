import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {describeProceedsHistogram} from '../site/itch-income-histogram.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const example={owner_authorized:true,aggregated_only:true,research_redistribution_allowed:true,
 publisher_definition:'first_positive_price_game_publisher',cohort_days:90,
 currency_unit:'settled_net_proceeds_cents',eligible_publishers:10,covered_publishers:10,
 includes_zero_sale_publishers:true,includes_delisted_publishers:true,
 bins:[{lower_cents:0,upper_exclusive_cents:1,count:5},
       {lower_cents:1,upper_exclusive_cents:10001,count:5}]};
test('Synthetic income histogram never assigns market-level outcomes',()=>{
 const x=describeProceedsHistogram(example);
 assert.equal(x.sample_frame_complete,true);
 assert.equal(x.sample_exact_zero_proceeds_fraction,0.5);
 assert.equal(x.sample_median_lower_bound_cents,0);
 assert.equal(x.sample_median_upper_exclusive_cents,10001);
 assert.equal(x.platform_median_net_proceeds_cents,null);
 assert.equal(x.sample_mean_net_proceeds_cents,null);
 assert.equal(x.representative_inference,false);
 assert.equal(x.identified_people,0);
});
test('Histogram rejects unauthorized, sparse, malformed or personally identifying inputs',()=>{
 for(const change of [
  {owner_authorized:false},{research_redistribution_allowed:false},
  {covered_publishers:9},{cohort_days:31},{email:'nope'},
  {bins:[{lower_cents:0,upper_exclusive_cents:1,count:4},{lower_cents:1,upper_exclusive_cents:100,count:6}]},
  {bins:[{lower_cents:0,upper_exclusive_cents:1,count:5},{lower_cents:2,upper_exclusive_cents:100,count:5}]}
 ])assert.throws(()=>describeProceedsHistogram({...example,...change}));
 const partial=describeProceedsHistogram({...example,includes_delisted_publishers:false});
 assert.equal(partial.sample_frame_complete,false);
 assert.equal(partial.sample_exact_zero_proceeds_fraction,null);
 assert.equal(partial.sample_median_lower_bound_cents,null);
});
test('Actual seller research remains missing',()=>{
 const x=get('ontology/itch-io/income-histogram-protocol-2026.json');
 assert.equal(x.real_observations.authorized_real_cohorts,0);
 assert(Object.values(x.real_observations).slice(1).every(x=>x===null));
 assert.equal(x.privacy.public_small_positive_cells_permitted,false);
});
