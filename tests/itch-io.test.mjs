import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('itch.io inventory preserves its specimen and has no fabricated progress',()=>{
 const gallery=load('gallery/index.json'),dossier=load('specimens/itch-io.json');
 const base=load('queues/itch-io.json'),plan=load('plans/itch-io.json'),vocab=load('ontology/itch-io/vocabulary.json');
 const row=gallery.specimens.find(x=>x.id==='itch-io');
 assert.equal(gallery.specimens.length,26);
 assert.equal(gallery.specimens.filter(x=>x.id==='itch-io').length,1);
 assert.equal(row.plan,'plans/itch-io.json');
 assert.equal(row.status,'queued');assert.equal(row.planning_state,'inventory_ready');
 assert.equal(dossier.status,'queued');assert.equal(dossier.color.hex,'#94DC4B');
 for(const prop of ['evidence','claims','observations','opportunities','risks','experiments'])assert.deepEqual(dossier[prop],[]);
 assert.equal(base.queues.length,13);
 assert.equal(base.queues.flatMap(q=>q.tasks).length,84);
 assert(base.queues.every(q=>q.tasks.every(t=>t.progress===0 && t.status==='pending' && t.evidence.length===0)));
 assert.equal(plan.baseline.base_task_count,84);assert.equal(plan.baseline.base_queue_count,13);
 assert.equal(plan.detail_task_count,plan.detail_tasks.length);assert(plan.detail_tasks.length>=120);
 assert.equal(plan.total_tracked_tasks,84+plan.detail_tasks.length);
 assert.equal(plan.status,'inventory_ready');assert.equal(plan.progress_percent,0);
 assert.equal(plan.permission_required_before_execution,true);
 assert.equal(plan.workstreams.length,13);assert.equal(plan.phases.length,4);
 assert.equal(new Set(plan.detail_tasks.map(t=>t.id)).size,plan.detail_task_count);
 assert.deepEqual(new Set(plan.phases.flatMap(p=>p.queue_ids)),new Set(base.queues.map(q=>q.id)));
 for(const w of plan.workstreams){
  assert.equal(w.progress_percent,0);
  assert.deepEqual(w.base_tasks,base.queues.find(q=>q.id===w.id).tasks.map(t=>t.id));
  assert.deepEqual(w.detail_tasks,plan.detail_tasks.filter(t=>t.queue_id===w.id).map(t=>t.id));
 }
 for(const t of plan.detail_tasks){
  assert.equal(t.status,'pending');assert.equal(t.percent,0);assert.deepEqual(t.evidence,[]);
  assert.equal(t.artifact,null);assert(t.acceptance.includes('source-linked'));
  assert(plan.phases.some(p=>p.id===t.phase && p.queue_ids.includes(t.queue_id)));
 }
 assert.equal(vocab.status,'definitions_only');assert.equal(vocab.research_started_at,null);
 assert(vocab.concepts.every(t=>t.observations.length===0&&t.source_ids.length===0));
});
