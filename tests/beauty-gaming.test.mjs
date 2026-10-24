import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessAudienceUnion} from '../site/audience-overlap.mjs';
const load=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));

test('2025 beauty and gaming data are a selected U.S. viewer panel, not a universal census',async()=>{
 const [study,dossier,taxonomy,registry]=await Promise.all([
  load('ontology/youtube/beauty-gaming-overlap-2025.json'),
  load('specimens/youtube.json'),
  load('ontology/youtube/taxonomy.json'),
  load('ontology/youtube/source-families.json')
 ]);
 const ids=new Set(dossier.evidence.map(s=>s.id));
 assert.equal(study.kind,'beauty_gaming_audience_affinity_and_overlap_evidence');
 assert.equal(study.study.panel_count,74276);
 assert.equal(study.study.inclusion_min_gaming_engagements,5);
 assert.equal(study.study.geography,'United States');
 assert.equal(study.study.measurement_start,'2024-07');
 assert.equal(study.study.measurement_end,'2025-06');
 assert.equal(study.study.representative_of_all_us_youtube_users,false);
 assert.equal(study.study.sampling_probabilities,null);
 assert.equal(study.study.sex_or_gender_classification_method,null);
 assert(study.source_ids.every(id=>ids.has(id)));
 assert(taxonomy.topics.some(t=>t.id===study.comparability.topic_a));
 assert(taxonomy.topics.some(t=>t.id===study.comparability.topic_b));
 const family=registry.families.find(f=>f.id===study.source_family_id);
 assert.deepEqual(new Set(family.source_ids),new Set(study.source_ids));
 assert.equal(family.relation,'same_underlying_survey_different_urls');
 assert.equal(study.source_independence.independent_research_datasets,1);
});

test('Five percent reported vendor overlap is not a count of distinct people',async()=>{
 const study=await load('ontology/youtube/beauty-gaming-overlap-2025.json');
 const overlap=study.findings.find(f=>f.id==='reported_category_overlap');
 assert.equal(overlap.value,5);
 assert.equal(overlap.unit,'percent_as_reported');
 assert.equal(overlap.raw_joint_unique_people,null);
 assert.equal(overlap.numerator_n,null);
 assert.equal(overlap.denominator_n,null);
 assert.equal(overlap.comparable_to_population_overlap,false);
 assert.equal(overlap.independently_replicated,false);
 assert.deepEqual(study.findings.filter(f=>f.measure==='relative_channel_viewing_affinity').map(f=>f.value),[6.4,5.7,5.4]);
 assert(study.validation_gates.some(g=>g.id==='matched_intersection_count'&&g.satisfied===false));
 assert(study.validation_gates.some(g=>g.id==='population_representativeness'&&g.satisfied===false));
 assert(Object.values(study.unmeasured).every(x=>x===null));
 assert.equal(study.comparability.exact_union_unique_people,null);
});

test('Missing matched community counts never become a synthetic population estimate',async()=>{
 const study=await load('ontology/youtube/beauty-gaming-overlap-2025.json');
 assert.equal(study.comparability.validated_joint_intersection_n,null);
 // A genuine two-group calculation requires independent group totals and an overlap count.
 // Reported vendor percentage alone supplies none of those inputs.
 assert.equal(assessAudienceUnion({groups:[],population_size:null}).status,'invalid');
 assert(study.comparability.prohibited_statements.some(t=>t.includes('panel size')));
 assert(study.comparability.prohibited_statements.some(t=>t.includes('exact two-group union')));
});
