// Official Steam Playtest reset state preflight, not an authenticated partner action.
// Invented aggregate counts only; no user IDs, keys, private data or reset execution.
const keys=['status','visibility','signup_type','friend_invites','shared_package_with_other_apps',
 'store_settings_published','steamworks_settings_published','participants','waiting_requesters','playtest_keys_issued'];
const safe=n=>Number.isSafeInteger(n)&&n>=0;
const expected={
 status:'not_playable',visibility:'hidden',signup_type:'limited',
 friend_invites:['paused','disabled'],shared_package_with_other_apps:false,
 store_settings_published:true,steamworks_settings_published:true
};
export function evaluateSyntheticSteamPlaytestReset(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input)||
  Object.keys(input).some(k=>!keys.includes(k)))
  throw new TypeError('Permitted Playtest fixture fields only');
 for(const key of ['participants','waiting_requesters','playtest_keys_issued'])
  if(!safe(input[key]))throw new TypeError('Nonnegative safe aggregate fixture counts required: '+key);
 if(!['playable','not_playable'].includes(input.status)||
  !['visible','hidden'].includes(input.visibility)||
  !['limited','open'].includes(input.signup_type)||
  !['enabled','paused','disabled'].includes(input.friend_invites)||
  typeof input.shared_package_with_other_apps!=='boolean'||
  typeof input.store_settings_published!=='boolean'||
  typeof input.steamworks_settings_published!=='boolean')
  throw new TypeError('Explicit permitted Playtest settings required');
 const blockers=Object.entries(expected).filter(([k,want])=>Array.isArray(want)?
  !want.includes(input[k]):input[k]!==want).map(([k])=>k);
 const ready=blockers.length===0;
 return {
  kind:'synthetic_playtest_reset_preflight_not_partner_action',
  reset_prerequisites_satisfied:ready,
  blocking_settings:blockers,
  reset_is_irreversible:true,
  hypothetical_if_reset:ready?{
   remaining_participant_grants:0,remaining_waiting_requesters:0,
   active_playtest_product_keys:0,
   removed_participants:input.participants,
   removed_waiting_requesters:input.waiting_requesters,
   disabled_playtest_product_keys:input.playtest_keys_issued,
   pending_friend_invites_archived:true
  }:null,
  reenable_without_reset_preserves_existing_grants:true,
  simply_marking_not_playable_does_not_revoke_issued_keys:true,
  pausing_friend_invites_does_not_expire_pending_invites:true,
  unique_participant_ids_supplied:false,
  actual_steam_playtest_reset_performed:false,
  actual_paid_base_game_order_conversion:null,
  actual_publisher_payout:null,
  caveat:'This pure function models documented prerequisites and conditional effects on fictional aggregates. A Playtest reset is not a paid game refund or an empirical causal experiment.'
 };
}
