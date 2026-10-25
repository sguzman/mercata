import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditEvidenceQuality} from '../site/evidence-quality-audit.mjs';
const load=async file=>JSON.parse(await fs.readFile(new URL('../'+file,import.meta.url),'utf8'));
test('Eight provenance classes preserve their original metadata and claim-specific scopes',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/evidence-quality-scope-2026.json'),load('specimens/youtube.json')]);
 const check=auditEvidenceQuality(model,dossier);
 assert.deepEqual(check,{valid:true,errors:[],reviewed:8,registered:dossier.evidence.length});
 assert(model.source_records.some(r=>r.id==='ypp-main'&&r.role==='first_party_rules_document'));
 assert(model.source_records.some(r=>r.id==='zenagainst-photography-time-diary-2025'&&r.role==='first_person_case_study'));
 assert(model.source_records.every(r=>r.full_method_reviewed===false));
});
test('Audit rejects source drift, invented probability weights and unsupported full-method attestation',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/evidence-quality-scope-2026.json'),load('specimens/youtube.json')]);
 const copy=()=>structuredClone(model);
 const a=copy();a.source_records[0].source_url='https://example.com';assert(!auditEvidenceQuality(a,dossier).valid);
 const b=copy();b.source_records[1].full_method_reviewed=true;assert(!auditEvidenceQuality(b,dossier).valid);
 const c=copy();c.comparison_axes[0].unmeasured_standardized_weight=0.95;assert(!auditEvidenceQuality(c,dossier).valid);
 const e=copy();e.full_registered_source_count_at_review=8;assert(!auditEvidenceQuality(e,dossier).valid);
});
