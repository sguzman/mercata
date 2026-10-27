import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Acquisition channel comparison covers search, social, newsletter and paid traffic without paid-customer claims',()=>{
 const a=read('ontology/itch-io/acquisition-channel-coverage-comparison-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));assert(a.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(a.channels.map(c=>c.id),['platform_search','external_search','social_and_forums','email_newsletters','press_and_influencers','paid_acquisition']);
 assert(a.channels.every(c=>c.revenue_effect===null&&c.source_ids.every(id=>ids.has(id))));
 assert.equal(a.funnel_safety.unattributed_not_assumed_direct,true);
 assert.equal(a.funnel_safety.newsletter_subscriptions_are_not_buyers,true);
 assert(Object.values(a.unobserved).every(x=>x===null));
 const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id==='discovery/external');
 assert.equal(t.progress,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/acquisition-channel-coverage-comparison-2026.json','ontology/itch-io/acquisition-channel-coverage-comparison-2026.md','tests/itch-acquisition-channel-coverage.test.mjs'])assert(t.evidence.includes(f));
 const all=q.queues.flatMap(x=>x.tasks).map(x=>x.progress).concat(p.detail_tasks.map(x=>x.percent));assert.equal(all.length,244);
 assert.equal(p.progress_percent,Math.round(all.reduce((a,b)=>a+b,0)/244));
});
