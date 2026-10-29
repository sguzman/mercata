// Public game-developer aggregate-only audit. Do not submit merchant or player records.
const nat=(v,label)=>{if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Invalid nonnegative safe integer: '+label);return v;};
export function auditPublishedNextFestOverlap(x){
 const keys=['demo_players','played_and_wishlisted','reported_wishlist_additions','daily_demo_players','daily_wishlist_additions'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Only public aggregate fields are permitted');
 const p=nat(x.demo_players,'players'),both=nat(x.played_and_wishlisted,'overlap'),w=nat(x.reported_wishlist_additions,'wishlist adds');
 if(both>p)throw new RangeError('Overlap cannot exceed demo player count');
 const sum=(v,k)=>{
  if(!Array.isArray(v)||v.length<1)throw new TypeError('Daily counts required: '+k);
  let total=0;
  for(const n of v){total+=nat(n,k);if(!Number.isSafeInteger(total))throw new RangeError('Unsafe daily aggregate');}
  return total;
 };
 const dailyPlayers=sum(x.daily_demo_players,'players'),dailyWishlists=sum(x.daily_wishlist_additions,'wishlists');
 return {kind:'public_demo_wishlist_joint_membership_not_paid_conversion',
  played_and_wishlisted_share_of_demo_players:p>0?both/p:null,
  daily_demo_players_sum:dailyPlayers,daily_wishlist_additions_sum:dailyWishlists,
  demo_player_sum_reconciled:dailyPlayers===p,wishlist_additions_reconciled:dailyWishlists===w,
  wishlist_additions_unreconciled_delta:dailyWishlists-w,
  daily_player_entries:x.daily_demo_players.length,daily_wishlist_entries:x.daily_wishlist_additions.length,
  matched_purchase_conversion:null,chronological_play_to_wishlist_conversion:null,
  representative_steam_player_overlap:null,causal_festival_lift:null,publisher_profit:null,
  limitations:'Public aggregated observations may span different dates; joint membership is not temporal conversion, a matched sale, or a marketwide estimate.'};
}
