// The task inventory is immutable: evidence changes scores, not the denominator.
// Pure validation: no writes, network requests, synthetic success or new tasks.
const validScore=n=>Number.isInteger(n)&&n>=0&&n<=100;
function ensure(condition,message){if(!condition)throw new Error('itch.io task score: '+message);}
function verifiedTask(task,scope){
 ensure(task&&typeof task.id==='string'&&task.id.trim(),'missing '+scope+' task ID');
 const score=scope==='detail'?task.percent:task.progress;
 ensure(validScore(score),'invalid '+scope+' score for '+task.id);
 ensure(task.status===(score===100?'complete':'in_progress'),'inconsistent '+scope+' status for '+task.id);
 ensure(Array.isArray(task.evidence),'missing evidence array for '+task.id);
 return score;
}

export function auditItchTaskScores(plan,queue,synthesis){
 ensure(plan&&queue&&synthesis,'plan, queue and synthesis are required');
 ensure(plan.specimen_id==='itch-io'&&queue.specimen_id==='itch-io'&&synthesis.specimen_id==='itch-io','different specimen records');
 ensure(Array.isArray(plan.detail_tasks)&&plan.detail_tasks.length===160,'original 160 detail tasks must remain fixed');
 ensure(Array.isArray(queue.queues)&&queue.queues.length===13,'original 13 workstreams must remain fixed');
 const baseline=queue.queues.flatMap(w=>w.tasks||[]);
 ensure(baseline.length===84,'original 84 baseline tasks must remain fixed');
 ensure(plan.total_tracked_tasks===244&&plan.detail_task_count===160,'original 244-task inventory mismatch');
 const ids=new Set(),queueIds=new Set(),counts=new Map();
 for(const w of queue.queues){
  ensure(typeof w.id==='string'&&!queueIds.has(w.id),'duplicate or missing workstream ID');
  queueIds.add(w.id);counts.set(w.id,{sum:0,n:0});
  ensure(Array.isArray(w.tasks),'missing workstream tasks: '+w.id);
  for(const t of w.tasks){
   ensure(!ids.has('baseline:'+t.id),'duplicate baseline task: '+t.id);
   ids.add('baseline:'+t.id);
   const c=counts.get(w.id);c.sum+=verifiedTask(t,'baseline');c.n++;
  }
 }
 for(const t of plan.detail_tasks){
  ensure(!ids.has('detail:'+t.id),'duplicate detail task: '+t.id);
  ids.add('detail:'+t.id);
  ensure(queueIds.has(t.queue_id),'unknown detail workstream: '+t.id);
  const c=counts.get(t.queue_id);c.sum+=verifiedTask(t,'detail');c.n++;
 }
 const total=[...counts.values()].reduce((s,x)=>s+x.sum,0);
 const exact=total/244,rounded=Math.round(exact),sixDecimal=Number(exact.toFixed(6));
 ensure(Number.isInteger(plan.progress_percent)&&plan.progress_percent===rounded,'plan rounded score disagrees with tasks');
 ensure(Array.isArray(plan.workstreams)&&plan.workstreams.length===13,'missing workstream score summaries');
 const summaries=new Set();
 for(const w of plan.workstreams){
  ensure(counts.has(w.id)&&!summaries.has(w.id),'unknown or duplicate workstream score summary');
  summaries.add(w.id);
  const c=counts.get(w.id);
  ensure(w.progress_percent===Math.round(c.sum/c.n),'workstream score disagrees with tasks: '+w.id);
 }
 const summary=synthesis.latest_evidence_summary;
 ensure(summary&&summary.tasks_original_fixed_count===244,'synthesis fixed task count mismatch');
 ensure(summary.task_mean_exact_percent===sixDecimal,'synthesis exact score disagrees with task mean');
 ensure(summary.task_mean_rounded_percent===rounded,'synthesis rounded score disagrees with task mean');
 return {total_tasks:244,baseline_tasks:84,detail_tasks:160,score_sum:total,
  exact_percent:exact,six_decimal_percent:sixDecimal,rounded_percent:rounded,
  unfinished_tasks:baseline.filter(x=>x.progress<100).length+plan.detail_tasks.filter(x=>x.percent<100).length,
  workstream_count:13};
}
