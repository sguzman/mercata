import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateLiveCommerceNet,evaluateEarnedRubies,redeemedJewelsToRubies,checkLiveFanFundingConditions} from '../site/live-monetization-denominators.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Commerce, gifts and new horizontal source are registered and separately modeled',async()=>{
 const [m,d,paths,elig]=await Promise.all([load('ontology/youtube/live-monetization-units-2026.json'),load('specimens/youtube.json'),
  load('ontology/youtube/revenue-pathways.json'),load('ontology/youtube/eligibility-matrix.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(m.gifts.usd_per_ruby,0.01);
 assert.equal(m.gifts.jewels_redeemed_per_ruby,2);
 assert.deepEqual(m.commerce_products.map(x=>x.creator_share),[0.7,0.7]);
 assert(paths.pathways.find(x=>x.id==='live-gifts').source_ids.includes('yt-live-gifts-horizontal-vertical-2026'));
 assert(elig.records.find(x=>x.pathway_id==='live-gifts').source_ids.includes('yt-live-gifts-horizontal-vertical-2026'));
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Seventy percent applies only to eligible Commerce net, not gross or Ruby revenue',async()=>{
 const m=await load('ontology/youtube/live-monetization-units-2026.json');
 const result=evaluateLiveCommerceNet(m,{kind:'eligible_net_commerce',product:'super_chat_and_stickers',currency:'USD',amount:10});
 assert.equal(result.illustrative_creator_share,7);assert.equal(result.actual_creator_cash_received,null);
 assert.equal(evaluateLiveCommerceNet(m,{kind:'eligible_net_commerce',product:'channel_memberships',currency:'MXN',amount:100}).illustrative_creator_share,70);
 assert.throws(()=>evaluateLiveCommerceNet(m,{kind:'gross_viewer_spend',product:'super_chat_and_stickers',currency:'USD',amount:10}),/explicit/);
 assert.throws(()=>evaluateLiveCommerceNet(m,{kind:'eligible_net_commerce',product:'live_gifts',currency:'USD',amount:10}),/Unknown/);
 assert.throws(()=>evaluateLiveCommerceNet(m,{kind:'eligible_net_commerce',product:'super_chat_and_stickers',currency:'USD',amount:10.001}),/two-decimal/);
});
test('Jewels redeemed for gifts are distinct from earned Rubies and cleared cash',async()=>{
 const m=await load('ontology/youtube/live-monetization-units-2026.json');
 assert.equal(redeemedJewelsToRubies(m,200).rubies,100);
 assert.equal(evaluateEarnedRubies(m,{rubies:100}).usd_revenue_value,1);
 assert.equal(evaluateEarnedRubies(m,{rubies:100}).actual_bank_cash_received,null);
 assert.throws(()=>redeemedJewelsToRubies(m,3),/even/);
 assert.throws(()=>evaluateEarnedRubies(m,{rubies:0.5}),/whole/);
});
test('Account, module, country and per-stream restrictions prevent assumed product approval',async()=>{
 const m=await load('ontology/youtube/live-monetization-units-2026.json');
 const input={yppApproved:true,moduleAccepted:true,countryEligible:true,surface:'eligible_horizontal_live'};
 assert.equal(checkLiveFanFundingConditions(m,'live_gifts',input).could_be_eligible,true);
 assert.equal(checkLiveFanFundingConditions(m,'live_gifts',{...input,surface:'eligible_vertical_live'}).could_be_eligible,true);
 assert.equal(checkLiveFanFundingConditions(m,'live_gifts',{...input,yppApproved:false}).could_be_eligible,false);
 assert.equal(checkLiveFanFundingConditions(m,'live_gifts',{...input,made_for_kids:true}).could_be_eligible,false);
 assert.equal(checkLiveFanFundingConditions(m,'super_chat_and_stickers',{...input,live_chat_disabled:true}).could_be_eligible,false);
 assert.equal(checkLiveFanFundingConditions(m,'super_chat_and_stickers',{...input,surface:'eligible_premiere_super_chat'}).could_be_eligible,true);
});
test('Website presents denominator warnings',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderLiveMonetizationUnits'));
 assert(app.includes('live-monetization-units-2026.json'));
 assert(app.includes('Rubies do not take a further 70% Commerce cut'));
});
