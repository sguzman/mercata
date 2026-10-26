import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Yearly creations and published pages remain separate from cumulative catalog and paid sales',()=>{
 const m=load('ontology/itch-io/historical-game-supply-2015-2026.json');
 const d=load('specimens/itch-io.json'),refs=new Set(d.evidence.map(x=>x.id));
 assert(m.source_ids.every(id=>refs.has(id)));
 assert.equal(m.observations.find(x=>x.id==='year2015_game_created').value,23708);
 assert.equal(m.observations.find(x=>x.id==='year2017_project_pages_created').value,100864);
 assert.equal(m.observations.find(x=>x.id==='year2017_project_pages_published').value,68526);
 assert.equal(m.observations.find(x=>x.id==='year2019_games_total').value,200000);
 assert.equal(m.observations.find(x=>x.id==='oct2026_browse_games').value,1780861);
 assert.equal(m.derived.year2017_created_to_published_pages_ratio,0.6794);
 assert.equal(m.derived.ratio_is_valid_growth_rate,false);
 assert(Object.values(m.unobserved).every(x=>x===null));
});
