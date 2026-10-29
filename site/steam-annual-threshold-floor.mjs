// Lower revenue floor conditional on nested thresholds reported for one calendar year.
// No first-release success rate, full-market mean, publisher share or bank receipt inference.
const num=(n,label)=>{if(!Number.isSafeInteger(n)||n<0)throw new TypeError('Invalid '+label);return n;};
export function nestedAnnualGameGrossFloor({aboveLow,aboveHigh,lowUSD,highUSD}={}){
 for(const [k,v] of Object.entries({aboveLow,aboveHigh,lowUSD,highUSD}))num(v,k);
 if(lowUSD<=0||highUSD<=lowUSD||aboveHigh>aboveLow)throw new RangeError('Inconsistent nested annual thresholds');
 const middle=aboveLow-aboveHigh;
 const highFloor=aboveHigh*highUSD,middleFloor=middle*lowUSD;
 if(!Number.isSafeInteger(highFloor)||!Number.isSafeInteger(middleFloor)||!Number.isSafeInteger(highFloor+middleFloor))
  throw new RangeError('Unsafe revenue floor');
 return {above_low_count:aboveLow,above_high_count:aboveHigh,middle_threshold_count:middle,
  lower_floor_high_group_usd:highFloor,lower_floor_middle_group_usd:middleFloor,
  strict_total_revenue_floor_usd:highFloor+middleFloor,
  above_low_fraction_also_above_high:aboveLow?aboveHigh/aboveLow:null,
  conditional_on_matching_annual_game_gross_frames:true,
  actual_marketwide_annual_gross_usd:null,firstyear_newrelease_success_rate:null,
  actual_publisher_net_receipts_usd:null,developer_after_cost_profit_usd:null,
  explanation:'Revenue floor is conditional on game-level nested annual gross thresholds, not a platform gross estimate or individual publisher income.'};
}
