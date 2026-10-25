import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {buildPublicReferenceGraph,auditMemeReferences} from '../site/public-reference-graph.mjs';
const nodes=[{video_id:'a',published_at:'2026-01-01T00:00:00Z'},{video_id:'b',published_at:'2026-02-01T00:00:00Z'},{video_id:'c',published_at:'2026-03-01T00:00:00Z'}];
const edges=[{from_video_id:'b',to_video_id:'a',type:'credited_remix',observed_at:'2026-02-02T00:00:00Z',public_evidence_url:'https://example.com/b'},{from_video_id:'c',to_video_id:'a',type:'description_link',observed_at:'2026-03-02T00:00:00Z',public_evidence_url:'https://example.com/c'}];
test('Synthetic public video links count reference edges, not follower or meme origin',()=>{
 const x=buildPublicReferenceGraph(nodes,edges);
 assert.equal(x.valid,true);assert.equal(x.edge_count,2);assert.equal(x.indegree_by_video.a,2);
 assert.equal(x.linking_video_count,2);assert.equal(x.meme_origin,null);assert.equal(x.creator_income,null);
});
test('Reject undated, duplicated or future-referencing connections',()=>{
 const a=structuredClone(edges);a[0].to_video_id='c';assert(!buildPublicReferenceGraph(nodes,a).valid);
 const b=[edges[0],edges[0]];assert(!buildPublicReferenceGraph(nodes,b).valid);
 const c=structuredClone(edges);c[0].public_evidence_url='';assert(!buildPublicReferenceGraph(nodes,c).valid);
});
test('No real viewer or cross-channel meme migration measurements are claimed',async()=>{
 const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
 const [m,d]=await Promise.all([load('ontology/youtube/public-meme-reference-graph-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditMemeReferences(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
