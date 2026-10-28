// Fail closed on dangling, malformed, repeated or out-of-repository itch.io task evidence.
// The public task ledger may cite 0%-100% research work, but cited files must exist at every score.
import fs from 'node:fs';
import path from 'node:path';

function validRelativeFile(value) {
 return typeof value==='string' && value.length>0 && value===value.trim() &&
  !value.includes('\\') && !value.includes(String.fromCharCode(0)) && !path.posix.isAbsolute(value) &&
  !/^[A-Za-z]:/.test(value) && !value.split('/').some(s=>s===''||s==='.'||s==='..') &&
  path.posix.normalize(value)===value;
}

export function auditItchTaskEvidenceLinks(plan,queue,root=process.cwd()) {
 if(!plan||!queue||!Array.isArray(plan.detail_tasks)||!Array.isArray(queue.queues)||
    queue.queues.some(g=>!Array.isArray(g.tasks)))throw new TypeError('Plan and queue task arrays required');
 const tasks=plan.detail_tasks.concat(queue.queues.flatMap(g=>g.tasks));
 if(tasks.length!==244||plan.detail_tasks.length!==160)throw new TypeError('Original 244-task population required');
 const realRoot=fs.realpathSync(root),errors=[],distinct=new Set(),statCache=new Map();
 let refs=0;
 function present(ref) {
  if(statCache.has(ref))return statCache.get(ref);
  let valid=false;
  try {
   const absolute=path.resolve(realRoot,ref);
   const rel=path.relative(realRoot,absolute);
   const resolved=fs.realpathSync(absolute);
   const safeRel=path.relative(realRoot,resolved);
   valid=rel!==''&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel)&&
    safeRel!==''&&!safeRel.startsWith('..'+path.sep)&&!path.isAbsolute(safeRel)&&
    fs.statSync(absolute).isFile();
  } catch {}
  statCache.set(ref,valid);return valid;
 }
 for(const task of tasks){
  if(!task||typeof task.id!=='string'||!Array.isArray(task.evidence)){
   errors.push('Malformed task evidence record');continue;
  }
  const seen=new Set(),percent=task.percent??task.progress;
  if(percent>0&&task.evidence.length===0)errors.push(task.id+': positive score without evidence');
  for(const ref of task.evidence){
   refs++;
   if(!validRelativeFile(ref)){errors.push(task.id+': unsafe or malformed evidence path');continue;}
   if(seen.has(ref))errors.push(task.id+': duplicate evidence reference '+ref);
   seen.add(ref);distinct.add(ref);
   if(!present(ref))errors.push(task.id+': missing or out-of-repository evidence '+ref);
  }
 }
 return {valid:errors.length===0,errors,total_tasks:tasks.length,evidence_refs:refs,
  distinct_evidence_files:distinct.size,missing_or_unsafe_references:errors.length,
  note:'Cited files exist locally; this check does not establish the factual accuracy or source permissions of their contents.'};
}
