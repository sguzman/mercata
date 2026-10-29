import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamSeasonalReviewProxy as audit} from '../site/steam-seasonal-observation-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-seasonal-release-count-and-review-milestone-confounding-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Cross-year release volumes and 50-review threshold spreads reproduce public summary',()=>{
 const a=audit(x.reported_monthly_data);
 assert.equal(a.total_crossyear_releases,108969);
 assert.equal(a.most_releases_month,'Oct');assert.equal(a.most_releases,10685);
 assert.equal(a.fewest_releases_month,'Jan');assert.equal(a.fewest_releases,7318);
 assert.equal(a.peak_to_quiet_volume_ratio,10685/7318);
 assert.equal(a.highest_review_threshold_month,'Apr');
 assert.equal(a.lowest_review_threshold_month,'Dec');
 assert.equal(a.threshold_rate_spread_percentage_points,4.5);
});
test('Visible review attainment is neither an early horizon, a randomized effect nor earnings',()=>{
 const a=audit(x.reported_monthly_data);
 assert.equal(a.exact_50review_game_counts,null);
 assert.equal(a.first_30day_review_rate,null);
 assert.equal(a.observed_paid_game_orders,null);
 assert.equal(a.causal_effect_of_launch_month,null);
 assert.equal(a.publisher_profit,null);
 assert.equal(x.data_quality.matched_first_30_day_horizon,false);
 assert.equal(x.data_quality.season_assignments_randomized,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Only twelve unique months with valid counts and shares are accepted',()=>{
 const rows=x.reported_monthly_data;
 assert.throws(()=>audit(rows.slice(1)),/twelve/);
 assert.throws(()=>audit([...rows.slice(0,11),rows[0]]),/duplicate/);
 assert.throws(()=>audit(rows.map((v,i)=>i===0?{...v,releases:-1}:v)),/Invalid release/);
 assert.throws(()=>audit(rows.map((v,i)=>i===0?{...v,review_50plus_percent:101}:v)),/Invalid rounded/);
});
test('Ten bounded claims have valid public sources and fixed 293-task progress',()=>{
 const s=new Set(d.evidence.map(v=>v.id)),c=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(a=>s.has(a)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/market/study-seasonal-launch-and-demand-patterns').evidence.includes('ontology/steam/steam-seasonal-release-count-and-review-milestone-confounding-2026.json'));
});
