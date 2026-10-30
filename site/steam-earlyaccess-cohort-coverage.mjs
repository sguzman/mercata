// Source-bounded public Early Access snapshot validator: NEVER paid sales evidence.
const count=n=>Number.isSafeInteger(n)&&n>=0;
const obj=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const bins=['under_10','10_to_99','100_to_999','1000_plus'];
export function auditSteamEarlyAccessSelection(snapshot){
 if(!obj(snapshot,['total_recovered_all_eras','historical_2013_2023','live_as_of_snapshot',
  'graduated_duration_subset','post_full_release_update_post_subset','selection_limitations']))
  throw new TypeError('Unexpected Early Access study fields');
 const total=snapshot.total_recovered_all_eras,h=snapshot.historical_2013_2023,
  live=snapshot.live_as_of_snapshot,days=snapshot.graduated_duration_subset,
  updates=snapshot.post_full_release_update_post_subset,limits=snapshot.selection_limitations;
 if(!obj(total,['games','reviewed_10plus'])||
  !obj(h,['all_recovered_entrants','reviewed_10plus','review_bins',
   'reported_full_release_percent_all_recovered','reported_full_release_percent_10plus',
   'early_graduates_missing_due_review_flag'])||
  !obj(h.reviewed_10plus,['games','graduated_full_release','still_ea_with_no_update_notice',
   'still_ea_recently_updated','removed_while_in_ea','graduated_subsequently_removed'])||
  !obj(live,['still_early_access_games','have_no_update_over_year_notice',
   'games_aged_one_year_or_more','aged_one_year_or_more_with_note',
   'absence_of_note_proves_active_development','presence_of_note_proves_abandoned'])||
  !obj(days,['entrant_start_year','entrant_end_year','selected_graduated_within_five_years',
   'median_days_to_1_0','outcome_conditioned'])||
  !obj(updates,['graduated_window_from','graduated_window_to','games_with_10plus_reviews',
   'percentage_without_public_steam_update_post_3_to_15_months','cannot_identify_unposted_builds'])||
  !obj(limits,['initial_paid_release_frame_complete','early_access_first_paid_sale_date_verified',
   'omitted_removed_games_are_not_known_zero','historical_review_counts_post_outcome',
   'original_review_epoch_older_graduates_incomplete','legal_publisher_deduplication',
   'no_marketwide_paid_order_observations']))
  throw new TypeError('Unexpected or missing population fields');
 const gr=h.reviewed_10plus;
 const nums=[total.games,total.reviewed_10plus,h.all_recovered_entrants,
  ...Object.values(gr),live.still_early_access_games,live.have_no_update_over_year_notice,
  live.games_aged_one_year_or_more,live.aged_one_year_or_more_with_note,
  days.entrant_start_year,days.entrant_end_year,days.selected_graduated_within_five_years,
  days.median_days_to_1_0,updates.games_with_10plus_reviews];
 if(nums.some(x=>!count(x))||total.games===0||gr.games===0||
  total.reviewed_10plus>total.games||h.all_recovered_entrants>total.games||
  gr.games>h.all_recovered_entrants||
  h.all_recovered_entrants-gr.games<0||
  gr.graduated_subsequently_removed>gr.graduated_full_release||
  gr.graduated_full_release+gr.still_ea_with_no_update_notice+
   gr.still_ea_recently_updated+gr.removed_while_in_ea!==gr.games||
  live.have_no_update_over_year_notice>live.still_early_access_games||
  live.aged_one_year_or_more_with_note>live.games_aged_one_year_or_more||
  live.aged_one_year_or_more_with_note>live.have_no_update_over_year_notice||
  live.games_aged_one_year_or_more>live.still_early_access_games||
  days.entrant_start_year>days.entrant_end_year||days.median_days_to_1_0===0)
  throw new RangeError('Early Access cohorts or statuses do not reconcile');
 if(!Array.isArray(h.review_bins)||h.review_bins.length!==4||h.review_bins.some((b,i)=>
  !obj(b,['reviews','games','reported_graduation_percent'])||
  b.reviews!==bins[i]||!count(b.games)||typeof b.reported_graduation_percent!=='number'||
  !Number.isFinite(b.reported_graduation_percent)||b.reported_graduation_percent<0||
  b.reported_graduation_percent>100))
  throw new TypeError('Invalid disjoint review count bins');
 const all=h.review_bins.reduce((n,b)=>n+b.games,0),
 reviewed=h.review_bins.slice(1).reduce((n,b)=>n+b.games,0);
 if(all!==h.all_recovered_entrants||reviewed!==gr.games)
  throw new RangeError('Review-threshold cohorts do not reconcile');
 if(h.reported_full_release_percent_all_recovered!==51||
  Math.round(100*gr.graduated_full_release/gr.games)!==h.reported_full_release_percent_10plus||
  h.early_graduates_missing_due_review_flag!==true||
  live.absence_of_note_proves_active_development!==false||
  live.presence_of_note_proves_abandoned!==false||
  days.outcome_conditioned!==true||
  updates.cannot_identify_unposted_builds!==true||
  limits.initial_paid_release_frame_complete!==false||
  limits.early_access_first_paid_sale_date_verified!==false||
  limits.omitted_removed_games_are_not_known_zero!==true||
  limits.historical_review_counts_post_outcome!==true||
  limits.original_review_epoch_older_graduates_incomplete!==true||
  limits.legal_publisher_deduplication!==false||
  limits.no_marketwide_paid_order_observations!==true)
  throw new RangeError('Unsupported completeness, abandonment or financial inference');
 const pub=updates.percentage_without_public_steam_update_post_3_to_15_months;
 if(typeof pub!=='number'||!Number.isFinite(pub)||pub<0||pub>100||
  days.selected_graduated_within_five_years>gr.graduated_full_release||
  updates.games_with_10plus_reviews>total.reviewed_10plus||
  !/^20\d{2}-(0[1-9]|1[0-2])$/.test(updates.graduated_window_from)||
  !/^20\d{2}-(0[1-9]|1[0-2])$/.test(updates.graduated_window_to)||
  updates.graduated_window_from>updates.graduated_window_to)
  throw new RangeError('Invalid historical graduation/update window');
 return {
  all_eras_recovered_early_access_games:total.games,
  historical_2013_2023_any_review_games:h.all_recovered_entrants,
  historical_2013_2023_10plus_games:gr.games,
  reviewless_and_lowreview_games:h.review_bins[0].games,
  historical_10plus_graduation_fraction:gr.graduated_full_release/gr.games,
  reported_all_recovered_graduation_percent:h.reported_full_release_percent_all_recovered,
  review_threshold_selection_gap_percentage_points:
   h.reported_full_release_percent_10plus-h.reported_full_release_percent_all_recovered,
  historical_10plus_removed_while_in_ea_minimum:gr.removed_while_in_ea,
  graduated_then_removed_are_subset_not_extra_status:gr.graduated_subsequently_removed,
  live_ea_no_update_note_fraction:live.have_no_update_over_year_notice/live.still_early_access_games,
  live_ea_one_year_plus_no_update_note_fraction:
   live.aged_one_year_or_more_with_note/live.games_aged_one_year_or_more,
  postrelease_no_update_post_fraction_reported:pub/100,
  actual_zero_paid_sale_fraction:null,
  developer_net_income_median:null,
  abandonment_probability:null,
  paid_first_release_cohort_complete:false,
  caveat:'Review-threshold status is cross-sectional and post-outcome; removals are incomplete, and an absence of an update note is not evidence of successful operation, game sales or publisher profit.'
 };
}
