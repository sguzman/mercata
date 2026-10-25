import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditAccountPopulationGraph} from '../site/product-account-population-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
test('16 Google/YouTube account and paid role concepts keep their denominators separate',async()=>{
 const [graph,dossier]=await Promise.all(['ontology/youtube/product-account-population-graph-2026.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditAccountPopulationGraph(graph,new Set(dossier.evidence.map(s=>s.id))),{valid:true,errors:[]});
 assert.equal(graph.edges.length,15);
 assert(graph.edges.every(e=>e.one_to_one_guaranteed===false));
});
test('Population graph refuses one-to-one links or invented creator profit',async()=>{
 const [g,d]=await Promise.all(['ontology/youtube/product-account-population-graph-2026.json','specimens/youtube.json'].map(load));
 const source=new Set(d.evidence.map(s=>s.id));
 const a=structuredClone(g);a.edges[0].one_to_one_guaranteed=true;assert(!auditAccountPopulationGraph(a,source).valid);
 const b=structuredClone(g);b.nodes[0].measured_unique_people=1;assert(!auditAccountPopulationGraph(b,source).valid);
 const c=structuredClone(g);c.nodes[0].source_ids=['unregistered'];assert(!auditAccountPopulationGraph(c,source).valid);
});
