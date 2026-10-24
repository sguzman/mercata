export function auditExclusiveRights(m,sources){
 const errors=[];
 if(m?.kind!=='exclusive_claim_rights_vs_nonexclusive_upload_license'||m?.platform!=='youtube')errors.push('identity');
 if(m?.scopes?.length!==5)errors.push('coverage');
 for(const x of m?.scopes||[]){
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('unsourced right');
  if(x.id!=='owned_original'&&x.content_id_reference!=='not_eligible')errors.push('false exclusivity');
  if(x.rights_contract_sample!==null||x.observed_creator_royalties!==null)errors.push('invented creator contract');
 }
 if(m?.service_licence?.nonexclusive!==true||m?.service_licence?.retains_owned_copyright!==true||m?.service_licence?.creator_entitled_to_payment_by_terms_alone!==false)errors.push('wrong platform license');
 if(m?.content_id?.requires_exclusive_reference_rights!==true||m?.content_id?.exclusive_rights_by_territory!==true)errors.push('wrong Content ID rights');
 if(m?.observed_contracts?.length||!m?.unmeasured||Object.values(m.unmeasured).some(x=>x!==null))errors.push('unknowns invented');
 return {valid:errors.length===0,errors};
}
