import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateItchBuyerCheckout} from '../site/itch-buyer-checkout-eligibility.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Two developer zero-sale disclosures are not matched buyer or merchant cohorts',()=>{
 const d=read('ontology/itch-io/short-launch-zero-sales-checkout-versus-discovery-2026.json'),s=read('specimens/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(d.cases.length,2);
 assert.equal(d.cases[0].reported_page_view_events,203);
 assert.equal(d.cases[0].reported_sale_events,0);
 assert.equal(d.cases[0].individual_game_payment_route.seller_connected,false);
 assert.equal(d.cases[0].bundle_payment_route.reported_available,true);
 assert.equal(d.cases[0].can_attribute_zero_sales_to_disinterest,false);
 assert.equal(d.cases[1].reported_browse_impressions_approx,700);
 assert.equal(d.cases[1].reported_click_through_fraction_upper_exclusive,0.01);
 assert.equal(d.cases[1].reported_sale_events,0);
 assert.equal(d.cases[1].exact_page_view_events,null);
 assert.equal(d.cases[1].actual_browser_plays,null);
 assert.equal(d.cases[1].verified_positive_price_checkout_route_configured,null);
 assert(Object.values(d.measurement_outcomes).every(value=>value===null));
 assert.equal(d.population.probability_sample,false);
});
test('A disabled checkout route is not an observed zero-transaction market outcome',()=>{
 const input={mode:'direct_to_you',provider:'stripe',seller_connected_provider:false,buyer_region_supported:null,seller_content_permitted:null};
 const d=evaluateItchBuyerCheckout(input);
 assert.equal(d.status,'not_configured');assert.equal(d.conditional_checkout_possible,false);
 assert.equal(d.known_successful_transactions,null);
 const cases=[
 {...input,mode:'collected_by_itch',provider:'paypal',buyer_region_supported:null,seller_content_permitted:true},
 {...input,seller_connected_provider:null,buyer_region_supported:true,seller_content_permitted:true},
 {...input,seller_connected_provider:true,buyer_region_supported:true,seller_content_permitted:false},
 {...input,seller_connected_provider:true,buyer_region_supported:true,seller_content_permitted:true},
 ];
 assert(cases.every(x=>evaluateItchBuyerCheckout(x).known_successful_transactions===null));
});
test('Fixed research tasks advance only for stage-boundary evidence, not representative paid buyers',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 const buyer=p.detail_tasks.find(x=>x.id==='itch-io/access/map-buyer-payment-access');
 const acq=q.queues.flatMap(x=>x.tasks).find(x=>x.id==='strategy/acquisition-test');
 assert.equal(buyer.percent,79);assert.equal(buyer.status,'in_progress');
 assert.equal(acq.progress,80);assert.equal(acq.status,'in_progress');
 for(const x of [buyer,acq])for(const path of ['ontology/itch-io/short-launch-zero-sales-checkout-versus-discovery-2026.json','ontology/itch-io/short-launch-zero-sales-checkout-versus-discovery-2026.md','tests/itch-short-launch-zero-sales-funnel-boundaries.test.mjs','site/itch-buyer-checkout-eligibility.mjs','tests/itch-buyer-checkout-eligibility.test.mjs'])assert(x.evidence.includes(path));
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
});
