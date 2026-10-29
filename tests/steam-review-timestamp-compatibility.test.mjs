import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compareUnmatchedDatedReviewFrames as compare} from '../site/steam-review-coverage-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-december-2025-review-snapshot-versus-2026-current-cohort-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Two published 2025 game review frames have valid but incomparable ratios',()=>{
 const r=compare(...x.snapshots);
 assert.equal(r.earlier_roster_count,19112);assert.equal(r.later_roster_count,20591);
 assert.equal(r.roster_size_arithmetic_delta,1479);
 assert.equal(r.earlier_under_ten_fraction,9327/19112);
 assert.equal(r.later_under_ten_fraction,10217/20591);
 assert(r.difference_percentage_points>0&&r.difference_percentage_points<1);
 assert.equal(r.earlier_zero_review_fraction,2229/19112);
 assert.equal(r.observed_review_transitions,null);
 assert.equal(r.number_of_new_2025_game_launches_between_snapshots,null);
 assert.equal(r.actual_paid_game_orders,null);assert.equal(r.developer_profit,null);
});
test('A zero-review game is not a verified zero-sales game',()=>{
 const r=compare(...x.snapshots);
 assert.equal(r.first30day_review_distribution,null);
 assert.equal(r.same_appid_frame_verified,false);
 assert.equal(x.compatibility.matched_30_day_postlaunch_reviews,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Reject invalid dates, impossible review sums and reversed snapshots',()=>{
 const [a,b]=x.snapshots;
 assert.throws(()=>compare({...a,published_date:'2025-02-30'},b),/Invalid/);
 assert.throws(()=>compare({...a,zero_reviews:9330},b),/Impossible/);
 assert.throws(()=>compare({...a,under_ten_reviews:20000},b),/Impossible/);
 assert.throws(()=>compare(b,a),/order/);
 assert.throws(()=>compare(a,{...b,release_year:2024}),/Release year/);
});
test('New dated claims preserve original research tasks and links',()=>{
 const src=new Set(d.evidence.map(v=>v.id)),cl=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,8);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){assert(cl.has(id),id);assert(cl.get(id).source_ids.every(s=>src.has(s)),id);}
 const all=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(all.length,293);assert.equal(p.progress_percent,Math.round(all.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/competition/study-early-review-count-concentration').evidence.includes('ontology/steam/steam-december-2025-review-snapshot-versus-2026-current-cohort-2026.json'));
});
