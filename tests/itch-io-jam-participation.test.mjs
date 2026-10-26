import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Jam creation and ratings are not paid-game transactions',()=>{
 const x=load('ontology/itch-io/jam-participation-counts-2026.json');
 const s=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.platform.cumulative_games_created_for_jams,613796);
 assert.equal(x.platform.unique_creators,null);
 assert.equal(x.gamedevjs_2026.reported_submitted_entries,482);
 assert.equal(x.gamedevjs_2026.reported_rated_entries,483);
 assert.equal(x.gamedevjs_2026.submitted_versus_rated_entries_inconsistent,true);
 assert.equal(x.gamedevjs_2026.reported_rating_events,10642);
 assert.equal(x.gamedevjs_2026.number_paid_sales,null);
 assert(Object.values(x.unmeasured).every(v=>v===null));
});
