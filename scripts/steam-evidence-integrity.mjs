// Fail closed on Steam research evidence references, source joins and progress arithmetic.
// This checks public repository structure, not the factual truth of cited research.
import fs from 'node:fs';
import path from 'node:path';

// Source dates can have day or month precision; claims and retrievals need full days.
const validDay = x => {
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const d=new Date(x+'T00:00:00Z');
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===x;
};
const validMonth = x => typeof x==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
const nonempty = x=>typeof x==='string'&&x.trim().length>0;
const fileRef = x => typeof x === 'string' && !!x && x === x.trim() &&
 !x.includes('\\') && !x.includes(String.fromCharCode(0)) &&
 !path.posix.isAbsolute(x) && !/^[A-Za-z]:/.test(x) &&
 !x.split('/').some(s=>s === '' || s === '.' || s === '..') &&
 path.posix.normalize(x) === x;

export function auditSteamEvidenceIntegrity(plan, queue, dossier, root=process.cwd()){
 if(!plan||!queue||!dossier||!Array.isArray(plan.detail_tasks)||
   !Array.isArray(queue.queues)||!Array.isArray(dossier.evidence)||!Array.isArray(dossier.claims))
   throw new TypeError('Steam plan, queue and dossier required');
 const baseline=queue.queues.flatMap(g=>g.tasks||[]);
 const tasks=[...plan.detail_tasks,...baseline],errors=[];
 if(plan.detail_tasks.length!==209||baseline.length!==84||tasks.length!==293)
  errors.push('Steam inventory must remain 209+84=293 tasks');
 const rootReal=fs.realpathSync(root),statCache=new Map(),allPaths=new Set();
 function isPresent(ref){
  if(statCache.has(ref))return statCache.get(ref);
  let ok=false;
  try{
   const absolute=path.resolve(rootReal,ref),resolved=fs.realpathSync(absolute);
   const relative=path.relative(rootReal,resolved);
   ok=relative!==''&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative)&&fs.statSync(resolved).isFile();
  }catch{}
  statCache.set(ref,ok);return ok;
 }
 const ids=new Set();let refs=0,sum=0,complete=0,partial=0,unstarted=0;
 for(const task of tasks){
  if(!task||!task.id||ids.has(task.id)){errors.push('Duplicate or malformed task ID');continue;}
  ids.add(task.id);
  const score=task.percent??task.progress;
  if(!Number.isInteger(score)||score<0||score>100){errors.push(task.id+': invalid progress');continue;}
  sum+=score;
  if(score===100){complete++;if(task.status!=='complete')errors.push(task.id+': completion without complete status');}
  else if(score===0)unstarted++;else partial++;
  if(!Array.isArray(task.evidence)){errors.push(task.id+': invalid evidence list');continue;}
  if(score>0&&task.evidence.length===0)errors.push(task.id+': scored without evidence');
  const seen=new Set();
  const refsToCheck=[...task.evidence];
  if(task.artifact!==null&&task.artifact!==undefined)refsToCheck.push(task.artifact);
  for(const ref of refsToCheck){
   refs++;
   if(!fileRef(ref)){errors.push(task.id+': unsafe evidence path');continue;}
   if(seen.has(ref)&&ref!==task.artifact)errors.push(task.id+': duplicate evidence path '+ref);
   seen.add(ref);allPaths.add(ref);
   if(!isPresent(ref))errors.push(task.id+': missing or outside-repository evidence path '+ref);
  }
 }
 const rounded=Math.round(sum/293);
 if(plan.progress_percent!==rounded)errors.push('Rounded Steam task progress does not match plan');
 for(const w of plan.workstreams||[]){
  const group=queue.queues.find(x=>x.id===w.id);
  if(!group){errors.push('Missing workstream '+w.id);continue;}
  const scores=[...plan.detail_tasks.filter(x=>x.queue_id===w.id).map(x=>x.percent),...group.tasks.map(x=>x.progress)];
  if(w.progress_percent!==Math.round(scores.reduce((a,b)=>a+b,0)/scores.length))
   errors.push('Workstream percent mismatch: '+w.id);
 }
 const sourceIds=new Set(),sourceUrls=new Set();
 for(const s of dossier.evidence){
  if(!s?.id||sourceIds.has(s.id))errors.push('Duplicate or missing source ID');
  if(!s?.url?.startsWith('https://')||sourceUrls.has(s.url))errors.push('Invalid or duplicate source URL');
  if(!nonempty(s?.title)||!nonempty(s?.publisher)||!nonempty(s?.evidence_class)||
     !nonempty(s?.license)||!nonempty(s?.notes))
   errors.push('Incomplete public source provenance: '+s?.id);
  if(!validDay(s?.retrieved_at))errors.push('Invalid source retrieved_at: '+s?.id);
  if(s?.published_at!==null&&!validDay(s?.published_at)&&!validMonth(s?.published_at))
   errors.push('Invalid source published_at: '+s?.id);
  if(validDay(s?.retrieved_at)&&
     (validDay(s?.published_at)&&s.published_at>s.retrieved_at||
      validMonth(s?.published_at)&&s.published_at>s.retrieved_at.slice(0,7)))
   errors.push('Source publication after retrieval: '+s?.id);
  sourceIds.add(s.id);sourceUrls.add(s.url);
 }
 const claimIds=new Set();
 for(const c of dossier.claims){
  if(!c?.id||claimIds.has(c.id))errors.push('Duplicate or missing claim ID');
  claimIds.add(c.id);
  if(!nonempty(c?.text)||!nonempty(c?.limitations)||!nonempty(c?.confidence))
   errors.push('Incomplete attributed claim: '+c?.id);
  if(!validDay(c?.observed_at))errors.push('Invalid claim observed_at: '+c?.id);
  if(!Array.isArray(c?.source_ids)||c.source_ids.length===0||c.source_ids.some(id=>!sourceIds.has(id)))
   errors.push('Unsourced claim: '+c?.id);
 }
 return {valid:errors.length===0,errors,task_count:tasks.length,complete,partial,unstarted,
  exact_percent:sum/293,rounded_percent:rounded,evidence_references:refs,distinct_evidence_files:allPaths.size,
  source_count:sourceIds.size,claim_count:claimIds.size,
  limitation:'References and score arithmetic are auditable; source validity, privacy suitability and economic completeness still require judgment.'};
}
