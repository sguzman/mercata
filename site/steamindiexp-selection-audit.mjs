// Source-bounded public snapshot arithmetic only; not a complete Steam release census.
const natural=x=>Number.isSafeInteger(x)&&x>=0;
const allowed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
export function auditSteamIndieXpSelection(record){
 if(!allowed(record,['frame','review_milestone','ai_disclosure_sample','next_fest_roster']))
  throw new TypeError('Invalid or unpermitted Indie XP audit fields');
 const {frame:f,review_milestone:h,ai_disclosure_sample:a,next_fest_roster:n}=record;
 if(!allowed(f,['reported_recent_indie_games','major_publishers_explicitly_excluded',
  'recent_window_calendar_days','original_paid_release_frame_complete','early_access_initial_paid_release_reconciled'])||
  !allowed(h,['minimum_lifetime_reviews','minimum_release_age_days','maximum_release_age_days',
   'reported_theme_coded_hits','sampled_nonhits','sampled_nonhit_expansion_approx',
   'mature_21_120_population_count','actual_paid_game_sales','calculated_full_indie_hit_fraction'])||
  !allowed(a,['sampled_games','reported_disclosure_games','source_rounded_share_percent',
   'approximate_uncertainty_percentage_points','disclosure_self_reported','independently_verified_ai_use_fraction'])||
  !allowed(n,['source_count_october_slopdodge','source_count_october_steamdb',
   'same_inclusion_rules_verified','actual_demo_player_total']))
  throw new TypeError('Invalid public sample fields');
 const counts=[f.reported_recent_indie_games,f.major_publishers_explicitly_excluded,
  f.recent_window_calendar_days,h.minimum_lifetime_reviews,h.minimum_release_age_days,
  h.maximum_release_age_days,h.reported_theme_coded_hits,h.sampled_nonhits,
  h.sampled_nonhit_expansion_approx,a.sampled_games,a.reported_disclosure_games,
  a.source_rounded_share_percent,a.approximate_uncertainty_percentage_points,
  n.source_count_october_slopdodge,n.source_count_october_steamdb];
 if(!counts.every(natural)||f.reported_recent_indie_games===0||
  h.minimum_lifetime_reviews===0||h.minimum_release_age_days<1||
  h.minimum_release_age_days>h.maximum_release_age_days||
  h.maximum_release_age_days>f.recent_window_calendar_days||
  h.reported_theme_coded_hits>f.reported_recent_indie_games||
  h.sampled_nonhits>f.reported_recent_indie_games||
  a.sampled_games===0||a.reported_disclosure_games>a.sampled_games||
  a.source_rounded_share_percent>100||a.approximate_uncertainty_percentage_points>100||
  n.source_count_october_slopdodge===0||n.source_count_october_steamdb===0)
  throw new RangeError('Inconsistent sample, time horizon, or category counts');
 if(f.original_paid_release_frame_complete!==false||f.early_access_initial_paid_release_reconciled!==false||
  h.mature_21_120_population_count!==null||h.actual_paid_game_sales!==null||
  h.calculated_full_indie_hit_fraction!==null||a.disclosure_self_reported!==true||
  a.independently_verified_ai_use_fraction!==null||
  n.same_inclusion_rules_verified!==false||n.actual_demo_player_total!==null)
  throw new RangeError('No original paid frame, complete matured denominator, verified AI usage, or paid sales was collected');
 const measuredShare=a.reported_disclosure_games/a.sampled_games;
 if(Math.round(100*measuredShare)!==a.source_rounded_share_percent)
  throw new RangeError('Reported disclosure percentage conflicts with sampled counts');
 return {
  recent_indie_tagged_game_count:f.reported_recent_indie_games,
  major_publishers_excluded_count:f.major_publishers_explicitly_excluded,
  sampled_theme_games:h.reported_theme_coded_hits+h.sampled_nonhits,
  selected_hits_in_theme_sample:h.reported_theme_coded_hits,
  sampled_theme_nonhits:h.sampled_nonhits,
  observed_ai_disclosure_fraction_in_random_sample:measuredShare,
  source_ai_disclosure_uncertainty_approx_pp:a.approximate_uncertainty_percentage_points,
  cross_provider_festival_roster_difference:n.source_count_october_slopdodge-n.source_count_october_steamdb,
  entire_indie_frame_hit_rate:null,
  full_paid_release_hit_rate:null,
  actual_indie_or_publisher_income:null,
  full_october_demo_player_count:null,
  no_sales_inferred_from_reviews:true,
  limitation:'Hit and non-hit theme coding was outcome-stratified; the eligible matured count is unknown and Indie tagging plus Early Access graduation do not identify the full paid-release cohort.'
 };
}
