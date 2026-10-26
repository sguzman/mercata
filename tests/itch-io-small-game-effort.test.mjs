import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Small game prototype and jam hours are not paid game sales or standard developer labor estimates',()=>{
 const m=read('ontology/itch-io/small-game-production-effort-2025-2026.json');
 const d=read('specimens/itch-io.json');
 assert(m.source_ids.every(x=>d.evidence.some(s=>s.id===x)));
 assert.equal(m.examples.length,3);
 assert.equal(m.examples[0].release_day_browser_play_events,101);
 assert.equal(m.examples[0].settled_game_sales,null);
 assert.equal(m.examples[1].solo_hours_reported_approx,140);
 assert.equal(m.examples[2].sum_of_reported_phase_hours,51);
 assert.equal(m.examples[2].total_person_hours_across_team,null);
 assert(Object.values(m.unmeasured).every(v=>v===null));
});
