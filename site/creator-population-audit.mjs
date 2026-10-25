export function auditCreatorPopulation(data,cohorts,index,sources){
 const errors=[];
 if(data?.kind!=='creator_channel_activity_population_crosswalk'||data?.frames?.length!==4)errors.push('Wrong vendor frame register');
 const first=cohorts?.datasets?.find(x=>x.id==='july_2026_distribution'),net=cohorts?.datasets?.find(x=>x.id==='july_2026_positive_net_video_subset'),late=cohorts?.datasets?.find(x=>x.id==='september_2026_below_1000_endpoints');
 const expected=[first?.included_channels,net?.included_channels,late?.included_channels,index?.creatordb?.indexed_channels_at_least_1000_subscribers];
 const knownIds=new Set();
 for(let i=0;i<(data?.frames||[]).length;i++){
  const x=data.frames[i];
  if(knownIds.has(x.id)||!sources.has(x.source_id)||x.channel_count!==expected[i])errors.push('Missing source or altered vendor count');
  knownIds.add(x.id);
  if(x.account_owner_people_count!==null||x.active_uploader_count!==null||x.advertising_approved_creators!==null||x.creator_profit!==null)errors.push('Invented people, payees or active uploaders');
 }
 if(data?.not_independent_dataset_sum!==true||data?.not_a_global_monthly_active_creators_estimate!==true||Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Invalid creator population conclusion');
 return {valid:!errors.length,errors};
}
