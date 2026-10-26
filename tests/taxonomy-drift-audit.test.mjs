import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditTopicTaxonomyDrift} from '../site/taxonomy-drift-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Original 33 topics and 36 historical observations survive explicit 37th-source admission',async()=>{
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

test('New records require explicit after-baseline source frame and cannot silently replace original values',async()=>{
 const [m,t,o]=await Promise.all(['ontology/youtube/taxonomy-drift-protocol-2026.json','ontology/youtube/taxonomy.json','ontology/youtube/topic-observations.json'].map(load));
 assert.equal(m.selected_observations_at_baseline,36);
 assert.equal(o.observations.length,37);
 assert.equal(m.post_baseline_source_observations.length,1);
 assert.deepEqual(auditTopicTaxonomyDrift(m,t,o),{valid:true,errors:[]});
 const noAddition=structuredClone(m);noAddition.post_baseline_source_observations=[];
 assert(auditTopicTaxonomyDrift(noAddition,t,o).errors.includes('Original frame changed'));
 const reclass=structuredClone(m);reclass.post_baseline_source_observations[0].original_topic_id='child-animation';
 assert(auditTopicTaxonomyDrift(reclass,t,o).errors.includes('Undocumented or reclassified post-baseline observation'));
});

test('All 36 original topic observations stay immutable when a 37th is appended',async()=>{
 const [m,t,o]=await Promise.all(['ontology/youtube/taxonomy-drift-protocol-2026.json','ontology/youtube/taxonomy.json','ontology/youtube/topic-observations.json'].map(load));
 assert.equal(m.baseline_observation_rows.length,36);
 assert.equal(o.observations.length,37);
 assert.equal(m.baseline_original_public_commit_sha,'31b81057431d58af837d38f8a4f12a43fe2f6efc');
 assert.deepEqual(auditTopicTaxonomyDrift(m,t,o),{valid:true,errors:[]});
 const chosen=m.baseline_observation_rows.find(row=>!m.candidate_overlap_examples.some(x=>x.observation_id===row[0]));
 assert(chosen,'Expected an original observation not in the four illustrative cases');
 const mutated=structuredClone(o);
 mutated.observations.find(x=>x.id===chosen[0]).value+=1;
 assert(auditTopicTaxonomyDrift(m,t,mutated).errors.includes('Historical observation changed or removed'));
 const omitted=structuredClone(o);
 omitted.observations=omitted.observations.filter(x=>x.id!==chosen[0]);
 assert(auditTopicTaxonomyDrift(m,t,omitted).errors.includes('Historical observation changed or removed'));
 const duplicate=structuredClone(o);duplicate.observations.push(structuredClone(o.observations[0]));
 assert(auditTopicTaxonomyDrift(m,t,duplicate).errors.includes('Original baseline register invalid or duplicate IDs'));
});
