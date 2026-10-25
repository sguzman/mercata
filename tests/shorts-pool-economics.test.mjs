import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {publishedMusicPoolFraction,hypotheticalShortsCreatorPool,hypotheticalFutureDirectShortsAd} from '../site/shorts-pool-economics.mjs';
const get=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Shorts source and current/future cohort scopes are independently registered',async()=>{
 const [m,s]=await Promise.all([get('ontology/youtube/shorts-pool-economics.json'),get('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.equal(m.current_2026.creator_share_of_allocated_pool,0.45);
 assert.equal(m.future_2027.direct_targeted_max_channels,5);
 assert.equal(m.future_2027.effective_from,'2027-02-01');
 assert(Object.values(m.unmeasured).every(v=>v===null));
 for(const [n,f] of [[0,1],[1,0.5],[2,1/3]]){
  assert.equal(publishedMusicPoolFraction(m,n).pool_fraction,f);
  assert.equal(publishedMusicPoolFraction(m,n).individual_creator_pay_fraction,null);
 }
 assert.equal(publishedMusicPoolFraction(m,3).published,false);
});
test('Only owner-supplied hypothetical country pool plus matching engaged views supports 45 percent',async()=>{
 const m=await get('ontology/youtube/shorts-pool-economics.json');
 const v={month:'2026-10',country:'MX',currency:'MXN',shorts_module_accepted_before_activity:true,
  content_eligible:true,period_is_authorized_country_eligible_engaged_views:true,
  country_creator_pool:1000,creator_eligible_engaged_views:100,total_eligible_engaged_views:1000};
 const out=hypotheticalShortsCreatorPool(m,v);
 assert(Math.abs(out.allocated_pool-100)<1e-9);
 assert(Math.abs(out.conditional_creator_share-45)<1e-9);
 assert.equal(out.actual_earnings,null);assert.equal(out.actual_bank_received,null);
 assert.throws(()=>hypotheticalShortsCreatorPool(m,{...v,period_is_authorized_country_eligible_engaged_views:false}),/Raw or cross-country/);
 assert.throws(()=>hypotheticalShortsCreatorPool(m,{...v,creator_eligible_engaged_views:1001}),/denominator/);
 assert.throws(()=>hypotheticalShortsCreatorPool(m,{...v,total_eligible_engaged_views:0}),/denominator/);
 assert.throws(()=>hypotheticalShortsCreatorPool(m,{...v,shorts_module_accepted_before_activity:false}),/Prospective/);
 assert.throws(()=>hypotheticalShortsCreatorPool(m,{...v,month:'2027-02'}),/Future monthly/);
});
test('Future direct sponsored Shorts placements cannot be added to pooled ad earnings twice',async()=>{
 const m=await get('ontology/youtube/shorts-pool-economics.json');
 const v={month:'2027-02',currency:'USD',shorts_module_accepted:true,qualified_rolling_shorts_gate_met:true,
 targeted_channel_count:5,eligible_net_targeted_ad_revenue:100};
 const out=hypotheticalFutureDirectShortsAd(m,v);
 assert(Math.abs(out.conditional_share-45)<1e-9);
 assert.equal(out.same_ad_also_in_pool,false);assert.equal(out.actual_creator_cash,null);
 assert.throws(()=>hypotheticalFutureDirectShortsAd(m,{...v,month:'2026-10'}),/not effective/);
 assert.throws(()=>hypotheticalFutureDirectShortsAd(m,{...v,targeted_channel_count:6}),/five or fewer/);
 assert.throws(()=>hypotheticalFutureDirectShortsAd(m,{...v,qualified_rolling_shorts_gate_met:false}),/rolling Shorts/);
});
