export function canAggregatePayoutWindows(model, selectedIds) {
 if(!Array.isArray(selectedIds) || selectedIds.length<2 || new Set(selectedIds).size!==selectedIds.length){
   return {allowed:false,reason:'Requires distinct payment observations'};
 }
 const rows=selectedIds.map(id=>model.reported_windows.find(x=>x.id===id));
 if(rows.some(x=>!x))return {allowed:false,reason:'Unknown payment observation'};
 // Rolling/undefined windows cannot be asserted disjoint. Music is a subset of global payees.
 if(rows.some(x=>!x.reporting_window_start || !x.reporting_window_end))
   return {allowed:false,reason:'Unbounded rolling four-year statement'};
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++) {
   if(rows[i].reporting_window_start<=rows[j].reporting_window_end &&
      rows[j].reporting_window_start<=rows[i].reporting_window_end)
     return {allowed:false,reason:'Overlapping payout periods'};
   if(rows[i].population!==rows[j].population)
     return {allowed:false,reason:'Non-disjoint payout recipient populations'};
 }
 return {allowed:false,reason:'Company-disclosed approximate payout thresholds are not additive precise cash accounts'};
}
export function inferIndividualPayout(model) {
 if(model.unmeasured.actual_payee_count===null || model.unmeasured.unique_recipients_across_periods===null ||
    model.unmeasured.payout_mean===null) return {allowed:false,mean:null,median:null};
 return {allowed:false,mean:null,median:null};
}
