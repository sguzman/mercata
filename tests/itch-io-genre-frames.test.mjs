import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const d=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Niche filter counts are overlapping supply, not buyer outcomes',()=>{
 const x=d('ontology/itch-io/paid-genre-tag-frames-2026.json');
 assert.deepEqual(x.observations.map(y=>y.count),[7456,5117,857]);
 assert.deepEqual(x.observations.map(y=>y.classification_type),['genre','theme_tag','mood_tag']);
 assert(x.observations.every(y=>y.simultaneous_measurement===false && y.purchases===null && y.profit===null));
 assert(Object.values(x.unknown).every(v=>v===null));
});
