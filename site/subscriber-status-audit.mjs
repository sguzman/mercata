export function subscriptionStatusSplit(rows,{metric='views',expectedTotal=null}={}){
 if(!['views','engagedViews','estimatedMinutesWatched'].includes(metric))return {valid:false,reason:'incompatible_metric'};
 if(!Array.isArray(rows)||rows.length!==2)return {valid:false,reason:'two_complete_status_rows_required'};
 const by=new Map(rows.map(r=>[r.subscribedStatus,r]));
 if(by.size!==2||!by.has('SUBSCRIBED')||!by.has('UNSUBSCRIBED'))return {valid:false,reason:'distinct_subscribed_and_unsubscribed_rows_required'};
 const a=by.get('SUBSCRIBED'),b=by.get('UNSUBSCRIBED');
 if(![a[metric],b[metric]].every(v=>Number.isFinite(v)&&v>=0)||!['period_start','period_end','creatorContentType','region'].every(k=>a[k]===b[k]&&a[k]!==undefined))return {valid:false,reason:'incompatible_or_missing_report_grain'};
 const total=a[metric]+b[metric];
 if(total<=0)return {valid:false,reason:'zero_denominator'};
 if(expectedTotal!==null&&(!Number.isFinite(expectedTotal)||Math.abs(total-expectedTotal)>1e-8))return {valid:false,reason:'unreconciled_total'};
 return {valid:true,metric,subscribed:a[metric],unsubscribed:b[metric],total,subscribed_share_percent:100*a[metric]/total,unsubscribed_share_percent:100*b[metric]/total,unique_people_estimate:null,creator_earnings:null};
}
export function auditSubscribedStatusProtocol(data,sources){
 const errors=[];
 if(data?.kind!=='subscriber_status_attention_measurement_protocol'||data?.api_scope?.subscriber_status_at_event_time!==true||data?.api_scope?.viewer_can_contribute_to_both_categories_in_one_period!==true)errors.push('Subscription status semantics broken');
 if(data?.api_scope?.subscriber_feed_traffic_source_equivalent!==false||data?.api_scope?.subscriber_count_equivalent!==false||data?.api_scope?.public_api_without_owner_authorization!==false)errors.push('Nonpublic view data recast as public');
 if(data?.api_scope?.statuses?.join('|')!=='SUBSCRIBED|UNSUBSCRIBED')errors.push('Incomplete status bins');
 if(!data?.source_ids?.length||data.source_ids.some(x=>!sources.has(x)))errors.push('Unknown source');
 if(data?.eligible_report?.authorized_rows?.length!==0||data?.eligible_report?.subscriber_share_of_views!==null||data?.eligible_report?.creator_revenue_by_status!==null||Object.values(data?.unmeasured||{}).some(v=>v!==null))errors.push('Invented reported split');
 return {valid:!errors.length,errors};
}
