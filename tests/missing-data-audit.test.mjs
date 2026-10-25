import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditMissingDataDependencies} from '../scripts/missing-data-audit.mjs';
const read=x=>JSON.parse(fs.readFileSync(new URL('../'+x,import.meta.url),'utf8'));
test('Twelve existing research gaps refer to actual unresolved null source fields',()=>{
 const d=read('ontology/youtube/missing-data-blockers-2026.json');
 assert.deepEqual(auditMissingDataDependencies(d,read),{valid:true,errors:[],count:12});
});
test('A changed source value, including zero, must trigger blocker review',()=>{
 const d=read('ontology/youtube/missing-data-blockers-2026.json'),b=d.blockers[0];
 const changed=p=>{const v=read(p);if(p===b.path)v[b.section][b.field]=0;return v};
 const r=auditMissingDataDependencies(d,changed);assert(!r.valid);assert(r.errors.some(s=>s.includes(b.id)));
});
test('No unsupported declaration of total completion or creator profits',()=>{
 const d=read('ontology/youtube/missing-data-blockers-2026.json');d.all_blockers_resolved=true;
 assert(!auditMissingDataDependencies(d,read).valid);
});
