import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('itch.io inventory identity and research progress remain consistent',()=>{
 const gallery=load('gallery/index.json'),dossier=load('specimens/itch-io.json');
 const base=load('queues/itch-io.json'),plan=load('plans/itch-io.json'),vocab=load('ontology/itch-io/vocabulary.json');
 const row=gallery.specimens.find(x=>x.id==='itch-io');
 assert.equal(gallery.specimens.length,26);
 assert.equal(gallery.specimens.filter(x=>x.id==='itch-io').length,1);
 assert.equal(row.plan,'plans/itch-io.json');
 assert.equal(row.status,dossier.status);assert.equal(row.planning_state,'inventory_ready');
 assert(['queued','researching','review','published'].includes(dossier.status));assert.equal(dossier.color.hex,'#94DC4B');
 for(const prop of ['evidence','claims','observations','opportunities','risks','experiments'])assert(Array.isArray(dossier[prop]));
 assert.equal(base.queues.length,13);
 assert.equal(base.queues.flatMap(q=>q.tasks).length,84);
 assert(base.queues.every(q=>q.tasks.every(t=>Number.isInteger(t.progress)&&t.progress>=0&&t.progress<=100 && (t.progress===0 || t.evidence.length>0))));
 assert.equal(plan.baseline.base_task_count,84);assert.equal(plan.baseline.base_queue_count,13);
 assert.equal(plan.detail_task_count,plan.detail_tasks.length);assert(plan.detail_tasks.length>=120);
 assert.equal(plan.total_tracked_tasks,84+plan.detail_tasks.length);
 assert.equal(plan.status,dossier.status==='queued'?'inventory_ready':dossier.status);
 const allTasks=base.queues.flatMap(g=>g.tasks).map(t=>t.progress).concat(plan.detail_tasks.map(t=>t.percent));
 assert.equal(plan.progress_percent,Math.round(allTasks.reduce((a,n)=>a+n,0)/allTasks.length));
 assert.equal(plan.permission_required_before_execution,plan.status==='inventory_ready');
 assert.equal(plan.workstreams.length,13);assert.equal(plan.phases.length,4);
 assert.equal(new Set(plan.detail_tasks.map(t=>t.id)).size,plan.detail_task_count);
 assert.deepEqual(new Set(plan.phases.flatMap(p=>p.queue_ids)),new Set(base.queues.map(q=>q.id)));
 for(const w of plan.workstreams){
  const group=base.queues.find(g=>g.id===w.id);
  const detailed=plan.detail_tasks.filter(t=>t.queue_id===w.id);
  assert.equal(w.progress_percent,Math.round((group.tasks.reduce((n,t)=>n+t.progress,0)+detailed.reduce((n,t)=>n+t.percent,0))/(group.tasks.length+detailed.length)));
  assert.deepEqual(w.base_tasks,base.queues.find(q=>q.id===w.id).tasks.map(t=>t.id));
  assert.deepEqual(w.detail_tasks,plan.detail_tasks.filter(t=>t.queue_id===w.id).map(t=>t.id));
 }
 for(const t of plan.detail_tasks){
  assert(Number.isInteger(t.percent)&&t.percent>=0&&t.percent<=100);
  if(t.percent===0) assert.equal(t.status,'pending');
  else assert(t.evidence.length>0 && ['in_progress','complete'].includes(t.status));
  assert.equal(t.artifact,null);assert(t.acceptance.includes('source-linked'));
  assert(plan.phases.some(p=>p.id===t.phase && p.queue_ids.includes(t.queue_id)));
 }
 assert.equal(vocab.status,'definitions_only');assert.equal(vocab.research_started_at,null);
 assert(vocab.concepts.every(t=>t.observations.length===0&&t.source_ids.length===0));
});
