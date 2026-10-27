import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Four disclosed annual tabletop serials share one publisher and keep unequally aged lifetime counts',()=>{
 const a=read('ontology/itch-io/four-serial-tabletop-release-sales-2021-2024.json'),s=read('specimens/itch-io.json');
 assert(a.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.equal(s.evidence.find(x=>x.id===a.source_ids[0]).published_at,'2025-01-06');
 assert.equal(a.sample.creators,1);assert.equal(a.sample.publisher_first_time_video_game_cohort,false);
 assert.deepEqual(a.releases.map(x=>x.live_copies),[260,171,155,239]);
 assert.deepEqual(a.releases.map(x=>x.first_day_copies),[181,113,97,33]);
 assert.deepEqual(a.releases.slice(0,3).map(x=>x.extra_copies_after_live_period),[48,3,8]);
 for(const x of a.releases.slice(0,3))assert.equal(x.lifetime_copies_as_of_2025_01_06-x.live_copies,x.extra_copies_after_live_period);
 assert.equal(a.releases[3].lifetime_copies_as_of_2025_01_06,null);
 assert.equal(a.reporting_limits.later_sale_windows_equal,false);
 assert(Object.values(a.unknown).every(v=>v===null));
});
test('Creator Day is nested inside the soft launch; coupon three is not conversion',()=>{
 const a=read('ontology/itch-io/four-serial-tabletop-release-sales-2021-2024.json');
 assert.equal(a.intervals_2024.find(x=>x.date==='2024-11-29').overlaps_other_rows,true);
 const disjoint=a.intervals_2024.filter(x=>!x.overlaps_other_rows);
 assert.equal(disjoint.reduce((n,x)=>n+x.paid_copies,0),204);
 assert.equal(Number(disjoint.reduce((n,x)=>n+x.gross_gbp,0).toFixed(2)),960.5);
 assert.equal(a.reporting_limits.nov29_creator_day_is_separate_sale_population,false);
 assert.equal(a.reporting_limits.complete_2024_daily_order_timeline,false);
 assert.equal(a.backer_coupon.code_purchases_reported,3);
 assert.equal(a.backer_coupon.purchase_conversion,null);
 assert.equal(a.backer_coupon.verified_unique_repeat_buyers,null);
});
test('Existing unfinished volatility, long-tail and repeat sale tasks receive the bounded record',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 for(const [id,pct] of [['itch-io/risk/study-sales-volatility',92],['itch-io/sales/measure-long-tail-income',96],['itch-io/sales/investigate-followers-and-repeat-sales',77]]){
  const t=p.detail_tasks.find(x=>x.id===id);assert(t&&t.percent>=pct&&t.percent<100&&t.status==='in_progress');
  for(const x of ['ontology/itch-io/four-serial-tabletop-release-sales-2021-2024.json','ontology/itch-io/four-serial-tabletop-release-sales-2021-2024.md','tests/itch-four-serial-tabletop-release-sales.test.mjs'])assert(t.evidence.includes(x));
 }
});
