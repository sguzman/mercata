import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessGameBonusOffer} from '../site/itch-game-bonus-entitlement.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Hypothetical bonus pricing distinguishes project ownership and changed file entitlement',()=>{
 const x=assessGameBonusOffer({projectMinimumCents:500,bonusMinimumCents:800,
   originalPaymentCents:800,updatedBonusMinimumCents:900,rewardQuantity:10,rewardClaims:3});
 assert.equal(x.projectOwned,true);
 assert.equal(x.originalBonusAccess,true);
 assert.equal(x.updatedBonusAccess,false);
 assert.equal(x.bonusAccessLostAfterRepricing,true);
 assert.equal(x.remainingRewardQuantity,7);
 assert.equal(x.creatorProfitCents,null);
 assert.equal(x.additionalRevenueCents,null);
 assert.equal(x.actualPaymentVerified,false);
});
test('Unpaid or unclaimed rewards are not completed paid orders',()=>{
 const x=assessGameBonusOffer({projectMinimumCents:500,bonusMinimumCents:800,
  originalPaymentCents:0,rewardQuantity:10,rewardClaims:0});
 assert.equal(x.projectOwned,false);assert.equal(x.originalBonusAccess,false);
 assert.equal(x.additionalOrders,null);
 assert.throws(()=>assessGameBonusOffer({projectMinimumCents:500,bonusMinimumCents:800,
  originalPaymentCents:500,rewardQuantity:10,rewardClaims:11}));
 assert.throws(()=>assessGameBonusOffer({projectMinimumCents:500,bonusMinimumCents:300,
  originalPaymentCents:500,rewardQuantity:10,rewardClaims:5}));
});
test('Documented seller obligations retain unknown net receipts',()=>{
 const d=get('ontology/itch-io/game-bonus-entitlements-2026.json'),s=get('specimens/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert(d.seller_risk.unfulfilled_reward_may_trigger_buyer_refund);
 assert(d.seller_risk.physical_merchandise_shipping_seller_responsibility);
 assert(d.offer_mechanisms.find(x=>x.id==='individual_supplement').raising_minimum_may_revoke_access);
 assert(Object.values(d.unmeasured).every(x=>x===null));
});

test('Commercial soundtrack release requires asset rights distinct from bonus access',()=>{
 const d=get('ontology/itch-io/game-bonus-entitlements-2026.json'),s=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 const r=d.extra_content_rights_and_economic_units;
 assert(r.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.equal(r.base_game_and_bonus_separate_license_inventory_required,true);
 assert.equal(r.third_party_CC_BY_4_commercial_distribution_permitted_with_attribution,true);
 assert.equal(r.third_party_CC_BY_NC_4_commercial_release_permitted_by_license_alone,false);
 assert.equal(r.actual_soundtrack_rights_audited,false);
 assert.equal(r.soundtrack_bonus_attach_rate,null);
 assert.equal(r.incremental_positive_price_orders,null);
 const task=p.detail_tasks.find(x=>x.id==='itch-io/special-games/study-soundtrack-and-extras');
 assert.equal(task.percent,100);assert.equal(task.status,'complete');
 for(const f of ['ontology/itch-io/game-bonus-entitlements-2026.json','ontology/itch-io/game-bonus-entitlements-2026.md','tests/itch-io-game-bonus.test.mjs','ontology/itch-io/game-component-rights-register-2026.json'])assert(task.evidence.includes(f));
});
