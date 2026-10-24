import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Timeline preserves policy precision and reused published sources',async()=>{
 const [d,s,a]=await Promise.all([load('ontology/youtube/policy-measurement-change-crosswalk.json'),load('specimens/youtube.json'),load('ontology/youtube/advertiser-policy-history.json')]);
 const ids=new Set(s.evidence.map(x=>x.id));
 assert.equal(d.events.length,4+a.revisions.length);
 assert(d.events.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(d.events.every(x=>x.precision==='day'?/^\d{4}-\d{2}-\d{2}$/.test(x.date):/^\d{4}-\d{2}$/.test(x.date)));
 assert(d.events.every((x,i)=>i===0||d.events[i-1].date<=x.date));
 assert(a.revisions.every(x=>d.events.some(e=>e.id===x.id&&e.date===x.announced_month)));
 assert.equal(d.real_ranking_weight_change_observed,false);
 assert.equal(d.actual_creator_policy_revenue_effect,null);
});
