import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessTopicChange} from '../site/topic-decline-audit.mjs';
const load=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
const first=()=>({topic_id:'synthetic-topic',title_predicate:'fixed-query',geography:'synthetic-geography',language_scope:'same-language',
format:'long_form',population:'matched-synthetic-video-sample',unit:'views',measurement_epoch:'post_2026_08_24',
sampling_frame:'synthetic-a',period_days:30,period_start:'2026-09-01',bound_type:'exact',value:200,source_ids:['synthetic-study-a']});
test('Known examples cannot identify a measured declining YouTube niche',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/declining-content-evidence.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'declining_content_trend_detection_protocol');
 assert(model.source_ids.every(id=>ids.has(id)));
 assert(model.registered_example_checks.every(x=>!x.can_establish_decline&&x.source_ids.every(id=>ids.has(id))));
 assert(model.trend_inference_gates.every(x=>!x.passed));
 assert(Object.values(model.unmeasured).every(x=>x===null));
});
test('Matched synthetic decrease is descriptive only, not a validated declining trend',()=>{
 const before=first(),after={...first(),period_start:'2026-10-01',value:150};
 const result=assessTopicChange(before,after);
 assert.equal(result.status,'descriptive_two_period_change_only');
 assert.equal(result.direction,'decrease');
 assert.equal(result.percent_change,-25);
 assert.equal(result.persistent_trend_verified,false);
});
test('Lower bounds, metric epoch breaks and geography shifts are incomparable',()=>{
 const b=first(),a={...first(),period_start:'2026-10-01',value:150};
 for(const x of [{bound_type:'greater_than'},{measurement_epoch:'pre_2026_08_24'},{geography:'different'},{title_predicate:'different'},{period_days:14}]){
  assert.equal(assessTopicChange(b,{...a,...x}).status,'incomparable');
 }
});
test('Zero baseline cannot produce a finite percentage growth estimate',()=>{
 const b={...first(),value:0},a={...first(),period_start:'2026-10-01',value:40};
 const x=assessTopicChange(b,a);
 assert.equal(x.direction,'increase');
 assert.equal(x.percent_change,null);
});
test('Reversed period, missing sources or negative counts fail the audit',()=>{
 const b=first(),a={...first(),period_start:'2026-08-01'};
 assert.equal(assessTopicChange(b,a).status,'incomparable');
 assert.equal(assessTopicChange(b,{...a,period_start:'2026-10-01',source_ids:[]}).status,'incomparable');
 assert.equal(assessTopicChange(b,{...a,period_start:'2026-10-01',value:-1}).status,'incomparable');
});
