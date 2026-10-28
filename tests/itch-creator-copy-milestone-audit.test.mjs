import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditPublicCopyMilestones} from '../site/itch-creator-copy-milestone-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const d=get('ontology/itch-io/copy-milestone-free-base-versus-paid-tier-2026.json');
test('New milestone claims and existing Dead Trust sources remain independently attributable',()=>{
 const s=get('specimens/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert(d.claim_ids.every(id=>s.claims.some(x=>x.id===id)));
 const newIds=d.source_ids.filter(x=>x.startsWith('error143-'));
 assert.equal(newIds.length,2);
 assert.equal(s.evidence.filter(x=>x.id==='dead-trust-2025-first-week-milestone').length,1);
 assert.equal(d.cases[0].existing_case_file,'ontology/itch-io/dead-trust-paid-release-milestones-2025-2026.json');
});
test('Dead Trust lower thresholds cannot yield exact incremental paid copies or merchant cash',()=>{
 const c=d.cases[0],a=auditPublicCopyMilestones({offerType:c.public_2026_offer_type,milestones:c.milestones});
 assert.deepEqual(a.milestones.map(x=>x.reportedMinimumCopies),[150,300]);
 assert.equal(a.observedCopyChangeBetweenMilestones,null);
 assert.equal(a.validToMultiplyCurrentPriceByReportedCopies,false);
 assert.equal(a.milestones[1].verifiedItchPaidOrders,null);
 assert.equal(c.verified_incremental_orders_between_posts,null);
});
test('100,000 reported copies cannot turn into $25 full-game purchases',()=>{
 const c=d.cases[1],a=auditPublicCopyMilestones({offerType:c.public_2026_offer_type,milestones:c.milestones});
 assert.equal(c.full_game_minimum_usd,25);
 assert.equal(a.milestones[0].reportedMinimumCopies,100000);
 assert.equal(a.milestones[0].verifiedFullGameUnlocks,null);
 assert.equal(a.milestones[0].merchantGrossUsd,null);
 assert.equal(d.invalid_derived_revenue_from_error143_100k_times_25_usd,2500000);
 assert.equal(d.invalid_derived_revenue_is_observed,false);
 assert.equal(a.zeroSaleSellerFraction,null);
});
test('Reject fabricated identifiers, inconsistent windows, future dates, noninteger copies and unknown price modes',()=>{
 const c=d.cases[0],input={offerType:c.public_2026_offer_type,milestones:c.milestones};
 for(const bad of [
 {...input,buyerEmail:'secret'}, {...input,offerType:'free_only'},
 {...input,milestones:[]},{...input,milestones:[{...c.milestones[0],email:'secret'}]},
 {...input,milestones:[{...c.milestones[0],reported_at:'2026-02-30'}]},
 {...input,milestones:[{...c.milestones[0],reported_minimum_copies:1.5}]},
 {...input,milestones:[c.milestones[1],c.milestones[0]]}
 ])assert.throws(()=>auditPublicCopyMilestones(bad),TypeError);
});
test('The fixed 244-task population and all marketwide unknowns are preserved',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.detail_tasks.length+q.queues.flatMap(x=>x.tasks).length,244);
 assert(Object.values(d.no_market_estimates).every(x=>x===null));
});
