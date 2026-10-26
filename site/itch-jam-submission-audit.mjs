// Offline requirements audit; does not submit a game or certify post-jam licenses.
const gates=new Set(['none','free_file','free_project']);
const aiRules=new Set(['none','disclosed','no_ai']);
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&x.endsWith('Z');
export function assessItchJamSubmission(jam,entry){
 if(!jam||!entry||!iso(jam.starts_at)||!iso(jam.ends_at)||!iso(entry.submitted_at))
  throw new TypeError('Jam and entry with UTC ISO timestamps required');
 if(!gates.has(jam.pricing_rule)||!aiRules.has(jam.ai_rule)||!['any','all'].includes(jam.platform_rule))
  throw new TypeError('Unknown jam submission requirement');
 if(!Array.isArray(jam.required_platforms)||!Array.isArray(entry.platforms)||!Array.isArray(entry.files))
  throw new TypeError('Platform and file evidence lists required');
 const failures=[],unknown=[];
 if(Date.parse(entry.submitted_at)<Date.parse(jam.starts_at)||Date.parse(entry.submitted_at)>Date.parse(jam.ends_at))
  failures.push('Submission outside standard jam entry window; host-issued late link not verified');
 if(jam.require_created_after_start===true){
  if(!iso(entry.created_at))unknown.push('Project creation time');
  else if(Date.parse(entry.created_at)<Date.parse(jam.starts_at))failures.push('Project created before jam start');
 }
 if(jam.require_first_upload_after_start===true){
  if(!iso(entry.first_file_uploaded_at))unknown.push('First upload time');
  else if(Date.parse(entry.first_file_uploaded_at)<Date.parse(jam.starts_at))failures.push('First game file uploaded before jam start');
 }
 const freeFile=entry.files.some(f=>f&&f.downloadable===true&&f.requires_payment===false);
 if(jam.pricing_rule==='free_file'&&!freeFile)failures.push('At least one free downloadable file required');
 if(jam.pricing_rule==='free_project'&&(entry.minimum_price_usd!==0||entry.files.some(f=>f.requires_payment===true)))
  failures.push('Fully free project with no paid files required');
 if(jam.no_prior_jam===true&&entry.prior_jam_submitted!==false) {
  if(entry.prior_jam_submitted===true)failures.push('Already submitted to another jam');
  else unknown.push('Prior jam history');
 }
 if(jam.ai_rule==='disclosed'&&entry.ai_use_disclosed!==true)failures.push('AI disclosure missing');
 if(jam.ai_rule==='no_ai'&&entry.ai_use_disclosed_no_ai!==true)failures.push('No-AI statement missing');
 const provided=new Set(entry.platforms);
 if(jam.required_platforms.includes('browser')&&entry.playable_html5!==true)
  failures.push('A browser platform needs a playable HTML5 game');
 if(jam.required_platforms.length) {
  const matched=jam.required_platforms.filter(x=>provided.has(x));
  if(jam.platform_rule==='all'&&matched.length!==jam.required_platforms.length)failures.push('Required platform builds are missing');
  if(jam.platform_rule==='any'&&matched.length===0)failures.push('None of the allowed platform builds is present');
 }
 const status=failures.length?'blocked':unknown.length?'unverified':'configured_eligible';
 return {status,failures,unknown,
  successful_live_submission:null,actual_game_quality_verified:false,
  rights_to_commercialize_after_jam:null,real_paid_game_orders:null,unique_paying_buyers:null,
  note:'Host eligibility only; individual event rules, actual submission and commercial licensing require separate verification.'};
}
