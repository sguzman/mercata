import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessAudienceUnion} from '../site/audience-overlap.mjs';
const read=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const two=()=>[
 {frame_id:'synthetic-panel-1',geography:'example-country',period:'example-period',sampling_method:'same-respondent-panel',unit:'unique_people',count:30,source_ids:['synthetic-only']},
 {frame_id:'synthetic-panel-1',geography:'example-country',period:'example-period',sampling_method:'same-respondent-panel',unit:'unique_people',count:20,source_ids:['synthetic-only']}
];
test('Overlapping topic methodology has no actual joint audience estimates',async()=>{
 const [protocol,taxonomy,dossier]=await Promise.all([read('ontology/youtube/audience-overlap.json'),read('ontology/youtube/taxonomy.json'),read('specimens/youtube.json')]);
 const ids=new Set(taxonomy.topics.map(x=>x.id));const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(protocol.kind,'overlapping_community_audience_protocol');
 assert(protocol.topic_links.every(x=>x.topic_ids.every(id=>ids.has(id))&&x.joint_population===null&&x.overlap_percent===null));
 assert(protocol.source_bounded_examples.every(x=>sources.has(x.source_id)));
 assert(Object.values(protocol.measurement_results).every(x=>x===null));
 assert(protocol.publication_gates.every(x=>x.pass===false));
});
test('Without a measured overlap only valid lower/upper union bounds exist',()=>{
 const result=assessAudienceUnion({groups:two(),population_size:40});
 assert.equal(result.status,'bounded_only');
 assert.equal(result.exact_union,null);
 assert.deepEqual(result.bounds,{lower:30,upper:40});
});
test('A verified direct intersection yields exact union only for two groups',()=>{
 const a=assessAudienceUnion({groups:two(),population_size:100,overlap_count:5,overlap_verified:true,overlap_source_ids:['synthetic-only']});
 assert.equal(a.status,'measured_union');
 assert.equal(a.exact_union,45);
 assert.deepEqual(a.bounds,{lower:45,upper:45});
 const b=assessAudienceUnion({groups:two(),population_size:100,overlap_count:5,overlap_verified:false,overlap_source_ids:['synthetic-only']});
 assert.equal(b.exact_union,null);
 assert.equal(b.status,'unverified_overlap');
});
test('Different survey frames, periods and view counts cannot be unioned',()=>{
 const groups=two();groups[1].frame_id='different-respondents';
 assert.equal(assessAudienceUnion({groups,population_size:100}).status,'invalid');
 groups[1].frame_id=groups[0].frame_id;groups[1].unit='views';
 assert.equal(assessAudienceUnion({groups,population_size:100}).status,'invalid');
 groups[1].unit='unique_people';groups[1].period='different-year';
 assert.equal(assessAudienceUnion({groups,population_size:100}).status,'invalid');
});
test('Three communities with pairwise overlap cannot claim exact union',()=>{
 const groups=two();groups.push({...groups[0],count:10});
 assert.equal(assessAudienceUnion({groups,population_size:50}).exact_union,null);
 assert.equal(assessAudienceUnion({groups,population_size:50}).status,'bounded_only');
 assert.equal(assessAudienceUnion({groups,population_size:50,overlap_count:5,overlap_verified:true,overlap_source_ids:['synthetic-only']}).status,'invalid');
});
test('Overlap must respect feasible population and group sizes',()=>{
 assert.equal(assessAudienceUnion({groups:two(),population_size:40,overlap_count:5,overlap_verified:true,overlap_source_ids:['synthetic-only']}).status,'invalid');
 assert.equal(assessAudienceUnion({groups:two(),population_size:40,overlap_count:10,overlap_verified:true,overlap_source_ids:['synthetic-only']}).exact_union,40);
 assert.equal(assessAudienceUnion({groups:two(),population_size:15}).status,'invalid');
});
