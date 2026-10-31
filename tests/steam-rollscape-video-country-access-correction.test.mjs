import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-rollscape-vietnam-creator-regional-access-correction-2024.json');
const dossier=load('specimens/steam.json'),plan=load('plans/steam.json'),queue=load('queues/steam.json');
const day=s=>Date.parse(s+'T00:00:00Z');
test('Steam identity and calendar chronology retain distinct evidence roles',()=>{
 assert.equal(x.game.appid,2904290);
 assert.equal(x.game.official_steam_release,'2024-05-22');
 assert(day(x.game.official_steam_release)<day(x.developer_account.post_published_on));
 assert(day(x.regional_access.published_on)<day(x.developer_account.post_published_on));
});
test('Same-author correction displaces sensational zero-sales headline, without channel attribution',()=>{
 assert.equal(x.developer_account.original_headline_says_zero_sales,true);
 assert.equal(x.developer_account.same_author_correction_vietnam_attributed_sales,1);
 assert.equal(x.developer_account.correction_buyer_might_be_creator_unverified,true);
 assert.equal(x.developer_account.causal_no_impact_proved,false);
 assert.equal(x.developer_account.incremental_video_caused_sales,null);
});
test('Independent historical store restrictions are not a census of exposure or an identified causal effect',()=>{
 assert.equal(x.regional_access.reported_store_and_payment_access_problems_since,'2024-05');
 assert.equal(x.regional_access.some_user_store_checkout_access_restricted_reported,true);
 for(const field of ['all_viewers_unable_to_purchase_verified','every_isp_and_region_blocked_verified','individual_viewers_actual_countries_verified','per_game_country_eligibility_verified','restriction_is_proven_cause_of_specific_game_sales']){
  assert.equal(x.regional_access[field],false,field);
 }
 assert.equal(x.developer_account.creator_subscribers_approximate,800000);
 assert.equal(x.developer_account.video_views_approximate,100000);
 assert.equal(x.developer_account.video_metrics_independently_audited,false);
});
test('No attributed purchases, legal-publisher payee identity or broad-market prevalence are inferred',()=>{
 assert.equal(x.game.payment_partner_legal_entity_verified,null);
 assert.equal(x.developer_account.campaign_utm_join_verified,false);
 assert(Object.values(x.unknown).every(v=>v===null));
 assert.equal(x.private_account_records_accessed,false);
});
test('Public author, store and national-news sources join ten bounded claim records',()=>{
 const sources=new Map(dossier.evidence.map(v=>[v.id,v]));
 const claims=new Map(dossier.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,3);
 assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){
  const c=claims.get(id);assert(c,id);
  assert(c.source_ids.length>0&&c.source_ids.every(id=>sources.has(id)));
 }
 assert.equal(dossier.evidence.length,267);
 assert.equal(dossier.claims.length,1562);
});
test('Existing five credited tasks and fixed 293-task Steam frame preserve honest progress',()=>{
 const tasks=[...plan.detail_tasks,...queue.queues.flatMap(g=>g.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(t=>t.id)).size,293);
 for(const id of ["steam/discovery/quantify-external-creator-referrals","steam/discovery/investigate-organic-versus-paid-traffic","steam/access/check-countries-and-restricted-territories","steam/risk/investigate-localization-and-regulatory-shocks","risk/geo"]){
  const t=tasks.find(t=>t.id===id);
  assert(t.evidence.includes('ontology/steam/steam-rollscape-vietnam-creator-regional-access-correction-2024.md'));
  assert(t.evidence.includes('ontology/steam/steam-rollscape-vietnam-creator-regional-access-correction-2024.json'));
 }
 const exact=tasks.reduce((s,t)=>s+(t.percent??t.progress),0)/293;
 assert.equal(plan.progress_percent,Math.round(exact));
});
