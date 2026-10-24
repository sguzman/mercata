import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditRetentionObservability,compareRetentionInputs} from '../site/retention-observability-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Metric dictionary has official sources and no invented completion outcomes',async()=>{
 const [model,d]=await Promise.all([load('ontology/youtube/retention-observability.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditRetentionObservability(model,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Start views, Shorts stayed-to-watch and full completion do not share units',()=>{
 const b={metric_id:'shorts_stayed',unit:'initial_short_view_opportunities',format:'shorts',content_duration_seconds:30,definition_epoch:'2026-09',observation_period:'2026-09',source_population:'owner_authorized_video',value:50};
 const x=compareRetentionInputs(b,{...b,metric_id:'public_video_views',unit:'view_start_events',value:500});
 assert.equal(x.status,'incomparable');assert.equal(x.difference,null);
});
test('Only like-for-like artificial inputs support arithmetic, not causal uplift',()=>{
 const v={metric_id:'shorts_stayed',unit:'initial_short_view_opportunities',format:'shorts',content_duration_seconds:30,definition_epoch:'2026-09',observation_period:'2026-09',source_population:'synthetic_fixture',value:45};
 const x=compareRetentionInputs(v,{...v,value:50});
 assert.equal(x.status,'same_unit_descriptive_only');assert.equal(x.difference,5);assert.equal(x.causal_lift_verified,false);
});
test('Audit rejects private owner completion values disguised as public measures',async()=>{
 const [model,d]=await Promise.all([load('ontology/youtube/retention-observability.json'),load('specimens/youtube.json')]);
 model.metrics[0].value=1000;model.owner_report.retention_curve_observed=true;
 model.unmeasured.representative_full_video_completion_share=0.8;
 const errors=auditRetentionObservability(model,new Set(d.evidence.map(x=>x.id))).errors;
 assert(errors.includes('invented metric observation'));assert(errors.includes('false owner data'));assert(errors.includes('fictitious completion distribution'));
});
