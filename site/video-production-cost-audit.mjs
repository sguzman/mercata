// Owner-authorized cash and labor arithmetic; no public creator cost estimates.
export function assessProductionLedger(x){
 const fail=reason=>({status:'invalid',reason,total_cost:null,net_cash:null,net_cash_per_hour:null});
 if(!x||x.source!=='authorized_creator_aggregate'||!x.currency||!x.format||!x.period)return fail('Unspecified origin, format, currency or period');
 for(const key of ['purchased_assets_allocated','existing_gear_allocated','software_and_licenses','network_and_energy','contractors','other_cash_costs','logged_labor_hours']){
  if(!Number.isFinite(x[key])||x[key]<0)return fail('Nonnegative cost and labor inputs required: '+key);
 }
 const cost=x.purchased_assets_allocated+x.existing_gear_allocated+x.software_and_licenses+x.network_and_energy+x.contractors+x.other_cash_costs;
 if(x.verified_net_creator_receipts===null)return {status:'cost_only_no_verified_revenue',reason:'Revenue unknown',total_cost:cost,net_cash:null,net_cash_per_hour:null};
 if(!Number.isFinite(x.verified_net_creator_receipts)||x.verified_net_creator_receipts<0)return fail('Receipts must be verified nonnegative money or null');
 const net=x.verified_net_creator_receipts-cost;
 return {status:'descriptive_cash_return',reason:'No inference to other creators or future outcomes',total_cost:cost,net_cash:net,net_cash_per_hour:x.logged_labor_hours>0?net/x.logged_labor_hours:null};
}
export function auditVideoProductionCosts(data,sources){
 const errors=[];
 if(data?.platform!=='youtube'||data?.kind!=='creator_video_format_cost_and_labor_register')errors.push('identity');
 if(data?.format_paths?.length!==5||data?.budget_levels?.length!==3)errors.push('production scope');
 for(const x of data?.format_paths||[])if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id))||x.observed_median_cash_cost!==null||x.observed_median_labor_hours!==null)errors.push('unsourced or fabricated observed cost');
 if(data?.live_network?.minimum_recommended_bandwidth_headroom_fraction!==0.20)errors.push('incorrect published planning headroom');
 if(data?.creator_cost_records?.length||!data?.unmeasured||Object.values(data.unmeasured).some(v=>v!==null))errors.push('invented financial outcome');
 return {valid:errors.length===0,errors};
}
