import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {aggregateVisiblePublicPosts,assessCommunityPopulationClaim} from '../site/public-community-post-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official Post discovery and video comment API belong to different surface populations',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/public-community-post-protocol.json'),load('specimens/youtube.json')]);
 assert(model.source_ids.every(id=>dossier.evidence.some(x=>x.id===id)));
 assert.equal(model.public_post_types.length,6);
 assert.equal(model.discoverability.length,4);
 assert.equal(model.data_api_boundary.max_per_page,100);
 assert.equal(model.data_api_boundary.creator_posts_list_api_documented_in_this_source,false);
 assert.equal(model.observed_post_sample.length,0);
 assert.equal(model.representative_creator_community_population,null);
});
test('Post observations deduplicate public Posts and preserve missing counters',()=>{
 const a=aggregateVisiblePublicPosts([
 {post_id:'P1',visibility:'public',kind:'poll',observed_at:'2026-10-23',like_count:10,comment_count:null},
 {post_id:'P2',visibility:'public',kind:'image',observed_at:'2026-10-24',like_count:null,comment_count:5}
 ]);
 assert.equal(a.posts,2);
 assert.equal(a.by_post_type.poll,1);
 assert.equal(a.posts_with_observed_like_counter,1);
 assert.equal(a.posts_with_observed_comment_counter,1);
 assert.equal(a.aggregate_observed_like_events,10);
 assert.equal(a.aggregate_observed_comment_events,5);
 assert.equal(a.all_unobserved_counters_are_zero,false);
 assert.equal(a.engagement_rate,null);
 assert.equal(assessCommunityPopulationClaim(a,'selected_public_post_count').allowed,true);
 for(const claim of ['all_community_members','unique_people_reached','political_affiliation','creator_profit'])
  assert.equal(assessCommunityPopulationClaim(a,claim).allowed,false);
});
test('Rejects duplicate IDs, private content, stored commenter identities and incomplete numeric counters',()=>{
 const row={post_id:'P1',visibility:'public',kind:'text',observed_at:'2026-10-25',like_count:2,comment_count:1};
 assert.throws(()=>aggregateVisiblePublicPosts([row,row]),/Duplicate/);
 assert.throws(()=>aggregateVisiblePublicPosts([{...row,visibility:'members_only'}]),/Only explicitly public/);
 assert.throws(()=>aggregateVisiblePublicPosts([{...row,user_handle:'@private'}]),/Person-level fields forbidden/);
 assert.throws(()=>aggregateVisiblePublicPosts([{...row,comment_count:undefined}]),/Invalid counter/);
});
test('Site documents community Posts without presenting subscriber count as engagement denominator',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderPublicCommunityPosts'));
 assert(app.includes('public-community-post-protocol.json'));
 assert(app.includes('no verified unique member count or earnings'));
});
