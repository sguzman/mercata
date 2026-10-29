// Pure finite-population review coverage bounds. No sales, purchases or missing-at-random assumptions.
const natural=(n,label)=>{if(!Number.isSafeInteger(n)||n<0)throw new TypeError(label+' must be a nonnegative safe integer');return n;};
export function boundReviewMilestone({catalogGames,checkedGames,uncheckedGames,checkedBelow,threshold}={}){
 for(const [name,value] of Object.entries({catalogGames,checkedGames,uncheckedGames,checkedBelow,threshold}))natural(value,name);
 if(catalogGames<1||threshold<1)throw new RangeError('catalogGames and threshold must be positive');
 if(checkedGames+uncheckedGames!==catalogGames)throw new RangeError('Checked plus unchecked must equal catalog');
 if(checkedBelow>checkedGames)throw new RangeError('Below-threshold exceeds checked');
 return {kind:'finite_catalog_observation_bounds_not_steam_paid_sales',
  review_count_below_exclusive:threshold,observed_below:checkedBelow,observed_at_or_above:checkedGames-checkedBelow,
  observed_checked_total:checkedGames,unknown_review_count:uncheckedGames,full_catalog_total:catalogGames,
  below_threshold_checked_conditional_share:checkedGames?checkedBelow/checkedGames:null,
  lower_below_threshold_share:checkedBelow/catalogGames,
  upper_below_threshold_share:(checkedBelow+uncheckedGames)/catalogGames,
  lower_below_threshold_count:checkedBelow,upper_below_threshold_count:checkedBelow+uncheckedGames,
  completely_observed:uncheckedGames===0,
  early_review_concentration_verified:false,real_zero_paid_orders_share:null,actual_publisher_profit:null,
  note:'Missing review observations may be below or above a threshold. Bounds depend on correctness of the checked catalog. Reviews cannot prove sales or publisher income.'};
}
export function contrastUnmatchedReleaseReviewFractions(a,b){
 for(const v of [a,b])if(!v||typeof v.name!=='string'||!v.name||!Number.isSafeInteger(v.releaseYear)||!Number.isSafeInteger(v.gameCount)||v.gameCount<1||typeof v.belowTenShare!=='number'||!Number.isFinite(v.belowTenShare)||v.belowTenShare<0||v.belowTenShare>1)throw new TypeError('Valid source summaries required');
 if(a.name===b.name)throw new TypeError('Separate sources required');
 if(a.releaseYear!==b.releaseYear)throw new RangeError('Release years differ');
 return {kind:'unharmonized_public_review_fraction_comparison',release_year:a.releaseYear,first_source:a.name,second_source:b.name,
  difference_percentage_points:(b.belowTenShare-a.belowTenShare)*100,game_count_difference:b.gameCount-a.gameCount,
  identical_appid_roster:false,matched_age_distribution:false,
  actual_market_trend:null,paid_checkout_rate:null,causal_calendar_effect:null,
  note:'These are unmatched review count snapshots. Differences may reflect coverage, definitions, ages and data collection, not any causal or payout trend.'};
}
