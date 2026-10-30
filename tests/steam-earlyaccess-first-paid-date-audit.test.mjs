import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/what-is-the-ghost-earlyaccess-first-paid-v1-distinction-2026.json'),
 dossier=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('A paid Early Access original and later full release are a single initial paid game',()=>{
 const row=study.official_listing;
 assert.equal(row.initial_paid_launch_count,1);
 assert.equal(row.paid_early_access_date,'2026-03-23');
 assert.equal(row.later_general_release_date,'2026-10-01');
 assert(row.paid_early_access_date<row.later_general_release_date);
});
test('Voluntary net after returns does not become bank cash or developer profit',()=>{
 assert.equal(study.public_author_post.author_net_usd_after_returns,1370);
 assert.equal(study.public_author_post.returns,14);
 assert(Object.values(study.missing_actuals).every(x=>x===null));
 assert.equal(study.official_listing.verified_sales,null);
});
test('Public source and claim links preserve 293 original task identities',()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>ids.has(x)));}
 const a=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(x=>x.tasks.map(y=>y.progress))];
 assert.equal(a.length,293);assert.equal(p.progress_percent,Math.round(a.reduce((n,x)=>n+x,0)/293));
});
