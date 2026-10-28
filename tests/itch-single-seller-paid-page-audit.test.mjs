import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditOneSellerPaidPageEvents} from '../site/itch-single-seller-paid-page-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const p='ontology/itch-io/same-seller-paid-asset-zero-versus-positive-payments-2026.json';

test('Source-backed first-person asset comparison keeps one seller and three distinct SKUs',()=>{
 const x=get(p),d=get('specimens/itch-io.json');
 assert.equal(x.independent_publishers,1);assert.equal(x.listed_products_in_comparison,3);
 assert.equal(x.product_category,'paid_game_development_asset_pack_not_video_game');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(x.claim_ids.every(id=>d.claims.some(c=>c.id===id)));
 assert.equal(x.snapshots.length,3);
 assert.equal(x.snapshots[0].pages[0].direct_project_payment_events,0);
 assert.equal(x.snapshots[1].pages[0].bundle_entitlements_reported,1);
 assert.equal(x.snapshots[1].pages[0].direct_project_payment_events,0);
 assert.equal(x.snapshots[2].reported_account_total_payment_events,13);
 assert(Object.values(x.rejected_inferences).every(v=>v===null));
});
test('Snapshot event rates are descriptive, with no inferred paid-game conversion or significance',()=>{
 const x=get(p);
 for(const [i,expected] of [[0,2.57],[2,2.2]]){
  const comparators=x.snapshots[i].pages.filter(z=>z.sku!=='icons_vol2');
  const a=auditOneSellerPaidPageEvents({productCategory:'game_development_assets',snapshot:{label:x.snapshots[i].label,window:x.snapshots[i].window,pages:comparators}});
  assert.equal(a.directPaymentEventsPer100PageViewEvents,expected);
  assert.equal(a.publicNarrativeDescribesOneSeller,true);
  assert.equal(a.independentlyVerifiedSellerCount,null);
  assert.equal(a.canAddAnotherSnapshotAsNewSales,false);
  assert.equal(a.reportedWindowScope,x.snapshots[i].window);
  assert.equal(a.independentlyVerifiedWindowAlignment,false);
  assert.equal(a.independentBuyerConversionRate,null);
  assert.equal(a.statisticalSignificance,null);
  assert.equal(a.representativeGameSellerMedianIncome,null);
 }
 const zero=auditOneSellerPaidPageEvents({productCategory:'game_development_assets',snapshot:{label:x.snapshots[1].label,window:x.snapshots[1].window,pages:x.snapshots[1].pages}});
 assert.equal(zero.items[0].bundleEntitlements,1);
 assert.equal(zero.items[0].directPaymentEvents,0);
 assert.equal(zero.directPaymentsReported,0);
 assert.equal(zero.items[0].uniquePayingBuyers,null);
});
test('Distinct snapshots are not combined and event audit rejects identifiers and bad aggregations',()=>{
 const good={productCategory:'game_development_assets',snapshot:{label:'synthetic',window:'reported_same_first_month',pages:[
  {sku:'test_1',page_view_events:4,direct_project_payment_events:0,bundle_entitlements_reported:0}
 ]}};
 for(const bad of [
  {...good,productCategory:'paid_videogames'},
  {...good,snapshot:{...good.snapshot,pages:[{...good.snapshot.pages[0],buyer_email:'hidden'}]}},
  {...good,snapshot:{...good.snapshot,pages:[{...good.snapshot.pages[0],page_view_events:1.2}]}},
  {...good,snapshot:{...good.snapshot,pages:[{...good.snapshot.pages[0],direct_project_payment_events:-1}]}},
  {...good,snapshot:{...good.snapshot,pages:[good.snapshot.pages[0],good.snapshot.pages[0]]}},
  {...good,snapshot:{...good.snapshot,pages:[]}},
  {...good,snapshot:[good.snapshot,good.snapshot]},
  {...good,snapshot:{...good.snapshot,window:'undocumented'}},
  {...good,buyer_email:'private'},
  {...good,snapshot:{...good.snapshot,ledger_csv:'private'}}
 ])assert.throws(()=>auditOneSellerPaidPageEvents(bad),TypeError);
 const empty=auditOneSellerPaidPageEvents({...good,snapshot:{...good.snapshot,pages:[{...good.snapshot.pages[0],page_view_events:0}]}});
 assert.equal(empty.directPaymentEventsPer100PageViewEvents,null);
 assert.equal(empty.items[0].directPaymentsPer100PageViewEvents,null);
});
test('The pre-existing 244 research tasks and marketwide income unknowns remain unchanged',()=>{
 const plan=get('plans/itch-io.json'),q=get('queues/itch-io.json'),x=get(p);
 assert.equal(plan.detail_tasks.length+q.queues.flatMap(k=>k.tasks).length,244);
 assert.equal(x.rejected_inferences.marketwide_zero_earner_fraction,null);
 assert.equal(x.rejected_inferences.mean_paid_game_seller_income,null);
});
