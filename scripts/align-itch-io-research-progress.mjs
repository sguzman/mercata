// Pure alignment of current itch.io task scores and the live synthesis fields.
// Task acceptance and individual evidence/status labels are never auto-awarded.
// Historic research checkpoint fields are not changed.
import {auditItchTaskScores} from './itch-task-score-audit.mjs';
const same=x=>JSON.parse(JSON.stringify(x));
function valid(t,field){
 const n=t[field];
 if(!Number.isInteger(n)||n<0||n>100)throw new RangeError('Invalid task score for '+t.id);
 if(t.status!==(n===100?'complete':'in_progress'))throw new Error('Task status disagrees with score: '+t.id);
}
export function alignItchLiveEvidenceProgress(originalPlan,queue,originalSynthesis,originalMarkdown){
 const p=same(originalPlan),s=same(originalSynthesis);
 if(p.specimen_id!=='itch-io'||queue.specimen_id!=='itch-io'||s.specimen_id!=='itch-io')
  throw new Error('Mismatched itch.io specimen identity');
 if(p.total_tracked_tasks!==244||p.detail_tasks?.length!==160||queue.queues?.length!==13||
   queue.queues.flatMap(w=>w.tasks||[]).length!==84)throw new Error('The fixed 244 task inventory has changed');
 if(!Array.isArray(p.workstreams)||p.workstreams.length!==13)throw new Error('Workstream summaries missing');
 const ids=new Set(),workstreamIds=new Set(),sums=new Map();
 for(const w of queue.queues){
  if(!w.id||workstreamIds.has(w.id))throw new Error('Duplicate workstream identifier');
  workstreamIds.add(w.id);sums.set(w.id,{total:0,n:0});
  for(const t of w.tasks){
   if(!t.id||ids.has('baseline:'+t.id))throw new Error('Duplicate baseline task');
   ids.add('baseline:'+t.id);valid(t,'progress');
   const v=sums.get(w.id);v.total+=t.progress;v.n++;
  }
 }
 for(const t of p.detail_tasks){
  if(!t.id||ids.has('detail:'+t.id))throw new Error('Duplicate detail task');
  ids.add('detail:'+t.id);
  if(!sums.has(t.queue_id))throw new Error('Unrecognized detail workstream');
  valid(t,'percent');
  const v=sums.get(t.queue_id);v.total+=t.percent;v.n++;
 }
 const summed=[...sums.values()].reduce((n,x)=>n+x.total,0),exact=summed/244,rounded=Math.round(exact);
 const seen=new Set();
 for(const w of p.workstreams){
  if(!sums.has(w.id)||seen.has(w.id))throw new Error('Missing or duplicate workstream summary');
  seen.add(w.id);
  const v=sums.get(w.id);
  w.progress_percent=Math.round(v.total/v.n);
 }
 p.progress_percent=rounded;
 const live=s.latest_evidence_summary;
 if(!live||live.tasks_original_fixed_count!==244)throw new Error('Missing fixed live research synthesis');
 live.task_mean_exact_percent=Number(exact.toFixed(6));
 live.task_mean_rounded_percent=rounded;
 if(typeof originalMarkdown!=='string')throw new TypeError('Human synthesis markdown must be a string');
 const tag=/\*\*\d+(?:\.\d+)?% exact, \d+% rounded\*\*/g;
 const matches=[...originalMarkdown.matchAll(tag)];
 if(matches.length!==1)throw new Error('Human synthesis requires exactly one current score anchor');
 const human=originalMarkdown.replace(tag,'**'+exact.toFixed(2)+'% exact, '+rounded+'% rounded**');
 auditItchTaskScores(p,queue,s);
 return {plan:p,synthesis:s,markdown:human,score:exact,rounded};
}
