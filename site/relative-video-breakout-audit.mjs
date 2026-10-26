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
 const bins=m?.length_bins;
 if(!bins||bins?.source_id!=='tubemind-2026-video-outlier-index'||
    bins?.bins?.length!==6||
    bins.bins.map(x=>x.reported_5x_percent).join(',')!=='10.5,8.7,9.3,8.8,9.3,11.4')
  errors.push('Length breakout rates or registered source missing');
 if(!bins?.bins?.every((x,i,a)=>x.n===null&&x.minimum_seconds_inclusive===(i?a[i-1].maximum_seconds_exclusive:0))||
    bins?.bins?.[5]?.maximum_seconds_exclusive!==null)
  errors.push('Duration bins overlap or have fabricated denominators');
 if(bins?.may_infer_40min_duration_causes_breakout!==false||
    bins?.may_infer_40min_creator_profit_advantage!==false||
    bins?.may_infer_8min_midroll_ads_from_breakout!==false||
    bins?.production_hours_by_length!==null||bins?.ad_impressions_by_length!==null)
  errors.push('Causal duration, income or ad inventory claim is unsupported');
 if(bins?.midroll_threshold_seconds_independently_from_official_youtube_help!==480||
    bins?.eight_minute_threshold_inside_publisher_4_to_10_min_bin!==true)
  errors.push('Official eight-minute ad gate conflated with vendor duration bucket');
 if(!m?.small_channel_5x_cases_selected?.every(x=>x.total_indexed_niche_channels_under_10000===null))
  errors.push('Unsupported per-niche all-small-channel denominators');
 const tail=m?.breakout_tail;
 if(tail?.comparable_video_objects!==555158||tail?.cumulative_not_disjoint!==true||
    tail?.thresholds?.map(x=>x.multiple_at_least).join(',')!=='2,3,5,10,20,50,99'||
    tail?.thresholds?.map(x=>x.reported_percent).join(',')!=='23.7,16.2,10.1,5.4,3,1.3,0.7')
  errors.push('Cumulative breakout tail rates or population do not match provider');
 if(!tail?.thresholds?.every((x,i,a)=>i===0||a[i-1].reported_percent>=x.reported_percent)||
    tail?.per_channel_probability_of_any_breakout!==null||tail?.typical_lifetime_income_of_breakout_channels!==null)
  errors.push('Cumulative video tail misread as disjoint channel success or income');
 const presenter=m?.presenter_cohorts;
 if(presenter?.faceless_classified_channel_count!==2862||
    presenter?.faceless_channels_with_vendor_monetization_signals!==2305||
    presenter?.faceless_5x_channels_under_1_year!==520||
    presenter?.eligible_all_faceless_under_1_year!==null)
  errors.push('Vendor presenter cohort or unknown newcomer denominator corrupted');
 if(presenter?.signal_is_verified_actual_ypp_acceptance!==false||
    presenter?.signal_is_verified_paid_revenue!==false||
    presenter?.faceless_5x_channels_under_1_year_success_probability!==null||
    presenter?.observed_paid_faceless_newcomer_income!==null)
  errors.push('Monetization signal falsely promoted to verified income or new-entrant success');
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
