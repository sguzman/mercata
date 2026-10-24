import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditExternalLinkFunnel} from '../site/external-link-funnel-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YouTube clickability matrix and policy claims are registered and unmeasured',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/external-link-funnel-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditExternalLinkFunnel(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Shorts description links cannot be converted into fictitious sales',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/external-link-funnel-evidence.json'),load('specimens/youtube.json')]);
 m.surfaces.find(x=>x.id==='shorts_description').external_url_clickable=true;
 m.unknowns.viewer_to_buyer_rate=0.1;
 const errors=auditExternalLinkFunnel(m,new Set(d.evidence.map(x=>x.id))).errors;
 assert(errors.includes('false Shorts clickability'));assert(errors.includes('invented conversion'));
});
