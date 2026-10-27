import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Self-reported follower-feed traffic is a bounded one-game referral view event not a payment result',()=>{
 const o=read('ontology/itch-io/follower-feed-review-referrals-one-game-2026.json'),s=read('specimens/itch-io.json');
 assert.equal(o.event.date,'2026-05-05');assert.equal(o.event.review_posts_described,2);
 assert.equal(o.event.my_feed_referred_views_approximately,500);assert.equal(o.event.approximate_view_count,true);
 assert.deepEqual(o.event.reviewer_follower_counts_described_approximately,[1600,5600]);
 assert.equal(o.source_published_at,'2026-05-16');assert.equal(o.event.distinct_new_product_viewers,null);
 assert.equal(o.surrounding_context.game_offer_mandatory_positive_price_verified,null);
 assert(Object.values(o.unobserved).every(v=>v===null));
 assert(o.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 const claim=s.claims.find(x=>x.id==='hey-moon-eyes-feed-may5-2026-views');
 assert.deepEqual(claim.source_ids,['hey-moon-eyes-2026-feed-referral']);assert.equal(claim.confidence,'moderate');
});
test('An existing discovery task advances without fabricating devlog conversion or changing inventory',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/discovery/study-devlog-and-follower-channels');
 assert.equal(t.status,'in_progress');assert.equal(t.percent,96);
 for(const path of ['ontology/itch-io/follower-feed-review-referrals-one-game-2026.json','ontology/itch-io/follower-feed-review-referrals-one-game-2026.md','tests/itch-follower-review-referral-case.test.mjs'])assert(t.evidence.includes(path));
});
