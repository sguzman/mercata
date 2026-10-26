// General component audit, not legal advice, not legal clearance for a real game.
const KNOWN=new Set(['MIT','Apache-2.0','GPL-3.0','CC-BY-4.0','CC-BY-NC-4.0']);
export function assessItchGameLicenseInventory(components){
 if(!Array.isArray(components)||components.length===0)throw new TypeError('Nonempty component inventory required');
 const issues=[],blocked=[],ids=new Set();
 for(const part of components){
  if(!part||typeof part.id!=='string'||!part.id.trim()||ids.has(part.id))throw new TypeError('Unique nonempty component IDs required');
  ids.add(part.id);
  if(!['code','media'].includes(part.kind))throw new TypeError('Component kind must be code or media');
  if(!KNOWN.has(part.license)){issues.push(part.id+': unknown license or unlisted license family requires legal review');continue;}
  if(part.license==='CC-BY-NC-4.0'){
   if(part.alternative_commercial_permission_verified===true)issues.push(part.id+': separate permission terms must be checked manually');
   else blocked.push(part.id+': standard noncommercial grant excludes ordinary paid game commercialization');
   continue;
  }
  if((part.kind==='code'&&part.license.startsWith('CC-'))||(part.kind==='media'&&!part.license.startsWith('CC-'))){
   issues.push(part.id+': license/component fit requires manual review');
  }
  if(part.required_notices_verified!==true)issues.push(part.id+': notices/attribution incomplete or not verified');
  if(part.license==='GPL-3.0'){
   if(part.corresponding_source_delivery_verified!==true)issues.push(part.id+': source delivery not verified');
   issues.push(part.id+': GPL combination and redistribution review remains necessary');
  }
 }
 return {blocked_components:blocked,review_issues:issues,
  plausible_standard_permission_path:blocked.length===0&&issues.length===0,
  certified_legal_compliance:false,platform_approved_release:false,real_game_verified:false,
  creator_profit_usd:null,paid_order_count:null,
  message:'Source licenses are component-specific and cannot authorize a whole game without review of its exact asset tree and obligations.'};
}
