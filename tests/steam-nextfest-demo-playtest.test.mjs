import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/next-fest-demo-playtest-prelaunch-2026.json'),d=get('specimens/steam.json');
test('Next Fest and child-AppID policy does not conflate paid purchases',()=>{
 assert.equal(x.eligibility.allowed_fest_participations_per_title,1);
 assert.equal(x.eligibility.must_be_unreleased,true);
 assert.equal(x.eligibility.must_have_public_demo,true);
 assert.equal(x.eligibility.previous_playtest_disqualifies,false);
 assert.equal(x.eligibility.already_live_early_access_allowed,false);
 assert.equal(x.october_2026.submission_deadline,'2026-09-28');
 assert.equal(x.formats.playtest_paid_access_allowed,false);
 assert.equal(x.formats.playtest_base_refund_playtime_counts,false);
 assert(Object.values(x.design_only).every(v=>v===null||v===false));
});
test('New source references exist and plan remains 293 tasks',()=>{
 const ss=new Set(d.evidence.map(v=>v.id));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,16);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){const c=d.claims.find(z=>z.id===id);assert(c,id);assert(c.source_ids.every(s=>ss.has(s)));}
 const plan=get('plans/steam.json'),q=get('queues/steam.json');
 const scores=[...plan.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
