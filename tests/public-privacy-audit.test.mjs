import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditPublicResearchPrivacy} from '../scripts/public-privacy-audit.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Published YouTube metadata passes narrow privacy lint without claiming full privacy clearance',async()=>{
 const [d,p]=await Promise.all([read('specimens/youtube.json'),read('ontology/youtube/publication-privacy-gate-2026.json')]);
 const r=auditPublicResearchPrivacy(d.evidence,d.claims,p);
 assert.equal(r.metadata_safe,true,JSON.stringify(r.errors));
 assert.equal(r.source_count,d.evidence.length);assert.equal(r.claim_count,d.claims.length);
 assert.equal(r.privacy_clearance_established,false);assert.equal(r.requires_manual_review,true);
});
test('Prohibited private keys and leaked emails fail without printing values',async()=>{
 const policy=await read('ontology/youtube/publication-privacy-gate-2026.json');
 const safe=[{id:'source',url:'https://example.org/research',title:'Public data',publisher:'Example',retrieved_at:'2026-10-25',license:'Linked data only'}];
 const claim=[{id:'x',text:'Public 2026 event',limitations:'Source-defined example',source_ids:['source']}];
 const bad=[{...safe[0],access_token:'ghp_abcdefghijklmnopqrstuvwx'}];
 const a=auditPublicResearchPrivacy(bad,claim,policy);
 assert.equal(a.metadata_safe,false);assert(a.errors.some(e=>e.includes('Sensitive metadata key')));
 assert(!JSON.stringify(a).includes('abcdefghijklmnopqrstuvwx'));
 const leak=auditPublicResearchPrivacy(safe,[{...claim[0],text:'Contact person@example.org for private details'}],policy);
 assert.equal(leak.metadata_safe,false);assert(leak.errors.some(e=>e.includes('Private-data signature')));
 assert(!JSON.stringify(leak).includes('person@example.org'));
});
test('Automated metadata passing is never a manual privacy sign-off',async()=>{
 const p=await read('ontology/youtube/publication-privacy-gate-2026.json');
 const falsified={...p,privacy_clearance_established:true};
 const result=auditPublicResearchPrivacy([],[],falsified);
 assert.equal(result.metadata_safe,false);
});
