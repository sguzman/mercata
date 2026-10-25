export function auditInactivityFrames(data,knownSources,channelCohorts){
 const errors=[];
 if(data?.kind!=='selected_creator_activity_and_inactivity_measurement'||data?.frames?.length!==3)errors.push('Unrecognized inactivity cohorts');
 for(const x of data?.frames||[]){
  if(!knownSources.has(x.source_id)||!x.cohort||!x.window_days||x.dead_or_closed_pct!==null||x.earnings_zero_rate!==null)errors.push('Missing source or unsupported closure/profit rate');
 }
 const [click,firm,vid]=data?.frames||[];
 if(click&&(click.sampled_channels_exact!==null||click.sampled_channels_approximate!==1900000||click.active_pct!==43||click.dormant_pct!==57||click.window_days!==30))errors.push('Established creator survey framing changed');
 if(firm&&(firm.sampled_channels_exact!==3375||firm.window_days!==90||firm.no_upload_pct!==46||firm.no_upload_one_year_pct!==27||firm.no_upload_two_year_pct!==18.6||firm.no_upload_three_year_pct!==14.3))errors.push('Company channel upload windows changed');
 const prior=channelCohorts?.datasets?.find(x=>x.id==='september_2026_below_1000_endpoints'),zero=prior?.bins?.find(x=>x.video_delta_min===0);
 if(vid&&(vid.metric!=='zero_net_change_in_public_video_count_not_verified_upload_inactivity'||vid.no_upload_pct!==null||vid.no_net_video_growth_count!==zero?.channels||vid.no_net_video_growth_denominator!==prior?.included_channels))errors.push('False inference from zero net video change');
 if(data?.cross_frame_comparison_allowed!==false||data?.matched_birth_and_exit_records!==null||Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Inferred population-wide attrition');
 return {valid:errors.length===0,errors};
}
