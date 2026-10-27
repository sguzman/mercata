import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchSourceRegister} from '../site/itch-source-register-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Research register retains all current source notes and claims without inventing legal authorization',()=>{
 const d=get('specimens/itch-io.json'),a=auditItchSourceRegister(d);
 assert.equal(a.valid,true,JSON.stringify(a.issues.slice(0,5)));
 assert.equal(a.source_count,d.evidence.length);assert.equal(a.claim_count,d.claims.length);
 assert(a.source_count>=190);assert(a.claim_count>=469);
 assert.equal(a.actual_redistribution_legal_clearance,null);
 assert.equal(a.marketwide_paid_seller_count,null);
});
test('Source provenance, duplicate IDs and unknown claim references are rejected',()=>{
 const d=get('specimens/itch-io.json');
 assert.equal(auditItchSourceRegister({...d,evidence:[d.evidence[0],d.evidence[0]],claims:[]}).valid,false);
 assert.equal(auditItchSourceRegister({...d,claims:[{id:'untrusted',source_ids:['missing'] }]}).valid,false);
 assert.equal(auditItchSourceRegister({...d,evidence:d.evidence.map((x,i)=>i===0?{...x,license:''}:x)}).valid,false);
});
test('Existing source hierarchy, review visibility and survivorship planning tasks are complete without population claims',()=>{
 const x=get('ontology/itch-io/source-evidence-and-survivorship-boundaries-2026.json'),p=get('plans/itch-io.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 for(const id of ['itch-io/review/define-source-hierarchy','itch-io/competition/compare-review-measures','itch-io/income/find-failed-and-removed-games']){
  const t=p.detail_tasks.find(z=>z.id===id);
  assert.equal(t.percent,100);assert.equal(t.status,'complete');
  assert(t.evidence.includes('tests/itch-source-register-audit.test.mjs'));
 }
 assert.equal(x.rating_bias.zero_rating_implies_zero_sales,false);
 assert.equal(x.survivorship.zero_sale_fraction,null);
 assert.equal(x.rights_metadata.actual_bulk_redistribution_rights_all_verified,false);
});
