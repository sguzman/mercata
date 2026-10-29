// Synthetic-only gross Steam game mean partial identification. Never use merchant reports here.
const valid=(v,label)=>{if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Nonnegative safe integer required: '+label);return v;};
const add=(a,b,label)=>{const x=a+b;if(!Number.isSafeInteger(x))throw new RangeError('Unsafe '+label+' sum');return x;};
const allowed=(obj,keys)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>keys.includes(k));
const observedKeys=['fixture_id','horizon_days','coverage','gross_usd_cents'];
const missingKeys=['fixture_id','horizon_days','verified_upper_cap_usd_cents','cap_verified',
 'observed_partial_gross_usd_cents','partial_gross_verified',
 'partial_horizon_attested','paid_checkout_attribution_attested'];

export function boundSyntheticSteamGrossMean(args={}){
 if(!allowed(args,['eligibleFrameSize','horizonDays','cohortFrameVerified','observed','missing']))
  throw new TypeError('Unexpected or malformed synthetic mean input');
 const {eligibleFrameSize,horizonDays,cohortFrameVerified=false,observed=[],missing=[]}=args;
 valid(eligibleFrameSize,'frame');if(eligibleFrameSize===0)throw new RangeError('Empty frame');
 if(![30,90,365].includes(horizonDays))throw new TypeError('Invalid fixed release-age horizon');
 if(typeof cohortFrameVerified!=='boolean')throw new TypeError('Frame completeness must be boolean');
 if(!Array.isArray(observed)||!Array.isArray(missing)||observed.length+missing.length!==eligibleFrameSize)
  throw new RangeError('Frame counts do not reconcile');
 const ids=new Set();let knownSum=0,partialFloorSum=0,upperExtra=0,unbounded=0,partialGames=0;
 for(const [kind,rows] of [['observed',observed],['missing',missing]]){
  for(const row of rows){
   if(!allowed(row,kind==='observed'?observedKeys:missingKeys)||
     typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
     ids.has(row.fixture_id))throw new TypeError('Unique permitted synthetic fixtures only');
   ids.add(row.fixture_id);
   if(row.horizon_days!==horizonDays)throw new RangeError('Mixed horizons');
   if(kind==='observed'){
    if(row.coverage!=='complete_reconciled')throw new RangeError('Partial observed gross is not eligible');
    knownSum=add(knownSum,valid(row.gross_usd_cents,'observed gross'),'observed');
   }else{
    if(row.gross_usd_cents!==undefined)throw new TypeError('Missing gross must not be imputed');
    const part=row.observed_partial_gross_usd_cents;
    let floor=0;
    if(part!==undefined){
     floor=valid(part,'verified partial gross');
     if(row.partial_gross_verified!==true||row.partial_horizon_attested!==true||
       row.paid_checkout_attribution_attested!==true)
      throw new TypeError('Partial floor requires authenticated in-horizon game-attributed evidence');
     partialGames++;
    }else if(row.partial_gross_verified===true||row.partial_horizon_attested===true||
             row.paid_checkout_attribution_attested===true)
     throw new TypeError('Partial attestation without a partial amount is incomplete');
    partialFloorSum=add(partialFloorSum,floor,'partial floor');
    const cap=row.verified_upper_cap_usd_cents;
    if(cap===undefined||cap===null){
     if(row.cap_verified===true)throw new TypeError('Missing cap cannot be verified');
     unbounded++;
    }else{
     if(row.cap_verified!==true)throw new TypeError('Finite cap requires verification');
     const top=valid(cap,'missing cap');
     if(top<floor)throw new RangeError('Verified upper cap cannot be below authenticated partial gross floor');
     upperExtra=add(upperExtra,top,'upper caps');
    }
   }
  }
 }
 const lowerTotal=add(knownSum,partialFloorSum,'known and partial lower');
 const upperTotal=add(knownSum,upperExtra,'known and capped upper');
 const report=cohortFrameVerified,finite=report&&unbounded===0;
 return {frame_size:eligibleFrameSize,horizon_days:horizonDays,observed_complete_games:observed.length,
  missing_games:missing.length,observed_partial_floor_games:partialGames,unknown_upper_caps:unbounded,
  cohort_frame_verified:report,
  complete_observed_gross_usd_cents:knownSum,authenticated_partial_lower_total_usd_cents:partialFloorSum,
  lower_mean_gross_usd_cents:report?lowerTotal/eligibleFrameSize:null,
  upper_mean_gross_usd_cents:finite?upperTotal/eligibleFrameSize:null,
  upper_unbounded:report&&!finite,point_identified:finite&&lowerTotal===upperTotal,
  real_zero_paid_order_fraction:null,actual_platform_mean_gross:null,developer_net_cash_mean:null,publisher_profit_mean:null,
  note:'Hypothetical bounds only: authenticated partial floors require full in-horizon and package attribution, and independently verified caps cannot be inferred from observed hits. Steam API USD values have four decimals; any cents floor must round downward and any cap upward.'};
}
