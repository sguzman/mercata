import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('itch.io discovery advice does not become a fabricated game earnings model',()=>{
 const d=read('ontology/itch-io/discovery-quality-2026.json');
 const s=read('specimens/itch-io.json');
 const ids=new Set(s.evidence.map(x=>x.id));
 assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.groups.length,7);
 assert.equal(d.groups.find(x=>x.id==='artificial_intelligence_disclosure').universal_ai_game_prohibition,false);
 assert.equal(d.crosswalk.browser_play_events_are_purchases,false);
 assert.equal(d.crosswalk.followers_are_buyers,false);
 assert(Object.values(d.unknown).every(v=>v===null));
 for(const g of d.groups)for(const id of g.evidence)
   assert(s.claims.some(x=>x.id===id&&x.source_ids.every(y=>ids.has(y))));
});
