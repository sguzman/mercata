import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('2025 genre ratings cannot be used as paid game income or zero-sale estimates',()=>{
 const a=get('ontology/itch-io/genre-rating-attention-2025.json'),d=get('specimens/itch-io.json');
 assert(a.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(a.studied_catalog.number_of_games_covered,null);
 assert.equal(a.studied_catalog.genre_memberships_exclusive,false);
 assert.equal(a.observations.game_pages_without_any_public_ratings_fraction_reported,0.81);
 assert.equal(a.observations.median_public_rating_count_for_each_genre_reported,0);
 assert.equal(a.observations.category_first_paid_share_after_tabletop_correction,'Racing');
 assert.equal(a.observations.some_pages_with_paid_classification_only_itch_demo,true);
 assert(Object.values(a.unobserved).every(v=>v===null));
});
