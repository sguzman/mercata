// Static distribution-channel plan check only. This does not build or upload games.
const valid=x=>Number.isSafeInteger(x)&&x>=0;
export function auditDistributionPlan(plan){
 if(!plan||!Array.isArray(plan.channels))throw new TypeError('Channels array required');
 const seen=new Set(),errors=[];
 for(const c of plan.channels){
  if(!c||typeof c.channel!=='string'||!(/^[a-z0-9][a-z0-9_-]*$/).test(c.channel))
   throw new TypeError('Invalid channel name');
  if(seen.has(c.channel))errors.push('duplicate_channel:'+c.channel);
  seen.add(c.channel);
  if(!valid(c.uncompressed_bytes))throw new TypeError('Safe nonnegative uncompressed byte count required');
  if(c.uncompressed_bytes>30000000000)errors.push('oversize_build:'+c.channel);
  if(!['linux','windows','macos','html5','other'].includes(c.platform))
   errors.push('unclassified_platform:'+c.channel);
 }
 return {static_manifest_ok:errors.length===0,errors,channels_checked:plan.channels.length,
   actual_builds_uploaded:null,executables_tested:null,linux_runtime_compatible:null,
   hours_required:null,potential_sales:null};
}
