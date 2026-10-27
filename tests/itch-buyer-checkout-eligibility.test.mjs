import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {evaluateItchBuyerCheckout} from '../site/itch-buyer-checkout-eligibility.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('No seller provider means direct buyer checkout is unavailable',()=>{
 const x=evaluateItchBuyerCheckout({mode:'direct_to_you',provider:'stripe',seller_connected_provider:false,buyer_region_supported:null,seller_content_permitted:null});
 assert.equal(x.status,'not_configured');assert.equal(x.known_successful_transactions,null);assert.equal(x.paid_game_revenue,null);
});
test('Unknown country/provider rules stay unknown even under operator-collected mode',()=>{
 const a=evaluateItchBuyerCheckout({mode:'collected_by_itch',provider:'paypal',buyer_region_supported:null,seller_content_permitted:true});
 assert.equal(a.status,'unknown');assert.equal(a.known_successful_transactions,null);assert.equal(a.verified_buyers,null);
 const b=evaluateItchBuyerCheckout({mode:'direct_to_you',provider:'paypal',seller_connected_provider:null,buyer_region_supported:true,seller_content_permitted:true});
 assert.equal(b.status,'unknown');assert.equal(b.known_successful_transactions,null);
});
test('Known refused eligibility blocks and asserted support is not a confirmed sale',()=>{
 for(const mode of ['direct_to_you','collected_by_itch']){
  const b=evaluateItchBuyerCheckout({mode,provider:'stripe',seller_connected_provider:true,buyer_region_supported:false,seller_content_permitted:true});
  assert.equal(b.status,'blocked_by_known_rule');assert.equal(b.known_successful_transactions,null);
  const c=evaluateItchBuyerCheckout({mode,provider:'stripe',seller_connected_provider:true,buyer_region_supported:true,seller_content_permitted:true});
  assert.equal(c.status,'conditionally_configured');assert.equal(c.known_successful_transactions,null);assert.equal(c.verified_buyers,null);
 }
});
test('Reject malformed merchant or evidence gates',()=>{
 assert.throws(()=>evaluateItchBuyerCheckout({mode:'fictional',provider:'paypal'}));
 assert.throws(()=>evaluateItchBuyerCheckout({mode:'direct_to_you',provider:'stripe',seller_connected_provider:'maybe',buyer_region_supported:null,seller_content_permitted:null}));
});
test('Machine country rows do not invent buyers or confirmed geographical acceptance',()=>{
 const x=get('ontology/itch-io/buyer-checkout-route-eligibility-2026.json');
 const d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(y=>y.id===id)));
 assert(x.unverified_country_examples.every(y=>Object.keys(y).filter(k=>k.startsWith('checkout_via')||k==='verified_paid_buyers').every(k=>y[k]===null)));
 assert.equal(x.actual_checkout_attempts_tested,0);assert.equal(x.platform_unique_paying_buyers,null);
});
