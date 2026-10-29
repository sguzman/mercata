// Strict synthetic date-only ceiling for Update Visibility Rounds; not a live Steamworks planner.
const DAY=86400000;
const dateValue=(s,label)=>{
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('Invalid '+label);
 const ms=Date.parse(s+'T00:00:00Z');
 if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==s)throw new TypeError('Invalid '+label);
 return ms;
};
const fmt=ms=>new Date(ms).toISOString().slice(0,10);
export function auditSyntheticSteamUpdateRound({startDate,saleBlackouts=[],initialRoundsUsed=0,
 launchVisibilityConcluded=false,isEarlyAccess=false,daysSinceEarlyAccessLaunch=null}={}){
 const start=dateValue(startDate,'start date'),end=start+30*DAY;
 if(!Array.isArray(saleBlackouts))throw new TypeError('Invalid blackouts');
 if(!Number.isSafeInteger(initialRoundsUsed)||initialRoundsUsed<0||initialRoundsUsed>5)throw new RangeError('Initial rounds used must be 0..5');
 if(typeof launchVisibilityConcluded!=='boolean'||typeof isEarlyAccess!=='boolean')throw new TypeError('Boolean launch flags required');
 if(isEarlyAccess&&(!Number.isSafeInteger(daysSinceEarlyAccessLaunch)||daysSinceEarlyAccessLaunch<0))throw new TypeError('Early Access age must be a nonnegative integer');
 if(!isEarlyAccess&&daysSinceEarlyAccessLaunch!==null)throw new TypeError('Early Access age only for Early Access');
 const covered=new Set();
 for(const b of saleBlackouts){
  if(!b||typeof b!=='object')throw new TypeError('Invalid blackout');
  const first=dateValue(b.startDate,'blackout start'),last=dateValue(b.endInclusive,'blackout end');
  if(last<first)throw new RangeError('Blackout ends before start');
  if((last-first)/DAY>366)throw new RangeError('Unreasonably long blackout');
  for(let t=Math.max(first,start);t<=Math.min(last,end-DAY);t+=DAY)covered.add(t);
 }
 const blackoutDays=covered.size;
 const entryGate=initialRoundsUsed<5&&launchVisibilityConcluded&&(!isEarlyAccess||daysSinceEarlyAccessLaunch>=14);
 return {window_start:startDate,nominal_end_exclusive:fmt(end),nominal_calendar_days:30,
  assumed_sale_blackout_days:blackoutDays,potential_nonblackout_calendar_days_at_most:30-blackoutDays,
  initial_rounds_remaining:5-initialRoundsUsed,date_and_initial_allotment_gate_passed:entryGate,
  possible_early_impression_cap:true,expected_impressions:null,expected_visits:null,
  actual_homepage_days:null,actual_incremental_sales:null,profit_from_round:null,
  note:'No observed placements or purchases: even nonblackout days may have zero impressions, and the 1M cap may end a round sooner.'};
}
