// Distinguishes upload copies, published post events, and people moving across platforms.
export function auditCrossplatformStudy(study,ids){
 const errors=[];
 if(study?.platform!=='youtube'||study?.kind!=='crossplatform_publishing_vs_audience_migration')errors.push('identity');
 if(!study?.source_ids?.every(x=>ids.has(x))||study.source_ids.length!==2)errors.push('source registration');
 const s=study?.vendor_posting_snapshot||{};
 if(s.uploads!==66318||s.creators!==6175||s.successful_post_events!==199276||s.multiplatform_uploads!==50175)errors.push('original posting sample counts changed');
 if(s.share_uploads_multi_platform_percent!==76||s.successful_youtube_posts_share_percent!==18)errors.push('wrong denominators');
 if(s.upload_destinations_distribution?.reduce((a,x)=>a+x.percent,0)!==100||s.multiple_platform_pair_percent?.length!==3)errors.push('bad multi-platform bins');
 if(s.audience_viewers_observed!==null||s.measured_cross_platform_follower_migration!==null)errors.push('fabricated migrating viewers');
 const h=study?.historical_competition_paper||{};
 if(h.event_date!=='2016-09'||h.causal_transport_to_2026_shorts_verified!==false||h.observed_viewer_migrations!==null)errors.push('false historical causal transport');
 if(study?.mechanism_gates?.length!==5||study.mechanism_gates.some((x,i)=>x.measured_audience_shift!==false||i>0&&x.observed_in_vendor_sample!==false))errors.push('unverified funnel gate');
 if(!study?.unmeasured||Object.values(study.unmeasured).some(x=>x!==null))errors.push('invented migration rate or profit');
 return {valid:errors.length===0,errors};
}
