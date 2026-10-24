// Pure, unit-guarded descriptive source concentration calculations.
// These only evaluate supplied disjoint COMPLETE owner-Analytics source rows.
// Valid arithmetic alone does not establish causal or economic resilience.
export function auditTrafficConcentration(input={}) {
 const errors=[];
 if(input.owner_authorized!==true)errors.push('Missing authorized owner-data confirmation');
 if(input.complete_partition!==true)errors.push('Unknown or incomplete source partition');
 if(typeof input.period!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}[.][.][0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.period))
  errors.push('Missing bounded observation period');
 if(input.unit!=='view_events')errors.push('Mixed or unsupported traffic units');
 if(typeof input.channel_scope!=='string'||!input.channel_scope.trim())errors.push('Missing channel scope');
 if(!Array.isArray(input.sources)||input.sources.length<2)errors.push('At least two distinct source classes are required');
 const seen=new Set(),rows=Array.isArray(input.sources)?input.sources:[];
 for(const row of rows){
  if(!row || typeof row.id!=='string'||!row.id.trim()||seen.has(row.id))errors.push('Duplicate or missing source id');
  else seen.add(row.id);
  if(!Number.isSafeInteger(row?.views)||row.views<0)errors.push('Each source count must be a nonnegative integer');
 }
 if(input.includes_direct_unknown!==true)errors.push('Unknown/direct source reporting must be explicit');
 if(input.includes_paid_sources!==true)errors.push('Paid traffic included or explicitly zero required');
 if(errors.length)return {status:'invalid',errors,metrics:null};
 const total=rows.reduce((s,x)=>s+x.views,0);
 if(!Number.isSafeInteger(total)||total<=0)return {status:'invalid',errors:['Total views must be positive and safe'],metrics:null};
 const fractions=rows.map(x=>x.views/total);
 const hhi=fractions.reduce((s,v)=>s+v*v,0);
 const dominant=Math.max(...fractions);
 return {status:'descriptive_only',errors:[],metrics:{total_views:total,source_count:rows.length,largest_source_share:dominant,hhi,effective_source_count:1/hhi},
  limitation:'The shares describe attributed view events for one owner-supplied window, not owned audience, income, causal exposure or future risk.'};
}
