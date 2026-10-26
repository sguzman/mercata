export function auditRelativeVideoBreakouts(m,known){
 const errors=[];
 if(m?.kind!=='commercial_selected_channel_relative_breakout_cohort_2026')errors.push('Unrecognized study');
 if(!m?.source_ids?.every(id=>known.has(id)))errors.push('Unregistered source');
 if(m?.total_indexed_videos!==558739||m?.total_indexed_channels!==6663)errors.push('Publisher sample totals changed');
 if(m?.index_comparable_videos!==555158||m?.unscored_videos!==3581||
   m?.total_indexed_videos!==m?.index_comparable_videos+m?.unscored_videos)errors.push('Missing unscored-video reconciliation');
 if(m?.format_groups?.reduce((a,b)=>a+b.video_count,0)!==m?.index_comparable_videos)errors.push('Format-specific denominators do not reconcile');
 if(m?.format_groups?.[0]?.five_x_or_more_percent!==9.7||
   m?.format_groups?.[1]?.five_x_or_more_percent!==10.6)errors.push('Changed provider format rates');
 if(!m?.small_channel_5x_cases_selected?.every(x=>x.total_indexed_niche_channels_under_10000===null))
  errors.push('Unsupported per-niche all-small-channel denominators');
 if(m?.proprietary_niche_opportunity_scores_as_empirical_success_probability_allowed!==false||
   m?.category_ranks_as_earnings_ranks_allowed!==false)errors.push('Ranking or score falsely authorized as a population outcome');
 if(Object.values(m?.unknowns||{}).some(x=>x!==null)||m?.amount_of_money_for_5x!==null)errors.push('Unsupported payout or population estimate');
 return {valid:errors.length===0,errors};
}
export function summarizeIndexedVideoBreakout(m,group){
 const g=m?.format_groups?.find(x=>x.format===group);
 if(!g)return {allowed:false,reason:'unregistered_format'};
 return {allowed:true,scope:'vendor_indexed_videos_relative_to_own_channel_format_median',
  video_count:g.video_count,five_x_or_more_percent:g.five_x_or_more_percent,
  absolute_creator_income:null,all_youtube_newcomer_success_probability:null,causal_format_effect:null};
}
