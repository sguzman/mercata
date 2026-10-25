import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditNicheUploads} from '../site/niche-upload-audit.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Five dated title/topic upload observations retain source, window and lower-bound semantics',async()=>{
 const [d,s,o]=await Promise.all(['ontology/youtube/niche-upload-volume-2024-2026.json','specimens/youtube.json','ontology/youtube/topic-observations.json'].map(read));
 assert.deepEqual(auditNicheUploads(d,new Set(s.evidence.map(x=>x.id)),o),{valid:true,errors:[]});
 assert.equal(d.observations.find(x=>x.id==='latte_art_title').lower_bound_exclusive,30000);
 assert.equal(d.observations.find(x=>x.id==='origami_related').lower_bound_exclusive,300000);
 assert.equal(d.observations.find(x=>x.id==='cake_decoration_related').period_end,'2024-09-30');
 assert(d.observations.every(x=>x.unique_uploading_channels===null));
});
test('Niche upload audit blocks invented exact counts and creator estimates',async()=>{
 const [d,s,o]=await Promise.all(['ontology/youtube/niche-upload-volume-2024-2026.json','specimens/youtube.json','ontology/youtube/topic-observations.json'].map(read));const ids=new Set(s.evidence.map(x=>x.id)),copy=()=>structuredClone(d);
 const a=copy();a.observations[0].exact_count=30001;assert(!auditNicheUploads(a,ids,o).valid);
 const b=copy();b.observations[1].unique_uploading_channels=200;assert(!auditNicheUploads(b,ids,o).valid);
 const c=copy();c.observations[4].lower_bound_exclusive=1;assert(!auditNicheUploads(c,ids,o).valid);
});
