import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
test('All 244 itch.io task evidence paths exist and 100% requires accepted completion',()=>{
 const base=load('queues/itch-io.json');
 const plan=load('plans/itch-io.json');
 const tasks=base.queues.flatMap(g=>g.tasks.map(t=>({
  id:t.id,score:t.progress,evidence:t.evidence,status:t.status
 }))).concat(plan.detail_tasks.map(t=>({
  id:t.id,score:t.percent,evidence:t.evidence,status:t.status
 })));
 assert.equal(tasks.length,244);
 assert.equal(tasks.length,plan.total_tracked_tasks);
 assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length);
 for(const task of tasks){
  assert(Number.isInteger(task.score) && task.score>=0 && task.score<=100,task.id);
  if(task.score>0)assert(task.evidence.length>0,task.id);
  for(const location of task.evidence){
   assert(!path.isAbsolute(location) && !location.includes('..') && !location.startsWith('/'),
    'Invalid research relative path '+task.id);
   assert(fs.existsSync(path.join(root,location)),
    'Missing evidence for '+task.id+': '+location);
  }
  if(task.score===100)assert.equal(task.status,'complete',task.id);
  if(task.status==='complete')assert.equal(task.score,100,task.id);
 }
 const mean=Math.round(tasks.reduce((n,t)=>n+t.score,0)/tasks.length);
 assert.equal(plan.progress_percent,mean);
 assert(file('plans/itch-io.md').includes('Research is now **'+mean+'%**'));
 assert(file('README.md').includes('progress is now '+mean+'%'));
 assert(file('ontology/itch-io/README.md').includes('Research is underway: '+mean+'%'));
 assert(file('ontology/itch-io/README.md').includes('- '+mean+'% task-weighted research scoring'));

 assert(file('ontology/itch-io/README.md').includes(mean+'% is the rounded mean'));
 assert(file('ontology/itch-io/README.md').includes('- '+mean+'% task-weighted research scoring'));
});
