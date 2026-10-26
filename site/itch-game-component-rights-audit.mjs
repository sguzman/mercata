const kinds=new Set(['code_library','engine_or_middleware','font','sprite_or_artwork','music_or_sound','narrative_or_trademark']);
function present(v){return typeof v==='string'&&v.trim().length>0;}
export function auditItchGameComponentRights(rows){
 if(!Array.isArray(rows))throw new TypeError('Game component rows must be an array');
 const issues=[],seen=new Set();
 if(rows.length===0)issues.push('No components supplied: cannot declare rights clearance for any game');
 for(const [i,row] of rows.entries()){
  if(!row||!present(row.component_id)||seen.has(row.component_id)){issues.push('Missing/duplicate component id at '+i);continue;}
  seen.add(row.component_id);
  if(!kinds.has(row.asset_kind))issues.push('Unknown asset kind '+row.component_id);
  for(const key of ['origin_url','creator_or_copyright_holder','license_id','version_or_asset_identity']){
   if(!present(row[key]))issues.push('Missing '+key+' for '+row.component_id);
  }
  if(row.distributed_in_release!==true && row.distributed_in_release!==false)issues.push('Distribution state unverified '+row.component_id);
  if(row.distributed_in_release===true){
   if(row.commercial_distribution_grant_verified!==true)issues.push('Commercial redistribution not verified for '+row.component_id);
   if(!present(row.notice_file_or_embedded_license))issues.push('Missing notice or license record for '+row.component_id);
   if(row.license_id==='CC-BY-NC-4.0'&&row.separate_commercial_permission_verified!==true)issues.push('Noncommercial asset requires separate commercial permission '+row.component_id);
   if(row.asset_kind==='font'&&row.license_id==='OFL-1.1'&&row.modification_state==='modified'&&row.reserved_font_name_used===true&&row.reserved_font_name_permission_verified!==true)issues.push('Modified OFL font uses reserved name without license-holder permission '+row.component_id);
   if(row.license_id==='GPL-3.0'&&row.corresponding_source_distribution_reviewed!==true)issues.push('GPL source delivery review missing '+row.component_id);
  }
 }
 return {inventory_documented:rows.length>0,manifest_gaps:issues,meets_pre_release_inventory_gate:issues.length===0,
  legal_clearance_certified:false,marketplace_listing_approved:false,real_game_buyer_count:null,license_compliance_cost_usd:null};
}
