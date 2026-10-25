import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyPremiumField,calculateFuturePremiumHypothetical} from '../site/premium-allocation-boundaries.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Premium source frames separate October 2026 eligibility from the announced February 2027 pools',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/premium-allocation-boundaries.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.deepEqual(m.announced_2027.pools.map(x=>x.share_of_net_subscriptions),[0.30,0.60]);
 assert.deepEqual(m.announced_2027.creator_format_rates.map(x=>x.share_of_creator_allocated_pool),[0.55,0.45]);
 assert.equal(m.announced_2027.shorts_gate_qualified_views,10000000);
 assert.equal(classifyPremiumField(m,'estimatedRedPartnerRevenue').known,true);
 assert.equal(classifyPremiumField(m,'paidChannelMembers').known,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Future creator allocation requires explicit fractions and never creates observed income',async()=>{
 const m=await load('ontology/youtube/premium-allocation-boundaries.json');
 const x={month:'2027-02',currency:'USD',subscription_type:'premium',format:'long_form',
 net_subscription_revenue:1000,creator_allocated_fraction:0.02,module_accepted:true,content_eligible:true};
 const a=calculateFuturePremiumHypothetical(m,x);
 assert(Math.abs(a.pool_revenue-300)<1e-9);
 assert(Math.abs(a.creator_allocated_pool-6)<1e-9);
 assert(Math.abs(a.conditional_contractual_amount-3.3)<1e-9);
 assert.equal(a.actual_creator_revenue,null);assert.equal(a.bank_receipt,null);
 assert.throws(()=>calculateFuturePremiumHypothetical(m,{...x,month:'2026-10'}),/not yet effective/);
 assert.throws(()=>calculateFuturePremiumHypothetical(m,{...x,creator_allocated_fraction:null}),/allocation fraction/);
 assert.throws(()=>calculateFuturePremiumHypothetical(m,{...x,subscription_type:'other'}),/Unsupported/);
 const b=calculateFuturePremiumHypothetical(m,{...x,subscription_type:'premium_lite',format:'shorts',rolling_shorts_gate_met:true});
 assert(Math.abs(b.conditional_contractual_amount-5.4)<1e-9);
 assert.throws(()=>calculateFuturePremiumHypothetical(m,{...x,format:'shorts'}),/Shorts qualification/);
});
