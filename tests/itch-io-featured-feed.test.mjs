import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Public game-feed visibility counts cannot infer paid game unit sales',()=>{
 const x=read('ontology/itch-io/feed-volume-featured-2026.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(y=>y.id===id)));
 assert.equal(x.games_observed_first_seen,118017);
 assert.equal(x.tracking_days,152);
 assert.equal(x.reported_new_games_per_day_approx,776);
 assert.equal(x.ever_featured_game_count,2477);
 assert.equal(x.observed_2026_january_week.games_first_seen,6121);
 assert.equal(x.observed_2026_january_week.zero_ratings_recorded,4897);
 assert.equal(x.observed_2026_january_week.featured_ever,57);
 assert.equal(x.case_feature.featured_consecutive_days,112);
 assert(Object.values(x.unknown).every(y=>y===null));
});
