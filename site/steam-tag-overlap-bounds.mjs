// Pigeonhole bounds for public, nonexclusive historical release-year tag counts.
// These are NECESSARY bounds conditional on a matching catalog, not observed title joins.
export function boundReleaseTagOverlap({allReleasedGames,tagCounts}={}){
 if(!Number.isSafeInteger(allReleasedGames)||allReleasedGames<1)throw new TypeError('Positive total games required');
 if(!Array.isArray(tagCounts)||tagCounts.length<2||tagCounts.length>16)throw new TypeError('Two through sixteen tag counts required');
 let memberships=0;const seen=new Set();
 for(const t of tagCounts){
  if(!t||typeof t.tag!=='string'||!/^[A-Za-z][A-Za-z -]{0,59}$/.test(t.tag)||seen.has(t.tag))throw new TypeError('Unique tag names required');
  seen.add(t.tag);
  if(!Number.isSafeInteger(t.games)||t.games<0||t.games>allReleasedGames)throw new TypeError('Each tag membership count must fit frame');
  memberships+=t.games;
  if(!Number.isSafeInteger(memberships))throw new RangeError('Unsafe summed tag memberships');
 }
 const surplus=Math.max(0,memberships-allReleasedGames);
 const needed=Math.ceil(surplus/(tagCounts.length-1));
 return {kind:'conditional_tag_overlap_lower_bound_not_steam_paid_sales',all_released_games:allReleasedGames,
  tag_categories:tagCounts.length,sum_nonexclusive_tag_memberships:memberships,
  max_distinct_games_with_any_tag:Math.min(allReleasedGames,memberships),
  min_distinct_games_with_any_tag:Math.max(...tagCounts.map(t=>t.games)),
  forced_redundant_memberships_lower_bound:surplus,
  forced_distinct_games_with_two_or_more_tags_lower_bound:needed,
  exact_distinct_multitag_games:null,exact_pairwise_tag_overlaps:null,
  indie_legal_publisher_identity:null,paid_only_release_frame_verified:false,
  game_sales_by_tag:null,developer_profit_by_tag:null,
  caveat:'Counts must be within the SAME game/year universe at the SAME snapshot. Dated SteamDB tag values can drift. Lower bound is not observed joins or an exclusive genre breakdown.'};
}
