import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Academic open source sample remains distinct from itch.io game sales population',()=>{
 const x=load('ontology/itch-io/open-source-engineering-2026.json');
 const d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.analyzed_projects,491);
 assert.equal(x.manual_excluded_non_games_or_bad_source,9);
 assert.equal(x.ratings.missing_count,289);
 assert.equal(x.ratings.missing_means_zero_revenue,false);
 assert.equal(x.engineering.manually_confirmed_automated_tests,36);
 assert.equal(x.engineering.unidentified_engine_projects,231);
 assert.equal(x.engineering.causal_testing_effect_identified,false);
 assert.equal(x.engineering.automated_test_rating_p_value,0.545);
 assert(Object.values(x.unknown).every(v=>v===null));
});
