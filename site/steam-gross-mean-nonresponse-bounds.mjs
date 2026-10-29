// Synthetic-only gross Steam game mean partial identification. Never use merchant reports here.
const valid=(v,label)=>{if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Nonnegative safe integer required: '+label);return v;};
const add=(a,b,label)=>{const x=a+b;if(!Number.isSafeInteger(x))throw new RangeError('Unsafe '+label+' sum');return x;};
const allowed=(obj,keys)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>keys.includes(k));
const observedKeys=['fixture_id','horizon_days','coverage','gross_usd_cents','gross_sales_usd_4dp',
 'financial_access_attested','transfer_history_reconciled',
 'paid_checkout_attribution_attested','release_horizon_reconciled'];
const missingKeys=['fixture_id','horizon_days','verified_upper_cap_usd_cents','verified_upper_cap_usd_4dp','cap_verified',
 'observed_partial_gross_usd_cents','observed_partial_gross_usd_4dp','partial_gross_verified',
 'partial_horizon_attested','paid_checkout_attribution_attested'];

const present=x=>x!==null&&x!==undefined;
// Input amounts are either exact safe cents or canonical four-decimal USD, never both.
const amountBounds=(row,centsKey,decimalKey,label)=>{
 const cents=present(row[centsKey]),decimal=present(row[decimalKey]);
 if(cents===decimal)throw new TypeError('Exactly one cents or four-decimal USD amount required: '+label);
 if(cents){
  const n=valid(row[centsKey],label);
  return {lower_cents:n,upper_cents:n};
 }
 return conservativeSteamFourDecimalUsdCents(row[decimalKey]);
};


export function boundSyntheticSteamGrossMean(args={}){
 if(!allowed(args,['eligibleFrameSize','horizonDays','cohortFrameVerified','observed','missing']))
  throw new TypeError('Unexpected or malformed synthetic mean input');
 const {eligibleFrameSize,horizonDays,cohortFrameVerified=false,observed=[],missing=[]}=args;
 valid(eligibleFrameSize,'frame');if(eligibleFrameSize===0)throw new RangeError('Empty frame');
 if(![30,90,365].includes(horizonDays))throw new TypeError('Invalid fixed release-age horizon');
 if(typeof cohortFrameVerified!=='boolean')throw new TypeError('Frame completeness must be boolean');
 if(!Array.isArray(observed)||!Array.isArray(missing)||observed.length+missing.length!==eligibleFrameSize)
  throw new RangeError('Frame counts do not reconcile');
 const ids=new Set();let knownSum=0,knownUpperSum=0,partialFloorSum=0,upperExtra=0,unbounded=0,partialGames=0,decimalObservations=0;
 for(const [kind,rows] of [['observed',observed],['missing',missing]]){
  for(const row of rows){
   if(!allowed(row,kind==='observed'?observedKeys:missingKeys)||
     typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
     ids.has(row.fixture_id))throw new TypeError('Unique permitted synthetic fixtures only');
   ids.add(row.fixture_id);
   if(row.horizon_days!==horizonDays)throw new RangeError('Mixed horizons');
   if(kind==='observed'){
    if(row.coverage!=='complete_reconciled')throw new RangeError('Partial observed gross is not eligible');
    if(row.financial_access_attested!==true||row.transfer_history_reconciled!==true||
       row.paid_checkout_attribution_attested!==true||row.release_horizon_reconciled!==true)
     throw new TypeError('Complete gross requires financial access, transfer, game attribution and fixed-horizon attestations');
    const lower=amountBounds(row,'gross_usd_cents','gross_sales_usd_4dp','observed gross');
    knownSum=add(knownSum,lower.lower_cents,'observed lower');
    knownUpperSum=add(knownUpperSum,lower.upper_cents,'observed upper');
    if(row.gross_sales_usd_4dp!==undefined)decimalObservations++;
   }else{
    if(row.gross_usd_cents!==undefined)throw new TypeError('Missing gross must not be imputed');
    const hasFloor=present(row.observed_partial_gross_usd_cents)||present(row.observed_partial_gross_usd_4dp);
    let floor=0;
    if(hasFloor){
     floor=amountBounds(row,'observed_partial_gross_usd_cents','observed_partial_gross_usd_4dp',
      'verified partial gross').lower_cents;
     if(row.partial_gross_verified!==true||row.partial_horizon_attested!==true||
       row.paid_checkout_attribution_attested!==true)
      throw new TypeError('Partial floor requires authenticated in-horizon game-attributed evidence');
     partialGames++;
    }else if(row.partial_gross_verified===true||row.partial_horizon_attested===true||
             row.paid_checkout_attribution_attested===true)
     throw new TypeError('Partial attestation without a partial amount is incomplete');
    partialFloorSum=add(partialFloorSum,floor,'partial floor');
    const hasCap=present(row.verified_upper_cap_usd_cents)||present(row.verified_upper_cap_usd_4dp);
    if(!hasCap){
     if(row.cap_verified===true)throw new TypeError('Missing cap cannot be verified');
     unbounded++;
    }else{
     if(row.cap_verified!==true)throw new TypeError('Finite cap requires verification');
     const top=amountBounds(row,'verified_upper_cap_usd_cents','verified_upper_cap_usd_4dp',
      'missing upper cap').upper_cents;
     if(top<floor)throw new RangeError('Verified upper cap cannot be below authenticated partial gross floor');
     upperExtra=add(upperExtra,top,'upper caps');
    }
   }
  }
 }
 const lowerTotal=add(knownSum,partialFloorSum,'known and partial lower');
 const upperTotal=add(knownUpperSum,upperExtra,'known and capped upper');
 const report=cohortFrameVerified,finite=report&&unbounded===0;
 return {frame_size:eligibleFrameSize,horizon_days:horizonDays,observed_complete_games:observed.length,
  missing_games:missing.length,observed_partial_floor_games:partialGames,unknown_upper_caps:unbounded,
  cohort_frame_verified:report,
  complete_observed_gross_usd_cents:knownSum===knownUpperSum?knownSum:null,
  complete_observed_gross_lower_usd_cents:knownSum,
  complete_observed_gross_upper_usd_cents:knownUpperSum,
  decimal_gross_observations:decimalObservations,
  authenticated_partial_lower_total_usd_cents:partialFloorSum,
  lower_mean_gross_usd_cents:report?lowerTotal/eligibleFrameSize:null,
  upper_mean_gross_usd_cents:finite?upperTotal/eligibleFrameSize:null,
  upper_unbounded:report&&!finite,point_identified:finite&&lowerTotal===upperTotal,
  real_zero_paid_order_fraction:null,actual_platform_mean_gross:null,developer_net_cash_mean:null,publisher_profit_mean:null,
  note:'Hypothetical bounds only: authenticated partial floors require full in-horizon and package attribution, and independently verified caps cannot be inferred from observed hits. Steam API USD values have four decimals; any cents floor must round downward and any cap upward.'};
}


// Valve reports gross_sales_usd as a decimal string with exactly four USD places.
// Quantize directionally for conservative integer-cent bounds without floating point.
export function conservativeSteamFourDecimalUsdCents(value){
 if(typeof value!=='string'||!/^(0|[1-9][0-9]{0,13})\.[0-9]{4}$/.test(value))
  throw new TypeError('Canonical four-decimal nonnegative USD string required');
 const [d,frac]=value.split('.');
 const tenThousandths=BigInt(d)*10000n+BigInt(frac);
 const lower=tenThousandths/100n,upper=(tenThousandths+99n)/100n;
 if(upper>BigInt(Number.MAX_SAFE_INTEGER))
  throw new RangeError('USD cents exceed the safe integer range');
 return {lower_cents:Number(lower),upper_cents:Number(upper),
  exactly_whole_cents:lower===upper};
}
