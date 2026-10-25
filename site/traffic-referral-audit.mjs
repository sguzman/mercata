export function auditTrafficReferralMatrix(data,knownSources){
 const errors=[], registry=data?.api_attribution_crosswalk;
 if(data?.kind!=='creator_traffic_source_concentration_protocol'||registry?.api_dimension!=='insightTrafficSourceType'||registry?.access!=='authorized_owner_analytics_report')errors.push('Wrong owner Analytics measurement');
 if(!registry?.source_ids?.length||registry.source_ids.some(s=>!knownSources.has(s)))errors.push('Missing official source');
 const codes=new Set();for(const entry of registry?.categories||[]){
  if(!/^[A-Z_]+$/.test(entry.api_code)||codes.has(entry.api_code))errors.push('Duplicate or invalid traffic code');
  codes.add(entry.api_code);
  if(!entry.meaning||!entry.origin||!entry.studio_group||!entry.limits||entry.private_person_identity!==null||entry.portable_customer_relationship!==null||entry.creator_income_by_source!==null)errors.push('Unobserved personal outcomes inferred');
 }
 const required=['EXT_URL','NO_LINK_EMBEDDED','NO_LINK_OTHER','RELATED_VIDEO','SHORTS','YT_SEARCH','SUBSCRIBER','NOTIFICATION','ADVERTISING','PLAYLIST','YT_CHANNEL','YT_OTHER_PAGE','VIDEO_REMIXES','SOUND_PAGE','END_SCREEN'];
 if(codes.size!==required.length||required.some(c=>!codes.has(c)))errors.push('Incomplete source distinctions');
 const find=id=>registry?.categories?.find(x=>x.api_code===id);
 if(find('EXT_URL')?.studio_group!=='external'||find('YT_SEARCH')?.studio_group!=='youtube_search'||find('NO_LINK_OTHER')?.studio_group!=='direct_or_unknown'||find('ADVERTISING')?.origin!=='paid_ad_referral')errors.push('Incorrect external/search/paid source');
 if(find('SHORTS')?.origin!=='shorts_vertical_feed'||find('SUBSCRIBER')?.subscription_status!=='not_proven')errors.push('Shorts source or subscriber identity conflation');
 if((registry?.observed_creator_rows||[]).length!==0||Object.values(registry?.metrics_in_study||{}).some(x=>x!==null))errors.push('Invented owner Analytics findings');
 return {valid:errors.length===0,errors};
}
