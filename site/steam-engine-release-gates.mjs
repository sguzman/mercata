// Research-only QA gate. Evaluates synthetic/provided statuses without running a build.
export const STEAM_ENGINE_GATES=Object.freeze(['pc_export','target_os_smoke_test','depot_entitlement','launch_configuration','save_roundtrip','steam_api_graceful_fallback','input_readability','patch_delta_audit']);
const STATUSES=new Set(['pass','fail','unverified']);
export function assessSteamReleaseReadiness(result){
 if(!result||typeof result!=='object'||Array.isArray(result))throw new TypeError('A gate-result object is required');
 const checks={};const failed=[],unverified=[];
 for(const gate of STEAM_ENGINE_GATES){
  const status=result[gate]??'unverified';
  if(!STATUSES.has(status))throw new TypeError('Unknown gate status: '+gate);
  checks[gate]=status;
  if(status==='fail')failed.push(gate);
  if(status==='unverified')unverified.push(gate);
 }
 return {ready_for_release:failed.length===0&&unverified.length===0,checks,failed,unverified,
  commercial_success_probability:null,verified_developer_profit:null,
  note:'Paper checklist does not replace game/device testing or retailer acceptance.'};
}
