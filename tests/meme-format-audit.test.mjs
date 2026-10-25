import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditMemeFormatTaxonomy} from '../site/meme-format-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Six overlapping forms separate Shorts Remix product credit from themed humor and subscribers',async()=>{
 const [d,source]=await Promise.all([load('ontology/youtube/meme-format-typology-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditMemeFormatTaxonomy(d,new Set(source.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert(d.formats.find(x=>x.id==='tier_list').may_overlap.includes('sketch_parody'));
 assert.equal(d.dated_bounded_observation.comedy_only_fraction,null);
});
test('Reject fake fan counts and combining Studio Collaborations with remixes',async()=>{
 const [d,s]=await Promise.all([load('ontology/youtube/meme-format-typology-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(s.evidence.map(x=>x.id)),copy=()=>structuredClone(d);
 const a=copy();a.formats[0].unique_audience_size=500;assert(!auditMemeFormatTaxonomy(a,ids).valid);
 const b=copy();b.remix_controls.studio_collaborations_same_feature=true;assert(!auditMemeFormatTaxonomy(b,ids).valid);
 const c=copy();c.dated_bounded_observation.comedy_only_fraction=1;assert(!auditMemeFormatTaxonomy(c,ids).valid);
});
