import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-indonesia-igrs-government-platform-evidence-2026.json');
test('Official rating provenance remains separate from Steam questionnaire self-rating',()=>{
 const x=study.category_crosswalk;
 assert.equal(x.self_declared_rating_equals_official_IGRS,false);
 assert.equal(x.self_rating_can_be_a_steam_storefront_route_per_valve,true);
 assert.equal(x.content_survey_completion_guarantees_indonesia_sale,false);
 assert.equal(x.mandatory_indonesia_unrated_game_hiding_effective_date_verified,null);
});
test('April 5 allegation and April 7 badge takedown are not game deletion or actual market revenue',()=>{
 const [a,b]=study.chronology;
 assert.equal(a.date,'2026-04-05');
 assert.equal(b.date,'2026-04-07');
 assert.equal(a.action,'government_public_dispute_of_unverified_IGRS_rating_label');
 assert.equal(b.action,'government_report_that_steam_removed_problematic_age_rating_badges');
 assert.equal(a.entire_game_removed_from_steam,null);
 assert.equal(b.entire_game_removed_from_steam,null);
 assert.equal(study.category_crosswalk.label_removed_not_entire_game_removed,true);
 for(const v of Object.values(study.unknown))assert.equal(v,null);
});
test('Government documents are attributed independent of Valve and original 293 task frame stays intact',()=>{
 const s=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Map(s.evidence.map(v=>[v.id,v])),claims=new Map(s.claims.map(v=>[v.id,v]));
 assert.equal(study.source_ids.length,3);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(id=>sources.has(id)));}
 assert(sources.get('steam-komdigi-april7-2026-rating-badge-removal-followup').url.includes('portal.komdigi.go.id'));
 assert(sources.get('steam-indonesia-ratings-official-2026').url.includes('partner.steamgames.com'));
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);
 for(const id of ['steam/access/check-countries-and-restricted-territories','steam/access/investigate-game-content-eligibility']){
  const t=all.find(t=>t.id===id);assert(t,id);
  for(const file of ['ontology/steam/steam-indonesia-igrs-government-platform-evidence-2026.md',
    'ontology/steam/steam-indonesia-igrs-government-platform-evidence-2026.json',
    'tests/steam-indonesia-igrs-government-platform-evidence.test.mjs'])assert(t.evidence.includes(file),file);
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((s,t)=>s+(t.percent??t.progress),0)/293));
});
