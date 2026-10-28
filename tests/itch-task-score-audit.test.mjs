import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditItchTaskScores} from '../scripts/itch-task-score-audit.mjs';
import {expectedItchStatus} from '../scripts/sync-itch-io-status.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const source=()=>[load('plans/itch-io.json'),load('queues/itch-io.json'),load('ontology/itch-io/research-synthesis-2026.json')];
test('Published task progress and per-workstream score are independently recomputed from 244 tasks',()=>{
 const [p,q,s]=source(),a=auditItchTaskScores(p,q,s);
 assert.equal(a.total_tasks,244);
 assert.equal(a.baseline_tasks,84);assert.equal(a.detail_tasks,160);
 assert.equal(a.workstream_count,13);
 assert.equal(a.unfinished_tasks,p.detail_tasks.filter(x=>x.percent<100).length+
  q.queues.flatMap(x=>x.tasks).filter(x=>x.progress<100).length);
 assert.equal(a.exact_percent,a.score_sum/244);
 assert.equal(a.six_decimal_percent,s.latest_evidence_summary.task_mean_exact_percent);
 assert.equal(a.rounded_percent,expectedItchStatus());
});
test('Stale plan, workstream, exact score or rounded synthesis cannot pass status-sync preflight',()=>{
 const mutate=(f,pattern)=>{
  const [p,q,s]=source();f(p,q,s);
  assert.throws(()=>auditItchTaskScores(p,q,s),pattern);
 };
 mutate((p)=>p.progress_percent=96,/plan rounded score/);
 mutate((p)=>p.workstreams.find(x=>x.id==='market').progress_percent=99,/workstream score/);
 mutate((p,q,s)=>s.latest_evidence_summary.task_mean_exact_percent=0,/synthesis exact score/);
 mutate((p,q,s)=>s.latest_evidence_summary.task_mean_rounded_percent=0,/synthesis rounded score/);
 mutate((p)=>p.detail_tasks.find(x=>x.percent<100).percent++,/synthesis exact score|workstream score|plan rounded score/);
 mutate((p)=>p.detail_tasks.find(x=>x.percent<100).status='complete',/inconsistent detail status/);
});
test('Adding or duplicating tasks cannot manufacture a higher percentage with changed denominator',()=>{
 const mutate=(f,pattern)=>{
  const [p,q,s]=source();f(p,q,s);assert.throws(()=>auditItchTaskScores(p,q,s),pattern);
 };
 mutate((p)=>p.detail_tasks.push({...p.detail_tasks[0],id:'extra',evidence:[]}),/original 160 detail/);
 mutate((p,q)=>q.queues[0].tasks.push({...q.queues[0].tasks[0],id:'unapproved'}),/original 84 baseline/);
 mutate((p)=>p.detail_tasks[1].id=p.detail_tasks[0].id,/duplicate detail/);
 mutate((p,q)=>q.queues[1].id=q.queues[0].id,/duplicate or missing workstream/);
 mutate((p)=>p.detail_tasks[0].queue_id='unapproved-new-workstream',/unknown detail workstream/);
});
