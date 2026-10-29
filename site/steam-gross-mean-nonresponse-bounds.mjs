// Synthetic-only gross Steam game mean partial identification. Not a financial API client.
const valid=(v,label)=>{if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Nonnegative safe integer required: '+label);return v;};
export function boundSyntheticSteamGrossMean({eligibleFrameSize,horizonDays,cohortFrameVerified=false,observed=[],missing=[]}={}){
 valid(eligibleFrameSize,'frame');if(eligibleFrameSize===0)throw new RangeError('Empty frame');
 if(![30,90,365].includes(horizonDays))throw new TypeError('Invalid fixed release-age horizon');
 if(typeof cohortFrameVerified!=='boolean')throw new TypeError('Frame completeness must be boolean');
 if(!Array.isArray(observed)||!Array.isArray(missing)||observed.length+missing.length!==eligibleFrameSize)throw new RangeError('Frame counts do not reconcile');
 const ids=new Set();let knownSum=0,upperExtra=0,unbounded=0;
 for(const [kind,rows] of [['observed',observed],['missing',missing]]){
  for(const row of rows){
   if(!row||typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||ids.has(row.fixture_id))throw new TypeError('Unique synthetic fixtures only');
   ids.add(row.fixture_id);
   if(row.horizon_days!==horizonDays)throw new RangeError('Mixed horizons');
   if(kind==='observed'){
    if(row.coverage!=='complete_reconciled')throw new RangeError('Partial observed gross is not eligible');
    knownSum+=valid(row.gross_usd_cents,'observed gross');
    if(!Number.isSafeInteger(knownSum))throw new RangeError('Unsafe observed sum');
   }else{
    if(row.gross_usd_cents!==undefined)throw new TypeError('Missing gross must not be imputed');
    const cap=row.verified_upper_cap_usd_cents;
    if(cap===undefined||cap===null){if(row.cap_verified===true)throw new TypeError('Missing cap cannot be verified');unbounded++;}
    else {if(row.cap_verified!==true)throw new TypeError('Finite cap requires verification');upperExtra+=valid(cap,'missing cap');if(!Number.isSafeInteger(upperExtra))throw new RangeError('Unsafe cap sum');}
   }
  }
 }
 if(!Number.isSafeInteger(knownSum+upperExtra))throw new RangeError('Unsafe total');
 const report=cohortFrameVerified,finite=report&&unbounded===0;
 return {frame_size:eligibleFrameSize,horizon_days:horizonDays,observed_complete_games:observed.length,missing_games:missing.length,unknown_upper_caps:unbounded,cohort_frame_verified:report,
  lower_mean_gross_usd_cents:report?knownSum/eligibleFrameSize:null,upper_mean_gross_usd_cents:finite?(knownSum+upperExtra)/eligibleFrameSize:null,
  upper_unbounded:report&&!finite,point_identified:report&&missing.length===0,
  real_zero_paid_order_fraction:null,actual_platform_mean_gross:null,developer_net_cash_mean:null,publisher_profit_mean:null,
  note:'Full eligible game frame and known complete observations must be independently verified; unchecked missing caps leave upper mean unbounded.'};
}
