import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Not Jam sequence is one consented public reporting account, not three paid game sellers',()=>{
 const x=load('ontology/itch-io/notjam-game-category-series-2023-2025.json');
 const d=load('specimens/itch-io.json');
 assert.deepEqual(x.time_points.map(t=>t.year),[2023,2024,2025]);
 assert.deepEqual(x.time_points.map(t=>t.reported_game_category_revenue_usd_lifetime),[0,0,24]);
 assert.equal(x.cumulative_differences[1].reported_game_views_cumulative_difference,31043);
 assert.equal(x.reported_2023_all_projects_free_or_donation,true);
 assert.equal(x.platform_representative,false);
 assert.equal(x.not_paid_first_release_cohort,true);
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(Object.values(x.unavailable).every(v=>v===null));
});
