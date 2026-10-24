// Structural accounting for overlapping unique-person audience groups.
// Input values are measured aggregates from a SINGLE common respondent frame.
// Returns no exact union without a verified direct overlap for exactly two groups.
export function assessAudienceUnion(input={}) {
  const errors=[];
  const groups=input.groups;
  if(!Array.isArray(groups)||groups.length<2) return {status:'invalid',errors:['At least two groups are required'],exact_union:null,bounds:null};
  const required=['frame_id','geography','period','sampling_method','unit'];
  const ref=groups[0];
  for(const field of required)if(typeof ref?.[field]!=='string'||!ref[field].trim())
    errors.push('Missing common-frame metadata: '+field);
  if(ref?.unit!=='unique_people')errors.push('Only unique-people observations can be unioned');
  for(let i=0;i<groups.length;i++){
    const g=groups[i];
    if(!g||!Number.isSafeInteger(g.count)||g.count<0)errors.push('Invalid group count at '+i);
    if(!Array.isArray(g?.source_ids)||!g.source_ids.length||g.source_ids.some(x=>typeof x!=='string'||!x.trim()))
      errors.push('Unattributed group at '+i);
    for(const field of required)if(g?.[field]!==ref?.[field])
      errors.push('Incompatible '+field+' for group '+i);
  }
  const N=input.population_size;
  if(N!==null&&N!==undefined&&(!Number.isSafeInteger(N)||N<0))
    errors.push('Population size must be a nonnegative integer or null');
  const hasPopulation=Number.isSafeInteger(N)&&N>=0;
  if(hasPopulation)groups.forEach((g,i)=>{if(Number.isSafeInteger(g?.count)&&g.count>N)errors.push('Group exceeds declared population at '+i);});
  if(errors.length)return {status:'invalid',errors,exact_union:null,bounds:null};
  const counts=groups.map(g=>g.count);
  const sum=counts.reduce((a,b)=>a+b,0);
  const lower=Math.max(...counts),upper=hasPopulation?Math.min(N,sum):sum;
  const overlap=input.overlap_count;
  const supplied=overlap!==null&&overlap!==undefined;
  let exact=null;
  if(supplied){
    if(groups.length!==2)return {status:'invalid',errors:['Pairwise overlap cannot determine union of three or more communities'],exact_union:null,bounds:null};
    if(!Number.isSafeInteger(overlap)||overlap<Math.max(0,hasPopulation?sum-N:0)||overlap>Math.min(...counts))
      return {status:'invalid',errors:['Overlap count violates intersection bounds'],exact_union:null,bounds:null};
    if(input.overlap_verified!==true||!Array.isArray(input.overlap_source_ids)||input.overlap_source_ids.length===0)
      return {status:'unverified_overlap',errors:['Overlap must be verified in the matched respondent frame and attributed to a source'],exact_union:null,bounds:{lower,upper}};
    exact=sum-overlap;
  }
  return {status:exact===null?'bounded_only':'measured_union',errors:[],exact_union:exact,bounds:{lower:exact??lower,upper:exact??upper},
    warning:exact===null?'No verified joint overlap; bounds must not be presented as an observed union.':null};
}
