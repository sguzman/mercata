export function auditCreatorPortability(model,knownSources){
 const errors=[];
 if(model?.kind!=='public_cross_platform_creator_portability_crosswalk'||model?.routes?.length!==4)errors.push('Unrecognized scope');
 const ids=new Set();for(const r of model?.routes||[]){
  if(ids.has(r.platform))errors.push('Duplicate service');ids.add(r.platform);
  if(!r.source_ids?.length||!r.source_ids.every(x=>knownSources.has(x)))errors.push('Missing official source');
  if(!r.route||!r.restrictions?.length)errors.push('Missing capability limitation');
  if(r.native_follower_or_subscriber_transfer_verified!==null||r.retained_engagement_and_recommendation_history_verified!==null)errors.push('Unsupported social migration guarantee');
  if(r.measured_conversion_of_audience!==null||r.median_creator_switching_cost_usd!==null||r.median_creator_switching_hours!==null)errors.push('Invented migration observation');
 }
 const twitch=model?.routes?.find(x=>x.platform==='twitch');
 if(!twitch||JSON.stringify(twitch.retention_days_by_tier)!==JSON.stringify({non_affiliate:7,affiliate:14,partner_or_prime_or_turbo:60,high_quality_or_vertical_variant:7}))errors.push('Incorrect tiered expiration');
 const vimeo=model?.routes?.find(x=>x.platform==='vimeo_ott');
 if(vimeo?.authorized_customer_csv_possible!==true||!vimeo.restrictions.some(x=>x.includes('Marketing opt-in')))errors.push('Missing sensitive customer consent boundary');
 if(Object.values(model?.unmeasured||{}).some(x=>x!==null))errors.push('Inferred unmeasured switching outcomes');
 return {valid:!errors.length,errors};
}
