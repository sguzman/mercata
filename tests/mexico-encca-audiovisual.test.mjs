import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Mexican ENCCA survey keeps whole and conditional populations distinct',async()=>{
 const read=async f=>JSON.parse(await readFile(new URL('../'+f,import.meta.url),'utf8'));
 const [m,d]=await Promise.all([read('ontology/youtube/mexico-encca-audiovisual-2024.json'),read('specimens/youtube.json')]);
 assert(d.evidence.some(e=>e.id===m.source_ids[0]));
 assert.equal(m.survey.urban_n+m.survey.rural_n,8750);
 assert.equal(m.observations[1].percent,55);
 assert.equal(m.observations[2].percent,66);
 assert.notEqual(m.observations[1].population,m.observations[2].population);
 assert.equal(m.survey.platform_use_item_n,null);
 assert.equal(m.conditional_platform_choices_allow_overlap,true);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
