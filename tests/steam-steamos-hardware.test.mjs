import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=j('ontology/steam/steamos-deck-compatibility-qa-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('Unknown is not failed; hardware ratings do not gate release',()=>{
 assert.deepEqual(x.ratings,['Verified','Playable','Unsupported','Unknown']);
 assert.equal(x.unknown_implies_failed_review,false);
 assert.equal(x.badge_required_for_sale,false);
});
test('Deck and Machine benchmarks are distinct published thresholds, not observed game results',()=>{
 assert.equal(x.targets.deck.vertical_pixels,800);
 assert.equal(x.targets.machine.vertical_pixels,1080);
 assert.equal(x.targets.deck.min_default_fps,30);
 assert.equal(x.observed.games_benchmarked,0);
 assert.equal(x.observed.measured_fps,null);
 assert.equal(x.observed.actual_profit,null);
});
test('All source links and claims exist, without altering Steam inventory',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,13);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cc.has(id));assert(cc.get(id).source_ids.every(s=>ss.has(s)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
