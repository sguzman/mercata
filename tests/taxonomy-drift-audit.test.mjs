import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditTopicTaxonomyDrift} from '../site/taxonomy-drift-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Existing 33 topic IDs and 36 source observations are preserved under proposed versioning method',async()=>{
 const [m,t,o]=await Promise.all(['ontology/youtube/taxonomy-drift-protocol-2026.json','ontology/youtube/taxonomy.json','ontology/youtube/topic-observations.json'].map(load));
 assert.deepEqual(auditTopicTaxonomyDrift(m,t,o),{valid:true,errors:[]});
 assert.equal(m.current_taxonomy_version,t.taxonomy_version);
 assert.equal(m.candidate_overlap_examples.length,4);
 assert(m.candidate_overlap_examples.every(x=>x.reassigned_metric_value===null));
});
test('Cannot reassign historic audience amounts or invent topic categories',async()=>{
 const [m,t,o]=await Promise.all(['ontology/youtube/taxonomy-drift-protocol-2026.json','ontology/youtube/taxonomy.json','ontology/youtube/topic-observations.json'].map(load));const copy=()=>structuredClone(m);
 const a=copy();a.candidate_overlap_examples[0].reassigned_metric_value=50;assert(!auditTopicTaxonomyDrift(a,t,o).valid);
 const b=copy();b.candidate_overlap_examples[1].candidate_related_topic_ids=['invented-topic'];assert(!auditTopicTaxonomyDrift(b,t,o).valid);
 const c=copy();c.candidate_overlap_examples[2].original_value=42;assert(!auditTopicTaxonomyDrift(c,t,o).valid);
});
