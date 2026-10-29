// Pure arithmetic on provider-reported price-bin summaries, never a real buyer or game-level dataset.
export function auditPublicSteamPriceBins({paid_frame_count,whole_dollar_zero_bin,exact_0_99_count,exact_4_99_count}={}){
 for(const [k,v] of Object.entries({paid_frame_count,whole_dollar_zero_bin,exact_0_99_count,exact_4_99_count})){
  if(!Number.isSafeInteger(v)||v<0)throw new TypeError('Invalid nonnegative count '+k);
 }
 if(paid_frame_count===0||whole_dollar_zero_bin>paid_frame_count||
    exact_0_99_count>whole_dollar_zero_bin||exact_4_99_count>paid_frame_count)
  throw new RangeError('Inconsistent public catalog price counts');
 const remaining=whole_dollar_zero_bin-exact_0_99_count;
 return {frame_size:paid_frame_count,zero_whole_dollar_bin:whole_dollar_zero_bin,
  exact_0_99_count,exact_4_99_count,other_zero_bin_count_at_most:remaining,
  conditional_minimum_share_of_zero_bin_at_0_99:whole_dollar_zero_bin?exact_0_99_count/whole_dollar_zero_bin:null,
  conditional_share_of_frame_at_4_99:exact_4_99_count/paid_frame_count,
  frame_definition_verified:false,actual_free_game_count:null,actual_paid_order_count:null,
  observed_price_elasticity:null,actual_developer_profit:null,
  limitation:'Conditional on matching provider frame and integer-floor bucket semantics. Catalog prices are not checkout units or profits.'};
}
