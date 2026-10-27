import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const load=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
test('Every fixed itch.io task has valid local evidence references and status/score matches',()=>{
 const q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const tasks=[...q.queues.flatMap(x=>x.tasks),...p.detail_tasks];
 assert.equal(tasks.length,244);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.total_tracked_tasks,244);
 const ids=new Set();
 for(const t of tasks){
  assert(!ids.has(t.id),'Duplicate task '+t.id);ids.add(t.id);
  const score=t.progress??t.percent;
  assert(Number.isInteger(score)&&score>=0&&score<=100);
  assert.equal(t.status==='complete',score===100,'Status mismatch '+t.id);
  assert(Array.isArray(t.evidence)&&t.evidence.length>0,'Missing evidence '+t.id);
  assert.equal(t.evidence.length,new Set(t.evidence).size,'Duplicate evidence '+t.id);
  for(const item of t.evidence){
   assert.equal(typeof item,'string');assert(item.length&& !path.isAbsolute(item));
   assert(!item.split('/').includes('..'),'Traversal '+item);
   const full=path.resolve(root,item);assert(full.startsWith(root+path.sep),'Escaped root '+item);
   assert(fs.statSync(full).isFile(),t.id+' missing '+item);
  }
 }
 const score=tasks.reduce((sum,t)=>sum+(t.progress??t.percent),0)/244;
 assert.equal(p.progress_percent,Math.round(score));
 for(const w of p.workstreams){
  const base=q.queues.find(g=>g.id===w.id).tasks;
  const detail=p.detail_tasks.filter(t=>t.queue_id===w.id);
  assert.equal(w.progress_percent,Math.round((base.reduce((a,t)=>a+t.progress,0)+detail.reduce((a,t)=>a+t.percent,0))/(base.length+detail.length)),'Workstream '+w.id);
 }
});
test('The dossier has registered source attribution and the gallery maps the original artifact',()=>{
 const d=load('specimens/itch-io.json'),g=load('gallery/index.json');
 const src=new Set();
 for(const e of d.evidence){
  assert(!src.has(e.id),'duplicate source '+e.id);src.add(e.id);
  for(const k of ['url','title','publisher','retrieved_at','evidence_class','license'])
   assert(typeof e[k]==='string'&&e[k].trim(),'source field '+e.id+' '+k);
  assert(e.url.startsWith('https://'));
  assert(/^\d{4}-\d{2}-\d{2}$/.test(e.retrieved_at));
 }
 const claimIds=new Set();
 for(const c of d.claims){
  assert(!claimIds.has(c.id),'duplicate claim '+c.id);claimIds.add(c.id);
  assert(c.source_ids.length,'no cited source '+c.id);
  for(const id of c.source_ids)assert(src.has(id),'unknown source '+id);
 }
 const rows=g.specimens.filter(x=>x.id==='itch-io');
 assert.equal(rows.length,1);
 for(const f of ['dossier','queue','plan'])assert(fs.statSync(path.join(root,rows[0][f])).isFile());
 assert.equal(rows[0].dossier,'specimens/itch-io.json');
 assert.equal(rows[0].queue,'queues/itch-io.json');
 assert.equal(rows[0].plan,'plans/itch-io.json');
});
