// Research-only public minimum planning floor. Do not use as a Steamworks release authorization.
function asDate(day){
 if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))throw new TypeError('Expected ISO YYYY-MM-DD');
 const n=Date.parse(day+'T00:00:00.000Z');
 if(!Number.isFinite(n)||new Date(n).toISOString().slice(0,10)!==day)throw new TypeError('Invalid calendar date');
 return n;
}
const iso=n=>new Date(n).toISOString().slice(0,10);
const add=(day,days)=>iso(asDate(day)+days*86400000);
export function publicFirstReleaseFloor({feePaidOn,comingSoonPublicOn,storeReviewApprovedOn,buildReviewApprovedOn}){
 const dates=[feePaidOn,comingSoonPublicOn,storeReviewApprovedOn,buildReviewApprovedOn];
 for(const date of dates)asDate(date);
 const feeFloor=add(feePaidOn,30),pageFloor=add(comingSoonPublicOn,14);
 const lowerBound=[feeFloor,pageFloor,storeReviewApprovedOn,buildReviewApprovedOn].sort().at(-1);
 return {published_rule_version:'2026-10-28_official_pages',fee_floor:feeFloor,coming_soon_floor:pageFloor,
  store_approval_on:storeReviewApprovedOn,build_approval_on:buildReviewApprovedOn,
  earliest_candidate_calendar_date:lowerBound,guaranteed_release_date:null,
  observed_partner_eligibility:null,
  note:'Minimum hypothetical candidate only; permissions, policies, account state, reviews and publisher controls may delay release.'};
}
