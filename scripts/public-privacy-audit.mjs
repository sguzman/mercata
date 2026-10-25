// Conservative public source/claim lint, not a complete privacy or legal clearance.
const sourceFields=new Set(['id','url','publisher','title','published_at','retrieved_at','evidence_class','license','notes']);
const claimFields=new Set(['id','text','source_ids','confidence','observed_at','limitations']);
const sensitiveKeys=new Set(['password','passphrase','private_key','api_key','access_token','refresh_token','session_token','cookie','email_address','personal_email','phone_number','ip_address','device_id','viewer_id','subscriber_id','customer_email','user_id','account_token']);
const patterns=[
 /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
 /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
 /\bsk-[A-Za-z0-9_-]{20,}\b/,
 /\bAIza[0-9A-Za-z_-]{35}\b/,
 /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];
export function auditPublicResearchPrivacy(sources,claims,policy){
 const errors=[];
 if(!Array.isArray(sources)||!Array.isArray(claims))return {metadata_safe:false,errors:['Research records not arrays']};
 const scan=(records,allowed,kind)=>{
  for(let i=0;i<records.length;i++){
   const o=records[i],label=kind+'['+i+']';
   if(!o||typeof o!=='object'||Array.isArray(o)){errors.push('Malformed public '+label);continue;}
   for(const [k,v] of Object.entries(o)){
    if(sensitiveKeys.has(k.toLowerCase()))errors.push('Sensitive metadata key in '+label+': '+k);
    if(!allowed.has(k))errors.push('Unreviewed public metadata key in '+label+': '+k);
    const strs=typeof v==='string'?[v]:Array.isArray(v)?v.filter(x=>typeof x==='string'):[];
    if(strs.some(s=>patterns.some(rx=>rx.test(s))))errors.push('Private-data signature in '+label+' field '+k);
   }
  }
 };
 scan(sources,sourceFields,'source');scan(claims,claimFields,'claim');
 if(policy?.kind!=='public_claim_source_record_privacy_lint'||policy?.privacy_clearance_established!==false||policy?.manual_release_review_completed!==false||policy?.repository_wide_private_data_proven_absent!==false)errors.push('Unsupported privacy-cleared assertion or missing policy');
 return {metadata_safe:errors.length===0,errors,source_count:sources.length,claim_count:claims.length,privacy_clearance_established:false,requires_manual_review:true};
}
