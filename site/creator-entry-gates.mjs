// Official YouTube creator-entry gate predicates. No account state or identity information stored.
export function evaluateCreatorEntryGate(protocol,action,flags,subscribers) {
 const gate=protocol.activity_gates.find(g=>g.id===action);
 if(!gate)return {status:'unsupported_action',missing:[],denied:[]};
 if(!flags||typeof flags!=='object'||Array.isArray(flags))return {status:'unknown',missing:[...gate.requires],denied:[]};
 if(gate.minimum_subscribers!==null && (!Number.isSafeInteger(subscribers)||subscribers<0))
   return {status:'unknown',missing:['subscriber_count'],denied:[]};
 const unknown=gate.requires.filter(f=>flags[f]!==true&&flags[f]!==false);
 const denied=gate.requires.filter(f=>flags[f]===false);
 if(gate.minimum_subscribers!==null&&subscribers<gate.minimum_subscribers)denied.push('subscriber_floor_'+gate.minimum_subscribers);
 if(unknown.length)return {status:'unknown',missing:unknown,denied};
 if(denied.length)return {status:'ineligible_by_stated_gates',missing:[],denied};
 return {status:'passes_documented_gates',missing:[],denied:[],actual_account_approved:null,
    actual_creator_cash:null,real_operating_cost:null};
}
export function assessNoNewPurchaseClaims(protocol,claim) {
 if(claim==='ordinary_publish_does_not_require_new_paid_software_or_equipment')
  return {supported:true,strictly_no_incremental_purchases_only:true,total_creator_cost:null};
 return {supported:false,total_creator_cost:null,reason:'not_supported_by_official_required_purchases'};
}
