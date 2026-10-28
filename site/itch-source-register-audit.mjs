// Strict Gregorian checks; a YYYY-MM precision source remains month-precision.
// A fragment never changes the fetched HTTP document; hostname case and :443 do not either.
// Keep query strings and paths unchanged because they can identify different documents.
export function publicSourceDocumentKey(input) {
 if(typeof input!=='string')throw new TypeError('Public source URL required');
 let u;
 try {u=new URL(input)}catch {throw new TypeError('Invalid public source URL')}
 if(u.protocol!=='https:'||!u.hostname||u.username||u.password)
  throw new TypeError('Public HTTPS source URL required');
 u.hash='';
 return u.href;
}
const actualDay=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const actualMonth=x=>typeof x==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
export function auditItchSourceRegister(specimen){
 if(!specimen||!Array.isArray(specimen.evidence)||!Array.isArray(specimen.claims))throw new TypeError('Source and claim arrays required');
 const issues=[],ids=new Set(),claims=new Set(),sources=new Map(),documentKeys=new Map();
 const required=['id','url','title','publisher','retrieved_at','evidence_class','license'];
 for(const e of specimen.evidence){
  for(const k of required)if(typeof e[k]!=='string'||!e[k].trim())issues.push('Missing or blank source '+k+' for '+(e.id||'?'));
  if(ids.has(e.id))issues.push('Duplicate source identifier');
  ids.add(e.id);sources.set(e.id,e);
  if(!actualDay(e.retrieved_at))issues.push('Bad retrieval date');
  if(e.published_at!==null&&e.published_at!==undefined){
   if(!actualDay(e.published_at)&&!actualMonth(e.published_at))issues.push('Bad publication date');
   else if(actualDay(e.retrieved_at)&&
     (e.published_at.length===7?e.published_at>e.retrieved_at.slice(0,7):e.published_at>e.retrieved_at))
    issues.push('Publication cannot occur after retrieval date');
  }
  if(typeof e.url==='string'){
   if(!/^https:\/\//.test(e.url))issues.push('Non-HTTPS source URL');
   try{documentKeys.set(e.id,publicSourceDocumentKey(e.url))}
   catch{issues.push('Invalid public source URL')}
  }
 }
 for(const c of specimen.claims){
  if(typeof c.id!=='string'||!c.id.trim()||claims.has(c.id))issues.push('Missing or repeated claim id');claims.add(c.id);
  if(!Array.isArray(c.source_ids)||!c.source_ids.length||c.source_ids.some(x=>!ids.has(x)))issues.push('Unregistered claim source');
  if(Array.isArray(c.source_ids)){
   const urls=c.source_ids.map(id=>documentKeys.get(id)).filter(Boolean);
   if(new Set(urls).size!==urls.length)issues.push('Claim cites one public URL through multiple evidence IDs');
  }
  if(!actualDay(c.observed_at))issues.push('Bad claim observation date');
  else if(Array.isArray(c.source_ids)&&c.source_ids.some(id=>sources.has(id)&&actualDay(sources.get(id).retrieved_at)&&sources.get(id).retrieved_at>c.observed_at))
   issues.push('Claim cannot predate cited source retrieval');
 }
 const urlGroups=new Map();
 for(const entry of specimen.evidence)if(typeof entry.url==='string')
  urlGroups.set(entry.url,(urlGroups.get(entry.url)||0)+1);
 const duplicateUrlGroups=[...urlGroups.values()].filter(n=>n>1).length;
 return {valid:issues.length===0,issues,source_count:specimen.evidence.length,claim_count:specimen.claims.length,
  distinct_url_strings:urlGroups.size,duplicate_url_groups:duplicateUrlGroups,
  extra_alias_source_records:specimen.evidence.length-urlGroups.size,
  actual_redistribution_legal_clearance:null,marketwide_paid_seller_count:null,marketwide_income_estimate:null,
  note:'An attributed source record is not evidence of legal bulk redistribution rights or representative creator earnings.'};
}
