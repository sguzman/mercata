import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditLoginStateObservability} from '../site/viewer-login-audit.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Signed-out viewer and logged-in view metrics remain separate from public channel API counts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/viewer-person-metrics.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditLoginStateObservability(m,new Set(d.evidence.map(e=>e.id))),{valid:true,errors:[]});
 assert.equal(m.login_state_observability.official_login_metric.id,'viewerPercentage');
 assert.equal(m.login_state_observability.official_modeled_unique_people.can_include_signed_out,true);
 assert(m.login_state_observability.contrasted_counts.every(x=>!x.supports_deduplicated_signed_out_person_count));
});
test('Global signed-out unique people and inferred accounts are not populated from viewing percentages',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/viewer-person-metrics.json'),load('specimens/youtube.json')]);
 const sources=new Set(d.evidence.map(e=>e.id)),copy=()=>structuredClone(m);
 const a=copy();a.login_state_observability.all_global_viewer_login_fraction=0.8;assert(!auditLoginStateObservability(a,sources).valid);
 const b=copy();b.login_state_observability.official_login_metric.not_verified_unique_person_share=false;assert(!auditLoginStateObservability(b,sources).valid);
 const c=copy();c.login_state_observability.contrasted_counts[1].supports_deduplicated_signed_out_person_count=true;assert(!auditLoginStateObservability(c,sources).valid);
 const d2=copy();d2.unmeasured.nonregistered_view_share=0.2;assert(!auditLoginStateObservability(d2,sources).valid);
});
