// Public-dossier claim coverage and navigable source references.
export function auditGallerySourceCoverage(dossier){
 const source=new Map((dossier?.evidence||[]).map(x=>[x.id,x]));
 const problems=[];let refs=0,dated=0,limits=0;
 for(const claim of dossier?.claims||[]){
  if(typeof claim.text!=='string'||!claim.text.trim())problems.push('empty_claim');
  if(typeof claim.observed_at==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(claim.observed_at))dated++;
  else problems.push('claim_missing_date');
  if(typeof claim.limitations==='string'&&claim.limitations.trim())limits++;
  else problems.push('claim_missing_limits');
  if(!Array.isArray(claim.source_ids)||!claim.source_ids.length)problems.push('unsourced_claim');
  for(const id of claim.source_ids||[]){
   refs++;
   const s=source.get(id);
   if(!s)problems.push('unknown_source_id:'+id);
   else if(typeof s.url!=='string'||!s.url.startsWith('https://'))problems.push('non_https_source:'+id);
  }
 }
 for(const s of dossier?.evidence||[]){
  if(!s.id||typeof s.retrieved_at!=='string')problems.push('incomplete_source_provenance');
 }
 return {valid:problems.length===0,problems,source_count:source.size,
   claim_count:dossier?.claims?.length??0,claim_source_reference_count:refs,
   dated_claims:dated,claims_with_limitations:limits,
   browser_rendered_links_verified:false,unknown_values_verified_in_browser:false};
}
