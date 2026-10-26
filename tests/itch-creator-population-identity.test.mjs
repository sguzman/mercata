import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Creator population ontology defines accounts, games, people, teams and actual paid seller distinctly',()=>{
 const x=get('ontology/itch-io/creator-population-account-person-game-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.units.length,9);
 assert.equal(new Set(x.units.map(u=>u.id)).size,9);
 assert(x.units.every(u=>u.known_global_count===null));
 assert.equal(x.target_commercial_cohort.include_zero_orders,true);
 assert.equal(x.target_commercial_cohort.include_delisted_titles,true);
 assert.deepEqual(x.target_commercial_cohort.windows_days,[30,90,365]);
 assert.equal(x.target_commercial_cohort.population_size,null);
 assert.equal(x.target_commercial_cohort.zero_sale_fraction,null);
});
test('A complete definition does not invent actual marketplace paid publishers',()=>{
 const x=get('ontology/itch-io/creator-population-account-person-game-2026.json'),p=get('plans/itch-io.json');
 assert.equal(x.public_listing_to_unique_merchant_conversion,null);
 assert.equal(x.independent_human_count,null);
 assert.equal(x.repeat_creator_fraction,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/identity/define-creator-populations');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-creator-population-identity.test.mjs'));
 assert.equal(p.total_tracked_tasks,244);
});
