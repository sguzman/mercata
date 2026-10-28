import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {auditItchTaskEvidenceLinks} from '../scripts/itch-task-evidence-link-audit.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const input=()=>[load('plans/itch-io.json'),load('queues/itch-io.json')];
const mutate=(update)=>{const [p,q]=input();update(p,q);return auditItchTaskEvidenceLinks(p,q,root)};
test('Every baseline and detail task evidence reference resolves to a local repository file',()=>{
 const [p,q]=input(),a=auditItchTaskEvidenceLinks(p,q,root);
 assert.equal(a.valid,true,a.errors.slice(0,4).join('; '));
 assert.equal(a.total_tasks,244);
 assert.equal(a.evidence_refs,p.detail_tasks.reduce((n,t)=>n+t.evidence.length,0)+q.queues.flatMap(g=>g.tasks).reduce((n,t)=>n+t.evidence.length,0));
 assert(a.evidence_refs>4000);
 assert(a.distinct_evidence_files>500);
 assert.equal(a.missing_or_unsafe_references,0);
});
test('Unfinished tasks cannot hide missing or nonexistent paths',()=>{
 const a=mutate(p=>p.detail_tasks.find(t=>t.percent<100).evidence.push('ontology/itch-io/does-not-exist-source-audit.json'));
 assert.equal(a.valid,false);
 assert(a.errors.some(s=>s.includes('missing or out-of-repository evidence')));
});
test('Completed baseline tasks also retain valid, nonduplicate evidence references',()=>{
 const a=mutate((p,q)=>{const task=q.queues.flatMap(x=>x.tasks).find(t=>t.progress===100);task.evidence.push(task.evidence[0]);});
 assert.equal(a.valid,false);
 assert(a.errors.some(s=>s.includes('duplicate evidence reference')));
});
test('Reject absolute paths, traversal, Windows paths, URLs and references outside the repo',()=>{
 for(const ref of ['../private-data.txt','/etc/passwd','C:/private-data.txt','ontology//bad.json','ontology/./bad.json','ontology/../bad.json','https://itch.io/docs/creators/payments','ontology\\bad.json']){
  const a=mutate(p=>p.detail_tasks[0].evidence.push(ref));
  assert.equal(a.valid,false,ref);
  assert(a.errors.some(x=>x.includes('unsafe or malformed evidence path')||x.includes('missing or out-of-repository evidence')),ref);
 }
});
test('Malformed task population or missing evidence array fails closed',()=>{
 const [p,q]=input();
 assert.throws(()=>auditItchTaskEvidenceLinks({...p,detail_tasks:p.detail_tasks.slice(1)},q,root),TypeError);
 const a=mutate(p=>{p.detail_tasks[0].evidence=null;});
 assert.equal(a.valid,false);
 assert(a.errors.some(x=>x.includes('Malformed task evidence record')));
});
