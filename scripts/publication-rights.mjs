// Automated metadata and asset-manifest checks. No automated legal clearance.
export function auditPublicationRights(sources,claims,policy){
  const errors=[];
  if(!Array.isArray(sources)||!Array.isArray(claims))return {metadata_valid:false,release_cleared:false,errors:['Invalid source or claim collection']};
  const ids=new Set();
  for(const src of sources){
    if(!src?.id||ids.has(src.id))errors.push('Missing or duplicate source ID');
    ids.add(src.id);
    if(typeof src.url!=='string'||!src.url.startsWith('https://'))errors.push('Invalid source URL: '+src.id);
    for(const field of ['title','publisher','license','retrieved_at'])
      if(typeof src[field]!=='string'||!src[field].trim())errors.push('Missing source '+field+': '+src.id);
    if(typeof src.retrieved_at==='string'&&!/^\d{4}-\d{2}-\d{2}$/.test(src.retrieved_at))
      errors.push('Invalid retrieval date: '+src.id);
  }
  for(const claim of claims){
    if(!claim?.id||!Array.isArray(claim.source_ids)||claim.source_ids.length===0)
      errors.push('Unattributed claim: '+(claim?.id||'?'));
    else if(claim.source_ids.some(id=>!ids.has(id)))errors.push('Missing cited source: '+claim.id);
    if(typeof claim?.limitations!=='string'||!claim.limitations.trim())
      errors.push('Missing claim scope/limitations: '+(claim?.id||'?'));
  }
  if(!policy||!Array.isArray(policy.third_party_asset_manifest))
    errors.push('Missing publication asset manifest');
  const seen=new Set();
  for(const item of policy?.third_party_asset_manifest||[]){
    if(!item.path||seen.has(item.path))errors.push('Missing/duplicate asset path');seen.add(item.path);
    if(!['externally_licensed','permission_granted','original_owned','third_party_excerpt'].includes(item.rights_basis))
      errors.push('Unclear asset rights basis: '+item.path);
    if(item.rights_basis!=='original_owned'){
      if(!item.source_id||!ids.has(item.source_id))errors.push('Unregistered asset source: '+item.path);
      if(item.review_confirmed!==true)errors.push('Unreviewed third-party asset: '+item.path);
      for(const k of ['licensor','source_url','license_or_permission_note'])
        if(typeof item[k]!=='string'||!item[k].trim())errors.push('Missing '+k+' for '+item.path);
      if(item.rights_basis==='externally_licensed'&&!item.license_url)
        errors.push('Missing actual license URL: '+item.path);
    }
  }
  const metadata_valid=errors.length===0;
  // An empty manifest is not evidence that the repository has zero third-party assets.
  const release_cleared=metadata_valid&&policy?.manual_repository_review?.completed===true &&
    policy?.manual_repository_review?.checked_all_media_files===true&&
    policy?.manual_repository_review?.checked_quoted_text===true;
  return {metadata_valid,release_cleared,requires_manual_review:!release_cleared,
    source_references:sources.length,attributed_claims:claims.length,
    registered_third_party_assets:(policy?.third_party_asset_manifest||[]).filter(x=>x.rights_basis!=='original_owned').length,
    errors};
}
