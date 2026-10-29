import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const d=get('specimens/steam.json'),x=get('ontology/steam/language-localization-and-discoverability-2026.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Store languages, game languages, region and paid buyers remain separate',()=>{
 assert.equal(x.capabilities.store_page_translation_independent_from_in_game,true);
 assert.equal(x.capabilities.game_support_only_languages_enable_platform_ui_api,false);
 assert.equal(x.platform.language_equal_country,false);
 assert.equal(x.platform.non_english_users_equal_paid_buyers,false);
 assert.equal(x.platform.full_client_platform_language_count_documented,29);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Source and claim provenance and stable task inventory',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(Math.round(scores.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});
