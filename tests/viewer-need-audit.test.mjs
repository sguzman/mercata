import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditViewerNeeds} from '../site/viewer-need-audit.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
const paths=['ontology/youtube/viewer-need-hypotheses-2026.json','ontology/youtube/topic-observations.json','ontology/youtube/podcast-viewing-frames-2026.json','specimens/youtube.json'];
test('Three source-bounded hypotheses retain null actual outcomes and explicit failure criteria',async()=>{
 const [m,t,p,d]=await Promise.all(paths.map(load));
 assert.deepEqual(auditViewerNeeds(m,t,p,new Set(d.evidence.map(x=>x.id))),{valid:true,problems:[]});
 assert.deepEqual(m.hypotheses.map(x=>x.id),['makeup_seasonal_howto','video_essay_reference','podcast_video_choice']);
 assert(m.hypotheses.every(x=>x.status==='hypothesis_not_tested'&&x.spend_ceiling_cents===null));
});
test('Hypothesis audit rejects unsourced signals and fabricated profitable pilots',async()=>{
 const [m,t,p,d]=await Promise.all(paths.map(load)),ids=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(m);
 const a=copy();a.hypotheses[0].observed_effect=0.5;assert(!auditViewerNeeds(a,t,p,ids).valid);
 const b=copy();b.hypotheses[1].public_reference_source_id='unregistered';assert(!auditViewerNeeds(b,t,p,ids).valid);
 const c=copy();c.hypotheses[2].negative_result_rule='';assert(!auditViewerNeeds(c,t,p,ids).valid);
});
