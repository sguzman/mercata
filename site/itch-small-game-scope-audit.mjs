// Offline descriptive QA report, not an empirical game-market estimator.
const acceptedDevice=new Set(['desktop','laptop','phone','tablet','handheld']);
const acceptedInput=new Set(['keyboard_mouse','gamepad','touchscreen']);
export function auditItchSmallGameScope({mechanics,runs,buildId}={}){
 if(!Array.isArray(mechanics)||!Array.isArray(runs)||typeof buildId!=='string'||!buildId.trim())throw new TypeError('Mechanics, QA runs and build ID required');
 const issues=[],seenMechanics=new Set(),seenSessions=new Set(),values=[];
 for(const [i,m] of mechanics.entries()){
  if(typeof m!=='string'||!m.trim()||seenMechanics.has(m)){issues.push('Missing or duplicate mechanic '+i);continue;}
  seenMechanics.add(m);
 }
 for(const [i,r] of runs.entries()){
  if(!r||typeof r.session_id!=='string'||!r.session_id.trim()||seenSessions.has(r.session_id)||r.build_id!==buildId||!acceptedDevice.has(r.device)||!acceptedInput.has(r.input)||typeof r.completed!=='boolean'||r.source_verified!==true||typeof r.play_duration_minutes!=='number'||!Number.isFinite(r.play_duration_minutes)||r.play_duration_minutes<0){
   issues.push('Invalid or repeated play session '+i);continue;
  }
  seenSessions.add(r.session_id);
  if(r.completed)values.push(r.play_duration_minutes);
 }
 values.sort((a,b)=>a-b);
 const valid=issues.length===0;
 const middle=Math.floor(values.length/2);
 const median=values.length%2===0?(values[middle-1]+values[middle])/2:values[middle];
 return {valid,issues,declared_core_mechanic_count:valid?seenMechanics.size:null,
  completed_qa_sessions:valid?values.length:null,descriptive_duration_minutes:
  valid&&values.length>=3?{minimum:values[0],median,maximum:values[values.length-1]}:null,
  proposed_scope_mechanic_count_met:valid?seenMechanics.size>=1&&seenMechanics.size<=2:null,
  proposed_scope_5_to_30_minute_median_met:valid&&values.length>=3?median>=5&&median<=30:null,
  market_valued_game_price:null,real_game_purchase_count:null,representative_player_duration:null,
  run_source_authenticity_independently_verified:false,
  note:'Caller-provided QA data are not authenticated. Playtime and mechanics are not verified willingness to pay.'};
}
