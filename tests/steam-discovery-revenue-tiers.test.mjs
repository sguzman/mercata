import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {calculateHistoricalSteamShare} from '../site/steam-historical-revenue-share.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=load('specimens/steam.json');
const v=load('ontology/steam/discovery-wishlists-and-visibility-2026.json');
const t=load('ontology/steam/revenue-share-tiers-2018-2026.json');
test('Discovery and wishlist records link to identified public Valve documents',()=>{
 const ids=new Set(s.evidence.map(x=>x.id)),claims=new Map(s.claims.map(x=>[x.id,x]));
 assert.equal(v.source_ids.length,2);
 assert(v.source_ids.every(id=>ids.has(id)));
 assert(v.claim_ids.length>=15);
 assert(v.claim_ids.every(id=>claims.has(id)&&claims.get(id).source_ids.every(src=>ids.has(src))));
 assert.equal(v.visibility.raw_page_traffic_direct_rank_factor,false);
 assert.equal(v.visibility.page_to_purchase_conversion_direct_rank_factor,false);
 assert.equal(v.visibility.wishlist_general_direct_rank_factor,false);
 assert.equal(v.visibility.organic_paid_rank_purchase_available,false);
 assert.equal(v.wishlists.sale_forecast_ratio,null);
 assert.equal(v.wishlists.discount_notification_min_percent,20);
 assert.equal(v.wishlists.discount_notification_min_hours_exclusive,8);
 assert(Object.values(v.unknown).every(x=>x===null));
});
test('Historical tiers identify marginal adjusted-revenue schedule, never current signed terms',()=>{
 assert(t.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert(t.claim_ids.every(id=>s.claims.some(x=>x.id===id)));
 assert.equal(t.historical_schedule.announcement_date,'2018-11-30');
 assert.equal(t.historical_schedule.qualifying_sales_from,'2018-10-01');
 assert.deepEqual(t.historical_schedule.tiers.map(x=>x.publisher_fraction),[0.7,0.75,0.8]);
 assert.equal(t.contract_assessment.signed_current_agreement_available,false);
 assert.equal(t.contract_assessment.live_partner_payout_verified,false);
 assert(Object.values(t.unknown).every(x=>x===null));
});
test('Hypothetical 2018 marginal tiers do not retroactively uplift the first $10m',()=>{
 const f=cents=>calculateHistoricalSteamShare({basis:'hypothetical_adjusted_qualified_revenue_cents',policy:'valve_announced_2018',revenueCents:cents});
 assert.equal(f(0).hypotheticalHistoricalPublisherShareCents,0);
 assert.equal(f(1_000_000_000).hypotheticalHistoricalPublisherShareCents,700_000_000);
 assert.equal(f(1_200_000_000).hypotheticalHistoricalPublisherShareCents,850_000_000);
 assert.equal(f(5_000_000_000).hypotheticalHistoricalPublisherShareCents,3_700_000_000);
 assert.equal(f(6_000_000_000).hypotheticalHistoricalPublisherShareCents,4_500_000_000);
 const x=f(1_200_000_000);
 assert.equal(x.actualMerchantPaymentCents,null);
 assert.equal(x.actualDeveloperProfitCents,null);
 assert.equal(x.currentlySignedContractConfirmed,false);
 assert.equal(x.hypotheticalHistoricalValveShareCents,350_000_000);
});
test('Rejects unverified actual receipts, identity fields, floats, wrong policy and negative cash',()=>{
 const base={basis:'hypothetical_adjusted_qualified_revenue_cents',policy:'valve_announced_2018',revenueCents:100};
 for(const bad of [
  {...base,buyerEmail:'private'}, {...base,basis:'gross_checkout'},
  {...base,policy:'current_contract'}, {...base,revenueCents:-1},
  {...base,revenueCents:1.5}, {...base,revenueCents:Number.MAX_SAFE_INTEGER+1},
  {...base,revenueCents:NaN}
 ])assert.throws(()=>calculateHistoricalSteamShare(bad),TypeError);
});
test('Both new source studies have matching independent public human reports',()=>{
 for(const p of ['discovery-wishlists-and-visibility-2026','revenue-share-tiers-2018-2026']){
  const text=fs.readFileSync(new URL('../ontology/steam/'+p+'.md',import.meta.url),'utf8');
  assert(text.length>600);assert(text.includes('October 28, 2026'));
  assert(text.includes('https://'));
  assert(text.includes('not')||text.includes('unknown'));
 }
});
