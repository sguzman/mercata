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
