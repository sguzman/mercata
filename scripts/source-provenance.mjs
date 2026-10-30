// Public source metadata audit. Does not fetch external pages or assess truth of claims.
// Discard localization/tracking decoration without discarding country, version, or study selectors.
export function canonicalSourceUrl(value){
  if(typeof value!=='string')return '';
  try{
    const url=new URL(value.trim());
    if(url.protocol!=='https:')return '';
    url.hash='';
    if(url.pathname!=='/')url.pathname=url.pathname.replace(/\/+$/,'');
    const selectors=[...url.searchParams.entries()]
      .filter(([key])=>!/^utm_/i.test(key)&&!['hl','fbclid','gclid','mc_cid','mc_eid'].includes(key.toLowerCase()))
      .sort(([ak,av],[bk,bv])=>ak.localeCompare(bk)||av.localeCompare(bv));
    url.search='';
    for(const [key,entryValue] of selectors)url.searchParams.append(key,entryValue);
    return url.href.replace(/\/$/,'');
  }catch{return ''}
}

export function auditPublicSources(evidence,claims,registry){
  if(!Array.isArray(evidence)||!Array.isArray(claims)||!Array.isArray(registry?.families))
    throw Error('Source audit expects evidence, claims and source-family registry.');
  const byId=new Map(),byUrl=new Map();
  for(const source of evidence){
    if(!source.id||byId.has(source.id))throw Error('Duplicate/missing source ID: '+source.id);
    if(!/^https:\/\//.test(source.url)||!source.publisher||!source.retrieved_at)
      throw Error('Incomplete source provenance for '+source.id);
    byId.set(source.id,source);
    const canonical=canonicalSourceUrl(source.url);
    if(!canonical)throw Error('Invalid HTTPS source URL for '+source.id);
    const ids=byUrl.get(canonical)||[];
    ids.push(source.id);
    byUrl.set(canonical,ids);
  }
  const missingClaimSources=[];
  for(const claim of claims){
    if(!Array.isArray(claim.source_ids)||!claim.source_ids.length)
      throw Error('Claim missing source IDs: '+claim.id);
    for(const id of claim.source_ids)if(!byId.has(id))missingClaimSources.push({claim:claim.id,source_id:id});
  }
  const duplicateDocuments=[...byUrl.entries()].filter(([url,ids])=>ids.length>1)
    .map(([url,ids])=>({url,source_ids:[...ids].sort()}))
    .sort((a,b)=>a.url.localeCompare(b.url));
  const familyIds=new Set(),registeredDuplicates=new Set(),invalidFamilies=[];
  for(const f of registry.families){
    if(!f.id||familyIds.has(f.id))throw Error('Missing or duplicate source-family ID');
    familyIds.add(f.id);
    const ids=[...f.source_ids||[]];
    if(ids.length<2||new Set(ids).size!==ids.length||ids.some(id=>!byId.has(id))){
      invalidFamilies.push(f.id);continue;
    }
    if(f.relation==='same_normalized_document_url'){
      const urls=new Set(ids.map(id=>canonicalSourceUrl(byId.get(id).url)));
      if(urls.size!==1){invalidFamilies.push(f.id);continue}
      const canonical=[...urls][0];
      const actual=byUrl.get(canonical)||[];
      if(actual.length!==ids.length||actual.some(id=>!ids.includes(id))){invalidFamilies.push(f.id);continue}
      registeredDuplicates.add(canonical);
    }else if(f.relation==='same_underlying_survey_different_urls'||f.relation==='same_underlying_dataset_different_urls'){
      if(new Set(ids.map(id=>canonicalSourceUrl(byId.get(id).url))).size<2)
        invalidFamilies.push(f.id);
    }else invalidFamilies.push(f.id);
  }
  return {
    source_references:evidence.length,
    claims:claims.length,
    distinct_normalized_urls:byUrl.size,
    duplicate_document_families:duplicateDocuments,
    registered_shared_source_families:registry.families.length,
    unregistered_duplicate_documents:duplicateDocuments.filter(x=>!registeredDuplicates.has(x.url)),
    invalid_source_family_records:invalidFamilies,
    missing_claim_sources:missingClaimSources,
    undated_publication_references:evidence.filter(s=>s.published_at===null).length,
    missing_retrieval_dates:evidence.filter(s=>!s.retrieved_at).map(s=>s.id),
    inferred_independent_studies:null
  };
}
