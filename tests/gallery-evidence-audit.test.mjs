import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditGallerySourceCoverage as audit} from '../site/gallery-evidence-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Gallery acceptance references the existing source ledger and browser smoke test',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/gallery-evidence-acceptance.json'),load('specimens/youtube.json')]);
 assert.equal(m.kind,'public_dossier_claim_link_and_unknown_acceptance_contract');
 assert(m.validation_artifacts.includes('tests/site-smoke.mjs'));
 assert.equal(m.observability.do_not_pin_source_counts_to_fixed_baseline,true);
 assert.equal(m.observed_browser_errors,null);
 const a=audit(d);
 assert.equal(a.valid,true,JSON.stringify(a.problems));
 assert.equal(a.dated_claims,a.claim_count);
 assert.equal(a.claims_with_limitations,a.claim_count);
 assert(a.claim_source_reference_count>=a.claim_count);
});
test('Broken, missing, insecure sources or absent claim limitations invalidate the gallery data',async()=>{
 const d=await load('specimens/youtube.json');
 const first=d.claims[0];
 const b=(change)=>audit({...d,claims:[{...first,...change}]});
 assert.equal(b({source_ids:['not-a-source']}).valid,false);
 assert.equal(b({source_ids:[]}).valid,false);
 assert.equal(b({limitations:''}).valid,false);
 assert.equal(b({observed_at:''}).valid,false);
 const other={...d.evidence.find(x=>x.id===first.source_ids[0]),url:'http://example.com'};
 assert.equal(audit({...d,evidence:[other,...d.evidence.filter(x=>x.id!==other.id)],claims:[first]}).valid,false);
});
test('Public source links are implemented with new-tab isolation and explicit unknown labels',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes("anchor.target='_blank';anchor.rel='noopener noreferrer'"));
 assert(app.includes("const dossierJson=make('a','inline-link','Dossier JSON"));
 assert(app.includes("observation.value===null?'Unknown'"));
 const smoke=await readFile(new URL('../tests/site-smoke.mjs',import.meta.url),'utf8');
 assert(smoke.includes('Gallery claim source anchor contract'));
});
