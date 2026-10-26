import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditItchSourceRegister} from '../site/itch-source-register-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('All itch.io source records have honest date precision and authored reuse notes',()=>{
 const d=read('specimens/itch-io.json');
 const x=read('ontology/itch-io/source-reuse-record-completeness-2026.json');
 const result=auditItchSourceRegister(d);
 assert.equal(result.valid,true,JSON.stringify(result.issues));
 assert.equal(result.source_count,x.sources_in_fixed_dossier);
 assert.equal(result.claim_count,x.claims_in_fixed_dossier);
 const counts={
  full:d.evidence.filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.published_at)).length,
  month:d.evidence.filter(e=>/^\d{4}-\d{2}$/.test(e.published_at)).length,
  unknown:d.evidence.filter(e=>e.published_at==null).length
 };
 assert.equal(counts.full,x.record_field_coverage.known_exact_publication_day);
 assert.equal(counts.month,x.record_field_coverage.known_publication_month_only);
 assert.equal(counts.unknown,x.record_field_coverage.publication_date_unverified);
 for(const k of ['source_urls_recorded','retrieved_dates_recorded','source_publisher_or_authors_recorded','source_evidence_class_recorded','source_license_or_reuse_note_recorded'])
  assert.equal(x.record_field_coverage[k],d.evidence.length);
});
test('Dataset reuse is not inferred from a public citation or metadata listing',()=>{
 const x=read('ontology/itch-io/source-reuse-record-completeness-2026.json');
 const d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(x.dataset_records_identified,d.evidence.filter(e=>e.evidence_class==='research_dataset_metadata').map(e=>e.id));
 assert.equal(x.dataset_record_reuse_assessment.full_archive_license_review_complete,false);
 assert.equal(x.dataset_record_reuse_assessment.all_dataset_files_authorized_for_republication,null);
 assert.equal(x.copyright_and_citation_boundaries.third_party_dataset_redistribution_permission,null);
 assert.equal(x.acceptance.commercial_reuse_permission_all_verified,false);
});
test('Completed source-rights bookkeeping task is not a blanket copyright clearance',()=>{
 const p=read('plans/itch-io.json'),x=read('ontology/itch-io/source-reuse-record-completeness-2026.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/review/audit-source-rights');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('ontology/itch-io/source-reuse-record-completeness-2026.md'));
 assert(t.evidence.includes('tests/itch-source-reuse-record-completeness.test.mjs'));
 assert.equal(x.acceptance.record_completeness_verified,true);
 assert.equal(x.acceptance.commercial_reuse_permission_all_verified,false);
 assert.equal(p.total_tracked_tasks,244);
});
