export function auditItchSourceRegister(specimen){
 if(!specimen||!Array.isArray(specimen.evidence)||!Array.isArray(specimen.claims))throw new TypeError('Source and claim arrays required');
 const issues=[],ids=new Set(),claims=new Set();
 const required=['id','url','title','publisher','retrieved_at','evidence_class','license'];
 for(const e of specimen.evidence){
  for(const k of required)if(typeof e[k]!=='string'||!e[k].trim())issues.push('Missing or blank source '+k+' for '+(e.id||'?'));
  if(ids.has(e.id))issues.push('Duplicate source identifier');
  ids.add(e.id);
  if(typeof e.retrieved_at==='string'&&!/^\d{4}-\d{2}-\d{2}$/.test(e.retrieved_at))issues.push('Bad retrieval date');
  if(e.published_at!==null&&e.published_at!==undefined&&(typeof e.published_at!=='string'||!/^\d{4}-\d{2}(?:-\d{2})?$/.test(e.published_at)))issues.push('Bad publication date');
  if(typeof e.url==='string'&&!/^https:\/\//.test(e.url))issues.push('Non-HTTPS source URL');
 }
 for(const c of specimen.claims){
  if(typeof c.id!=='string'||!c.id.trim()||claims.has(c.id))issues.push('Missing or repeated claim id');claims.add(c.id);
  if(!Array.isArray(c.source_ids)||!c.source_ids.length||c.source_ids.some(x=>!ids.has(x)))issues.push('Unregistered claim source');
 }
 return {valid:issues.length===0,issues,source_count:specimen.evidence.length,claim_count:specimen.claims.length,
  actual_redistribution_legal_clearance:null,marketwide_paid_seller_count:null,marketwide_income_estimate:null,
  note:'An attributed source record is not evidence of legal bulk redistribution rights or representative creator earnings.'};
}
