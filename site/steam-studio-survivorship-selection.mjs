// Synthetic cohort selection audit: apparent game-order reviews are not experience treatment effects.
const iso=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
const count=value=>Number.isSafeInteger(value)&&value>=0;
const median=list=>{if(!list.length)return null;const s=[...list].sort((a,b)=>a-b),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;};
const allowed=['fixture_studio_id','first_release_date','first_game_reviews','second_release_date','second_game_reviews'];
export function auditSyntheticStudioRepeatSelection(rows,{asOf,minFollowupDays=365}={}){
 if(!Array.isArray(rows)||!rows.length)throw new TypeError('Nonempty fixture studio records required');
 if(!iso(asOf)||!count(minFollowupDays)||minFollowupDays<1)throw new TypeError('Valid audit date and follow-up horizon required');
 const seen=new Set(),first=[],firstRepeat=[],second=[],paired=[],cohort={repeaters:0,no_second_observed_with_followup:0,right_censored_for_second:0};
 for(const row of rows){
  if(!row||typeof row!=='object'||Object.keys(row).some(x=>!allowed.includes(x))||typeof row.fixture_studio_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_studio_id)||seen.has(row.fixture_studio_id))
   throw new TypeError('Only unique synthetic studio IDs and approved fields allowed');
  seen.add(row.fixture_studio_id);
  if(!iso(row.first_release_date)||row.first_release_date>asOf||!count(row.first_game_reviews))throw new TypeError('Invalid initial release or review count');
  const secondKnown=row.second_game_reviews!==null;
  if(secondKnown&&(!count(row.second_game_reviews)||!iso(row.second_release_date)||row.second_release_date<=row.first_release_date||row.second_release_date>asOf))
   throw new TypeError('Second game requires valid later date and observed reviews');
  if(!secondKnown&&row.second_release_date!==null)throw new TypeError('No second review observation cannot have second-game date');
  first.push(row.first_game_reviews);
  if(secondKnown){
   cohort.repeaters++;firstRepeat.push(row.first_game_reviews);second.push(row.second_game_reviews);
   paired.push(row.second_game_reviews-row.first_game_reviews);
  }else {
   const age=Math.floor((Date.parse(asOf+'T00:00:00Z')-Date.parse(row.first_release_date+'T00:00:00Z'))/86400000);
   if(age<minFollowupDays)cohort.right_censored_for_second++;
   else cohort.no_second_observed_with_followup++;
  }
 }
 const mAll=median(first),mFirstRepeater=median(firstRepeat),mSecondRepeater=median(second);
 return {kind:'synthetic_studio_name_sequence_review_selection_not_real_steam_data',as_of:asOf,min_followup_days:minFollowupDays,
  studios_in_supplied_fixture:rows.length,counts:cohort,first_game_review_median_all:mAll,
  first_game_review_median_among_repeaters:mFirstRepeater,second_game_review_median_among_repeaters:mSecondRepeater,
  naive_unmatched_median_difference:mSecondRepeater===null?null:mSecondRepeater-mAll,
  matched_repeaters_difference_of_medians:mSecondRepeater===null?null:mSecondRepeater-mFirstRepeater,
  matched_repeaters_median_of_gamewise_differences:median(paired),
  no_second_observed_is_not_business_failure:true,
  review_count_is_not_paid_units:true,age_aligned_review_observation_verified:false,
  real_studio_debut_survival_probability:null,causal_experience_premium:null,incremental_sales_from_publisher:null,
  actual_game_paid_orders:null,publisher_profit:null,
  caveat:'A different distribution of studios makes game-order medians noncausal; even matched comparisons remain confounded by time, genre, funding, studio survival and review-age differences.'};
}
