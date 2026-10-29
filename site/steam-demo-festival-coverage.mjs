// Descriptive counts from independent public snapshots only. No merchant data.
// A retrospective Demo Available tag is NOT demo-at-launch; a survey is NOT a census.
const check=(n,label)=>{if(!Number.isSafeInteger(n)||n<0)throw new TypeError(label+' must be a nonnegative safe integer');};
export function auditDemoFestivalFrames({total2025Games,taggedDemoGames,festivalParticipantMinimum,surveyResponses,surveyMedianWishlists,participantMedianFollowers}={}){
 for(const [key,n] of Object.entries({total2025Games,taggedDemoGames,festivalParticipantMinimum,surveyResponses,surveyMedianWishlists,participantMedianFollowers}))check(n,key);
 if(total2025Games===0||festivalParticipantMinimum===0)throw new RangeError('Denominators must be positive');
 if(taggedDemoGames>total2025Games)throw new RangeError('Demo tagged cannot exceed all games');
 if(surveyResponses>festivalParticipantMinimum)throw new RangeError('Survey respondents exceed participants');
 return {kind:'tagged_release_year_and_voluntary_survey_comparison',current_demo_tag_share_of_2025_releases:taggedDemoGames/total2025Games,
  survey_responses_over_participant_minimum_ceiling:surveyResponses/festivalParticipantMinimum,
  wishlist_survey_median:surveyMedianWishlists,participant_follower_median:participantMedianFollowers,
  two_medians_in_same_units:false,actual_survey_response_rate:null,quantified_survey_selection_bias:null,
  games_with_demo_on_original_release_share:null,originally_paid_release_frame_verified:false,
  festival_incremental_paid_order_rate:null,publisher_net_receipts:null,after_labor_profit:null,
  caveat:'Snapshot count is current tag among prior-release games, with minor source-date drift. Survey responses over a festival-entry lower bound is not the invitation-based response rate. Follower growth and wishlists differ.'};
}
