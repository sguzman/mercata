export function auditDiscoveryMetric(model,{source,metric}={}){
 const row=model?.metrics?.find(x=>x.id===metric);
 if(!row)return {allowed:false,reason:'unknown_discovery_metric'};
 if(source==='public_vendor_index'){
   if(row.access.startsWith('authorized'))return {allowed:false,reason:'owner_only_impression_or_earning_metric'};
   if(!['public_subscribers','public_video_count_delta','public_views'].includes(metric))return {allowed:false,reason:'not_public_metric'};
   return {allowed:true,unit:row.unit,public_or_owner:'public',actual_value:null,creator_earnings:null};
 }
 if(source==='authorized_owner'){
   return {allowed:true,unit:row.unit,public_or_owner:'owner_authorized',actual_value:null,creator_earnings:null};
 }
 return {allowed:false,reason:'unknown_source_or_authorization'};
}
export function classifyNewChannel(model,{first_publication_age_days,subscribers_at_start}={}){
 if(!Number.isInteger(subscribers_at_start)||subscribers_at_start<0||
    !Number.isInteger(first_publication_age_days)||first_publication_age_days<0)
   return {valid:false,reason:'owner_confirmed_age_and_subscribers_required'};
 const id=first_publication_age_days<=90?'new_verified_entry':
   subscribers_at_start<1000?'small_incumbent':'medium_incumbent';
 return {valid:true,stratum:id,first_publication_age_confirmed_by_owner:true,
   observed_thumbnail_impressions:null,causal_growth_probability:null};
}
