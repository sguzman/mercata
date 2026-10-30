import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {auditSteamEvidenceIntegrity} from '../scripts/steam-evidence-integrity.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fresh=()=>[read('plans/steam.json'),read('queues/steam.json'),read('specimens/steam.json')];
const inspect=f=>{const [p,q,d]=fresh();f(p,q,d);return auditSteamEvidenceIntegrity(p,q,d,root);};
test('All Steam task evidence links, source joins and current scores are sound',()=>{
 const [p,q,d]=fresh(),a=auditSteamEvidenceIntegrity(p,q,d,root);
 assert.equal(a.valid,true,a.errors.slice(0,5).join('; '));
 assert.equal(a.task_count,293);
 assert.equal(a.unstarted,0);
 assert.equal(a.complete+a.partial,293);
 assert.equal(a.source_count,d.evidence.length);
 assert.equal(a.claim_count,d.claims.length);
 assert(a.distinct_evidence_files>25);
 assert.equal(a.registered_reused_sample_families,6);
});
test('Fails closed on missing, traversal, duplicate and absolute references',()=>{
 for(const f of ['ontology/steam/missing-thing.md','../private.txt','/etc/passwd','https://example.com/hello','ontology//bad.json']){
  const a=inspect(p=>p.detail_tasks[0].evidence.push(f));
  assert.equal(a.valid,false,f);assert(a.errors.some(e=>e.includes('evidence path')),f);
 }
 const a=inspect(p=>p.detail_tasks[0].evidence.push(p.detail_tasks[0].evidence[0]));
 assert.equal(a.valid,false);assert(a.errors.some(e=>e.includes('duplicate evidence path')));
});
test('Rejects missing citation sources and incorrect public progress',()=>{
 const b=inspect((p,q,d)=>{d.claims[0].source_ids=['invented-source-id'];p.progress_percent=4;});
 assert.equal(b.valid,false);assert(b.errors.some(x=>x.includes('Unsourced claim')));assert(b.errors.some(x=>x.includes('Rounded Steam task progress')));
});
test('Rejects duplicate task IDs and missing reported artifacts',()=>{
 const bad=inspect(p=>{p.detail_tasks[1].id=p.detail_tasks[0].id;p.detail_tasks[2].artifact='ontology/steam/not-created.md';});
 assert.equal(bad.valid,false);assert(bad.errors.some(x=>x.includes('Duplicate')));assert(bad.errors.some(x=>x.includes('missing or outside-repository')));
});

test('Rejects impossible source dates, publication chronology and incomplete provenance',()=>{
 const cases=[
  [d=>{d.evidence[0].retrieved_at='2026-02-30';},'Invalid source retrieved_at'],
  [d=>{d.evidence[0].published_at='2026-11';d.evidence[0].retrieved_at='2026-10-29';},'Source publication after retrieval'],
  [d=>{d.evidence[0].published_at='2026-10-30';d.evidence[0].retrieved_at='2026-10-29';},'Source publication after retrieval'],
  [d=>{d.evidence[0].published_at='2026-02-30';},'Invalid source published_at'],
  [d=>{d.evidence[0].published_at='2026-13';},'Invalid source published_at'],
  [d=>{d.evidence[0].publisher=' ';},'Incomplete public source provenance']
 ];
 for(const [change,expected] of cases){
  const r=inspect((p,q,d)=>change(d));
  assert.equal(r.valid,false,expected);
  assert(r.errors.some(e=>e.includes(expected)),expected);
 }
});
test('Rejects impossible claim dates and claims without public confidence or limits',()=>{
 for(const [key,value,expected] of [
  ['observed_at','2026-02-30','Invalid claim observed_at'],
  ['text',' ','Incomplete attributed claim'],
  ['limitations','','Incomplete attributed claim'],
  ['confidence',null,'Incomplete attributed claim']
 ]){
  const r=inspect((p,q,d)=>{d.claims[0][key]=value;});
  assert.equal(r.valid,false,key);
  assert(r.errors.some(e=>e.includes(expected)),key);
 }
});
test('Month-granularity source dates and unknown publication dates remain supported',()=>{
 for(const published of [null,'2005-06','2026-10','2026-10-01']){
  const r=inspect((p,q,d)=>{d.evidence[0].retrieved_at='2026-10-29';d.evidence[0].published_at=published;});
  assert.equal(r.valid,true,published+': '+r.errors.slice(0,5).join('; '));
 }
});
test('A complete status cannot conceal unfinished Steam task progress',()=>{
 const r=inspect(p=>{p.detail_tasks[0].status='complete';});
 assert.equal(r.valid,false);
 assert(r.errors.some(e=>e.includes('complete status without 100 percent progress')));
});
test('Duplicated evidence is rejected even when the same path is the task artifact',()=>{
 const r=inspect(p=>{
  const task=p.detail_tasks[0];
  task.artifact=task.evidence[0];
  task.evidence.push(task.evidence[0]);
 });
 assert.equal(r.valid,false);
 assert(r.errors.some(e=>e.includes('duplicate evidence path')));
});
test('One claim cannot cite the same source ID twice as separate support',()=>{
 const r=inspect((p,q,d)=>{d.claims[0].source_ids.push(d.claims[0].source_ids[0]);});
 assert.equal(r.valid,false);
 assert(r.errors.some(e=>e.includes('Duplicate claim source ID')));
});
