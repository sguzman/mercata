import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditTrafficConcentration} from '../site/traffic-concentration.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const example=()=>({owner_authorized:true,complete_partition:true,channel_scope:'synthetic-channel-only',
 period:'2026-09-01..2026-09-30',unit:'view_events',includes_direct_unknown:true,includes_paid_sources:true,
 sources:[{id:'browse',views:80},{id:'search',views:20},{id:'direct_or_unknown',views:0},{id:'ads',views:0}]});
test('Traffic source taxonomy cites official definitions but reports no channel statistics',async()=>{
 const [model,dossier]=await Promise.all([read('ontology/youtube/traffic-concentration.json'),read('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'creator_traffic_source_concentration_protocol');
 assert(model.source_ids.every(x=>ids.has(x)));
 assert(model.source_families.length>=9);
 assert(model.source_families.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(model.research_gates.every(x=>x.pass===false));
 assert(Object.values(model.unmeasured).every(x=>x===null));
});
test('Synthetic complete source partition computes descriptive HHI but not profits',()=>{
 const result=auditTrafficConcentration(example());
 assert.equal(result.status,'descriptive_only');
 assert.equal(result.metrics.total_views,100);
 assert.equal(result.metrics.largest_source_share,.8);
 assert(Math.abs(result.metrics.hhi-.68)<1e-12);
 assert(Math.abs(result.metrics.effective_source_count-1/.68)<1e-12);
 assert(result.limitation.includes('not owned audience'));
});
test('Partial or unauthorized traffic and mixed units are rejected',()=>{
 const a=example();a.complete_partition=false;assert.equal(auditTrafficConcentration(a).status,'invalid');
 const b=example();b.owner_authorized=false;assert.equal(auditTrafficConcentration(b).status,'invalid');
 const c=example();c.unit='watch_hours';assert.equal(auditTrafficConcentration(c).status,'invalid');
});
test('Unknown/paid rows must be explicitly retained, even when their counts are zero',()=>{
 const a=example();a.includes_direct_unknown=false;assert.equal(auditTrafficConcentration(a).status,'invalid');
 const b=example();b.includes_paid_sources=false;assert.equal(auditTrafficConcentration(b).status,'invalid');
});
test('Duplicate, negative, missing and unsafe counts are refused',()=>{
 const a=example();a.sources[1].id='browse';assert.equal(auditTrafficConcentration(a).status,'invalid');
 const b=example();b.sources[1].views=-1;assert.equal(auditTrafficConcentration(b).status,'invalid');
 const c=example();c.sources[1].views=Number.MAX_SAFE_INTEGER;assert.equal(auditTrafficConcentration(c).status,'invalid');
 const d=example();d.sources.forEach(x=>x.views=0);assert.equal(auditTrafficConcentration(d).status,'invalid');
});
