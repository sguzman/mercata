import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundReleaseTagOverlap as bound} from '../site/steam-tag-overlap-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-2025-overlapping-release-tags-and-genre-denominators-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Three nonexclusive tagged release sets force mathematically necessary duplicated memberships',()=>{
 const r=bound({allReleasedGames:21222,tagCounts:[{tag:'Action',games:7859},{tag:'Adventure',games:8338},{tag:'Indie',games:10731}]});
 assert.equal(r.sum_nonexclusive_tag_memberships,26928);
 assert.equal(r.forced_redundant_memberships_lower_bound,5706);
 assert.equal(r.forced_distinct_games_with_two_or_more_tags_lower_bound,2853);
 assert.equal(r.exact_distinct_multitag_games,null);
 assert.equal(r.paid_only_release_frame_verified,false);
 assert.equal(r.developer_profit_by_tag,null);
});
test('Sparse labels do not force overlap though unobserved overlaps may still exist',()=>{
 const a=bound({allReleasedGames:100,tagCounts:[{tag:'Action',games:20},{tag:'Indie',games:30}]});
 assert.equal(a.forced_redundant_memberships_lower_bound,0);
 assert.equal(a.forced_distinct_games_with_two_or_more_tags_lower_bound,0);
 assert.equal(a.exact_pairwise_tag_overlaps,null);
});
test('Unexpected frames, duplicate tag names or negative counts fail closed',()=>{
 const tags=[{tag:'Action',games:8},{tag:'Indie',games:9}];
 assert.throws(()=>bound({allReleasedGames:0,tagCounts:tags}),/Positive total/);
 assert.throws(()=>bound({allReleasedGames:5,tagCounts:tags}),/fit frame/);
 assert.throws(()=>bound({allReleasedGames:10,tagCounts:[tags[0],tags[0]]}),/Unique tag/);
 assert.throws(()=>bound({allReleasedGames:10,tagCounts:[tags[0],{tag:'Indie',games:-1}]}),/fit frame/);
 assert.throws(()=>bound({allReleasedGames:10,tagCounts:[tags[0]]}),/Two through/);
});
test('Source joins, null profitability and fixed 293-task research scope',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),cl=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){assert(cl.has(id),id);assert(cl.get(id).source_ids.every(s=>src.has(s)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const vals=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(vals.length,293);assert.equal(p.progress_percent,Math.round(vals.reduce((a,b)=>a+b,0)/293));
});
