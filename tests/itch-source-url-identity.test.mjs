import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {itchSourceStats,alignItchSourceAudit} from '../scripts/sync-itch-io-sources.mjs';
import {auditItchSourceRegister} from '../site/itch-source-register-audit.mjs';

const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const dossier=()=>get('specimens/itch-io.json');
const machine='ontology/itch-io/source-url-identity-audit-2026.json';
const human='ontology/itch-io/source-url-identity-audit-2026.md';

test('Distinct URLs do not equate to source records or independent publisher documents',()=>{
 const d=dossier(),s=itchSourceStats(d),a=get(machine);
 assert.equal(s.sourceCount,d.evidence.length);
 assert.equal(s.distinctUrlCount,new Set(d.evidence.map(x=>x.url)).size);
 assert.equal(s.aliasExcessRecordCount,s.sourceCount-s.distinctUrlCount);
 assert.equal(s.duplicateUrlGroups.length,a.alias_group_count);
 assert.equal(a.public_source_record_count,s.sourceCount);
 assert.equal(a.distinct_url_string_count,s.distinctUrlCount);
 assert.equal(a.alias_excess_record_count,s.aliasExcessRecordCount);
 assert.equal(a.underlying_independent_creator_documents,null);
 assert(s.duplicateUrlGroups.length>0);
 assert.equal(s.claimsRepeatingOneUrl.length,0);
 assert.deepEqual(a.claim_ids_using_same_url_twice,[]);
 assert.deepEqual(s.duplicateUrlGroups,a.alias_document_groups);
 assert.equal(alignItchSourceAudit(machine,read(machine),s),read(machine));
 assert.equal(alignItchSourceAudit(human,read(human),s),read(human));
 assert.equal(auditItchSourceRegister(d).distinct_url_strings,s.distinctUrlCount);
});

test('Adding a same-URL evidence record increases record count without adding an independent URL',()=>{
 const d=dossier(),before=itchSourceStats(d);
 const existing=d.evidence.find(s=>s.url&&!before.duplicateUrlGroups.some(g=>g.url===s.url));
 const after=itchSourceStats({...d,evidence:[...d.evidence,{...existing,id:'public-duplicate-test-only'}]});
 assert.equal(after.sourceCount,before.sourceCount+1);
 assert.equal(after.distinctUrlCount,before.distinctUrlCount);
 assert.equal(after.aliasExcessRecordCount,before.aliasExcessRecordCount+1);
 assert.equal(after.duplicateUrlGroups.find(g=>g.url===existing.url)?.source_ids.length,2);
});

test('A claim cannot masquerade two evidence IDs for one URL as independent corroboration',()=>{
 const d=dossier(),groups=itchSourceStats(d).duplicateUrlGroups;
 const x=groups.find(g=>g.source_ids.length>1);
 assert(x,'Expected a documented duplicate-URL group');
 const original=d.claims[0];
 const bad={...original,id:'synthetic-duplicate-document-test-only',source_ids:x.source_ids.slice(0,2)};
 const report=auditItchSourceRegister({...d,claims:[...d.claims,bad]});
 assert.equal(report.valid,false);
 assert(report.issues.includes('Claim cites one public URL through multiple evidence IDs'));
 const stats=itchSourceStats({...d,claims:[...d.claims,bad]});
 assert(stats.claimsRepeatingOneUrl.includes(bad.id));
});

test('Alias audit fails closed on invalid metadata or missing human generated marker',()=>{
 const s=itchSourceStats(dossier());
 assert.throws(()=>alignItchSourceAudit(human,'no audit marker',s),/Missing source URL identity audit anchor/);
 assert.throws(()=>alignItchSourceAudit(machine,read(machine),{...s,distinctUrlCount:s.sourceCount+1}),TypeError);
 assert.throws(()=>itchSourceStats({...dossier(),evidence:[{id:'x',url:null,published_at:null}],claims:[]}),TypeError);
});

test('No source references are deleted or rewritten by the identity audit',()=>{
 const d=dossier(),ids=new Set(d.evidence.map(e=>e.id)),aliases=get(machine);
 assert(aliases.alias_document_groups.every(g=>g.source_ids.every(id=>ids.has(id))));
 assert(d.claims.every(c=>c.source_ids.every(id=>ids.has(id))));
 assert.equal(aliases.source_ids.length,aliases.alias_document_groups.reduce((n,g)=>n+g.source_ids.length,0));
});
