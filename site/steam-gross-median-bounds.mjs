// Synthetic data study-design QA only. Do not feed private publisher reports into a public repository.
// Partial identification, not a representative income estimator.
export function boundGrossPaidGameLowerMedian({eligibleFrameSize,observedGrossUsd,frameComplete=false}={}){
 if(!Number.isSafeInteger(eligibleFrameSize)||eligibleFrameSize<1)throw new TypeError('Eligible frame size must be a positive integer');
 if(!Array.isArray(observedGrossUsd)||observedGrossUsd.length>eligibleFrameSize)throw new TypeError('Observed outcomes exceed or lack the frame');
 if(typeof frameComplete!=='boolean')throw new TypeError('frameComplete must be boolean');
 for(const value of observedGrossUsd)if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new TypeError('Gross paid sales must be nonnegative finite numbers');
 const n=eligibleFrameSize,m=n-observedGrossUsd.length,k=Math.ceil(n/2);
 const values=[...observedGrossUsd].sort((a,b)=>a-b);
 const lower=frameComplete?(k<=m?0:values[k-m-1]):null;
 const upper=frameComplete?(k>values.length?null:values[k-1]):null;
 return {
  lower_median_dollars_lower_bound:lower,
  lower_median_dollars_upper_bound:upper,
  upper_is_unbounded:frameComplete&&upper===null,
  frame_complete_attested:frameComplete,eligible_frame_size:n,
  observed_complete_values:values.length,missing_values:m,
  median_point_identified:frameComplete&&lower!==null&&upper!==null&&lower===upper,
  exact_zero_sale_fraction:null,developer_net_payout_median:null,after_cost_profit_median:null,
  real_steam_outcomes_verified_by_mercata:false,
  caveat:'Bounds hold only if the full original-paid frame and every supplied complete gross value are independently authentic. Null upper means unbounded, not a recorded infinite amount.'
 };
}


// This advanced synthetic median uses the SAME authenticated fixed-horizon game
// observation contract as the gross-mean bounds, not raw volunteer-reported dollars.
import {boundSyntheticSteamGrossMean,conservativeSteamFourDecimalUsdCents} from './steam-gross-mean-nonresponse-bounds.mjs';
const amount=(row,cents,dec)=>{
 if(row[cents]!==undefined&&row[cents]!==null){
  return {lower_cents:row[cents],upper_cents:row[cents]};
 }
 return conservativeSteamFourDecimalUsdCents(row[dec]);
};
export function boundSyntheticSteamGrossOrderMedian(args={}){
 // Enforces unique synthetic IDs, fixed release-age horizon, complete-ledger
 // attestations, verified partial floors and independently justified upper caps.
 const audit=boundSyntheticSteamGrossMean(args);
 const {eligibleFrameSize,observed=[],missing=[]}=args;
 const lows=[],highs=[];
 for(const row of observed){
  const b=amount(row,'gross_usd_cents','gross_sales_usd_4dp');
  lows.push(b.lower_cents);highs.push(b.upper_cents);
 }
 for(const row of missing){
  const partial=row.observed_partial_gross_usd_cents!==undefined||
   row.observed_partial_gross_usd_4dp!==undefined;
  const capped=row.verified_upper_cap_usd_cents!==undefined&&row.verified_upper_cap_usd_cents!==null||
   row.verified_upper_cap_usd_4dp!==undefined&&row.verified_upper_cap_usd_4dp!==null;
  lows.push(partial?amount(row,'observed_partial_gross_usd_cents','observed_partial_gross_usd_4dp').lower_cents:0);
  highs.push(capped?amount(row,'verified_upper_cap_usd_cents','verified_upper_cap_usd_4dp').upper_cents:Infinity);
 }
 lows.sort((a,b)=>a-b);highs.sort((a,b)=>a-b);
 const rank=Math.ceil(eligibleFrameSize/2)-1;
 const frame=audit.cohort_frame_verified,low=frame?lows[rank]:null;
 const up=frame&&Number.isFinite(highs[rank])?highs[rank]:null;
 return {kind:'synthetic_gross_order_median_partial_identification_not_market_revenue',
  frame_size:eligibleFrameSize,horizon_days:audit.horizon_days,
  lower_median_order_rank:rank+1,observed_complete_games:audit.observed_complete_games,
  incomplete_games:audit.missing_games,verified_partial_floor_games:audit.observed_partial_floor_games,
  cohort_frame_verified:frame,
  gross_lower_median_lower_bound_usd_cents:low,
  gross_lower_median_upper_bound_usd_cents:up,
  median_upper_unbounded:frame&&up===null,
  median_point_identified:frame&&low===up&&up!==null,
  actual_steam_median_gross:null,developer_net_cash_median:null,publisher_profit_median:null,
  caveat:'Only invented game records. Independent verified individual bounds can constrain a gross game median, not a developer payout, after-cost profit or observed Steam population.'};
}
