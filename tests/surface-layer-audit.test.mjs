import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditYouTubeSurfaceLayers} from '../site/surface-layer-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
const get=async()=>Promise.all(['ontology/youtube/content-formats.json','ontology/youtube/revenue-pathways.json','specimens/youtube.json'].map(load));
test('Eight product surface layers cite original formats, features and revenue routes',async()=>{
 const [m,r,d]=await get();assert.deepEqual(auditYouTubeSurfaceLayers(m,r,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert(m.surface_layers.every(x=>x.measured_cross_surface_conversion===null));
});
test('Audit catches TV monetization doubles, podcast format confusion and fictional earnings',async()=>{
 const [m,r,d]=await get(),known=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(m);
 const tv=copy();tv.surface_layers.find(x=>x.id==='connected_tv').money_pathway_ids=['watch-page-ads'];assert(!auditYouTubeSurfaceLayers(tv,r,known).valid);
 const pod=copy();pod.surface_layers.find(x=>x.id==='podcast_collection').kind='new_video';assert(!auditYouTubeSurfaceLayers(pod,r,known).valid);
 const income=copy();income.surface_layers.find(x=>x.id==='earning_products').observed_creator_median_income=1;assert(!auditYouTubeSurfaceLayers(income,r,known).valid);
});