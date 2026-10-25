import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {subscriptionStatusSplit,auditSubscribedStatusProtocol} from '../site/subscriber-status-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
const period={period_start:'2026-09-01',period_end:'2026-09-30',creatorContentType:'VIDEO_ON_DEMAND',region:'US'};
const synthetic=[{...period,subscribedStatus:'SUBSCRIBED',views:30,engagedViews:22,estimatedMinutesWatched:210},{...period,subscribedStatus:'UNSUBSCRIBED',views:70,engagedViews:55,estimatedMinutesWatched:310}];
test('Subscriber status is per activity event; arithmetic only for matching authorized report rows',()=>{
 const r=subscriptionStatusSplit(synthetic,{expectedTotal:100});
 assert.deepEqual(r,{valid:true,metric:'views',subscribed:30,unsubscribed:70,total:100,subscribed_share_percent:30,unsubscribed_share_percent:70,unique_people_estimate:null,creator_earnings:null});
 assert.equal(subscriptionStatusSplit(synthetic,{metric:'estimatedMinutesWatched'}).total,520);
 assert.equal(subscriptionStatusSplit(synthetic,{expectedTotal:101}).valid,false);
});
test('Subscriber status rejects mismatched formats, missing categories, and nonnumeric report values',()=>{
 const x=structuredClone(synthetic);x[1].creatorContentType='SHORTS';assert(!subscriptionStatusSplit(x).valid);
 assert(!subscriptionStatusSplit(synthetic.slice(0,1)).valid);
 const y=structuredClone(synthetic);y[1].views=NaN;assert(!subscriptionStatusSplit(y).valid);
 const z=structuredClone(synthetic);z[1].subscribedStatus='SUBSCRIBED';assert(!subscriptionStatusSplit(z).valid);
});
test('Real record is unmeasured, owner-restricted, and source-backed',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/subscriber-status-reach-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditSubscribedStatusProtocol(data,new Set(dossier.evidence.map(s=>s.id))),{valid:true,errors:[]});
 assert.equal(data.eligible_report.authorized_rows.length,0);
 assert(Object.values(data.unmeasured).every(x=>x===null));
});
