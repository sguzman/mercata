const kinds=new Set(['text','image','gif','poll','quiz','video']);
const count=(v,name)=>{
 if(v===null)return null;
 if(!Number.isSafeInteger(v)||v<0)throw Error('Invalid counter '+name);
 return v;
};
export function aggregateVisiblePublicPosts(entries) {
 if(!Array.isArray(entries))throw Error('Explicit post observations required');
 const ids=new Set(),byKind={},counterCoverage={likes:0,comments:0};let likes=0,comments=0;
 for(const row of entries){
  if(typeof row?.post_id!=='string'||!row.post_id.trim()||ids.has(row.post_id))throw Error('Duplicate or missing public post ID');
  ids.add(row.post_id);
  if(row.visibility!=='public')throw Error('Only explicitly public Posts are supported');
  if(!kinds.has(row.kind))throw Error('Unknown post format');
  if(typeof row.observed_at!=='string'||!Number.isFinite(Date.parse(row.observed_at)))throw Error('Missing observation date');
  for(const forbidden of ['author_id','comment_text','user_handle','viewer_id','person_name']){
   if(Object.prototype.hasOwnProperty.call(row,forbidden))throw Error('Person-level fields forbidden: '+forbidden);
  }
  const l=count(row.like_count,'like_count'),c=count(row.comment_count,'comment_count');
  byKind[row.kind]=(byKind[row.kind]||0)+1;
  if(l!==null){counterCoverage.likes++;likes+=l;}
  if(c!==null){counterCoverage.comments++;comments+=c;}
 }
 if(!Number.isSafeInteger(likes)||!Number.isSafeInteger(comments))throw Error('Aggregate count overflow');
 return {unit:'public_posts_in_selected_sample',posts:entries.length,by_post_type:byKind,
  posts_with_observed_like_counter:counterCoverage.likes,
  posts_with_observed_comment_counter:counterCoverage.comments,
  aggregate_observed_like_events:likes,aggregate_observed_comment_events:comments,
  engagement_rate:null,unique_viewers:null,community_members:null,creator_earnings:null,
  all_unobserved_counters_are_zero:false};
}
export function assessCommunityPopulationClaim(record,claim){
 if(claim==='selected_public_post_count')return {allowed:true,value:record.posts,unit:'selected_public_posts'};
 return {allowed:false,reason:'no_verified_people_exposure_or_commercial_denominator'};
}
