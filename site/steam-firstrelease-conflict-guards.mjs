// Public-document conflict arithmetic only; not release authorization, tax advice or actual publisher timing.
const DAY=86400000;
function date(s,label){
 if(typeof s!=='string'||!new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$').test(s))throw new TypeError('Invalid '+label);
 const ms=Date.parse(s+'T00:00:00.000Z');
 if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==s)throw new TypeError('Invalid '+label);
 return ms;
}
const iso=ms=>new Date(ms).toISOString().slice(0,10);
export function auditSyntheticSteamFirstReleaseConflict({feePaidOn,comingSoonPublicOn,storeReviewApprovedOn,buildReviewApprovedOn,
 storeReviewSubmittedOn,buildReviewSubmittedOn,bankAndTaxVerified=false,releasePermissionsGranted=false}={}){
 const fee=date(feePaidOn,'fee payment'),page=date(comingSoonPublicOn,'Coming Soon publication'),
  storeSubmitted=date(storeReviewSubmittedOn,'store review submission'),
  buildSubmitted=date(buildReviewSubmittedOn,'build review submission'),
  storeApproved=date(storeReviewApprovedOn,'store approval'),buildApproved=date(buildReviewApprovedOn,'build approval');
 if(storeSubmitted>buildSubmitted)throw new RangeError('Store review must be submitted before build review');
 if(storeApproved<storeSubmitted||buildApproved<buildSubmitted)throw new RangeError('Approval before its submission');
 if(page<storeApproved)throw new RangeError('Cannot publish Coming Soon before store approval');
 if(typeof bankAndTaxVerified!=='boolean'||typeof releasePermissionsGranted!=='boolean')throw new TypeError('Account gates must be boolean');
 const base=Math.max(page+14*DAY,storeApproved,buildApproved);
 const candidates=[
  {source:'onboarding_english_oct29',stated_wait_days:21,candidate:iso(Math.max(base,fee+21*DAY))},
  {source:'steam_direct_landing_oct29',stated_wait_days:30,candidate:iso(Math.max(base,fee+30*DAY))}
 ];
 return {kind:'hypothetical_calendar_candidate_not_release_permission',
  fee_wait_source_conflict:true,earliest_candidates_by_public_text:candidates,
  earliest_across_public_texts:candidates[0].candidate,
  latest_across_public_texts:candidates[1].candidate,
  account_prerequisites_attested_for_fixture:bankAndTaxVerified&&releasePermissionsGranted,
  review_duration_guaranteed:false,tax_verification_duration_guaranteed:false,
  actual_partner_release_gate:null,guaranteed_release_date:null,
  verified_labor_hours:null,real_paid_game_orders:null,developer_after_cost_profit:null,
  note:'No authoritative single wait interval can be identified from conflicting public source texts; treat every date as conditional.'};
}
