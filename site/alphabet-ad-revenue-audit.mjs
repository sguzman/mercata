const ms = stamp => Number(stamp.slice(5,7));
export function compareReportingPeriods(model, priorId, nextId) {
 const prior=model.observations.find(x=>x.id===priorId);
 const next=model.observations.find(x=>x.id===nextId);
 if(!prior || !next)throw Error('Unknown observation');
 if(prior.period_kind!==next.period_kind || prior.period_months!==next.period_months ||
    prior.period_start.slice(5)!==next.period_start.slice(5) || prior.period_end.slice(5)!==next.period_end.slice(5) ||
    next.year-prior.year!==1)throw Error('Incompatible revenue windows: compare matched year-on-year periods only');
 if(prior.value_usd_millions<=0 || next.value_usd_millions<0)throw Error('Invalid accounting values');
 return {prior_id:prior.id,next_id:next.id,kind:prior.period_kind,unit:'percent_change_in_reported_ad_revenue',
   percent:(next.value_usd_millions/prior.value_usd_millions-1)*100,
   creator_payout: null, unique_people: null};
}
export function sumNonoverlappingPeriods(model, ids) {
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length) throw Error('Expected distinct revenue observations');
 const rows=ids.map(id=>{const r=model.observations.find(x=>x.id===id);if(!r)throw Error('Unknown observation');return r;});
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
   if(rows[i].period_start<=rows[j].period_end && rows[j].period_start<=rows[i].period_end)
     throw Error('Overlapping financial reporting periods');
 }
 return {amount_usd_millions:rows.reduce((n,x)=>n+x.value_usd_millions,0),
   unit:'corporate_advertising_revenue_not_creator_payouts',creator_income:null};
}
export function inferCreatorPayFromAdRevenue(model) {
 // SEC advertising revenue has no channel-level receipt distribution or all-creator sampling denominator.
 if(model.accounts_basis !== 'verified_creator_receipts_with_population_and_zero_earners') {
   return {allowed:false, creator_median_income:null};
 }
 return {allowed:true, creator_median_income:null};
}
