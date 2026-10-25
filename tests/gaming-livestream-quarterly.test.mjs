import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Gaming quarter periods and same-family sources remain distinct',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/gaming-livestream-quarterly-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 assert(m.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(m.gaming.map(x=>x.watch_hours_billion),[2.19,2.22,1.79]);
 assert.deepEqual(m.gaming.map(x=>x.channels_million),[1.11,1.07,0.878]);
 assert.equal(m.independent_samples,1);
 assert.equal(m.general_live_q2.identical_to_gaming,false);
 assert.equal(m.general_live_q2.verified_disjoint_category_boundaries,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
