import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSelectedReviewCombacks as audit} from '../site/steam-selected-review-comeback-denominator-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/striketwo-faded-review-comeback-conditional-events-2026.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json'),
 families=read('ontology/steam/source-families.json');
const f=()=>({fixture_id:'fixture-review-events',selected_games:1651,faded_games:1493,comeback_games:195,
 full_release_events:89,full_release_comebacks:51,major_update_events:528,major_update_comebacks:26,
 quiet_months:45724,reported_quiet_comeback_rate_pct:0.5});
test('Fading and comeback are selected monthly review count thresholds rather than sales',()=>{
 const s=study.selected_panel,z=audit(f());
 assert.equal(s.selected_games,1651);assert.equal(s.became_faded_at_least_once,1493);
 assert.equal(s.first_comeback_games,195);
 assert(Math.abs(z.game_level_ever_comeback_fraction_of_faded-195/1493)<1e-12);
 assert.equal(z.money_effect_observed,false);assert.equal(z.association_is_causal,false);
});
test('Mixed per-event and per-calendar-month frequencies cannot be added as if one cohort',()=>{
 const z=audit(f());
 assert.equal(z.full_release_event_association,51/89);
 assert.equal(z.major_update_event_association,26/528);
 assert.equal(z.quiet_months_count,45724);
 assert.equal(z.reported_quiet_month_rate_pct,0.5);
 assert.equal(study.events.find(x=>x.kind==='released_1_0_while_faded').events,89);
 assert.equal(study.events.find(x=>x.kind==='posted_sale_away_from_1_0').followed_by_comeback,15);
 for(const k of ['population_first_paid_release_median','actual_paid_order_revenue','net_publisher_profit','causal_major_update_effect','market_zero_paid_sale_fraction'])assert.equal(z[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Vendor review source is a related nonidentical cohort, not independent replication',()=>{
 const rel=families.related_documents_not_independent_replications.find(x=>x.source_id===study.source_ids[0]);
 assert(rel);assert.equal(rel.related_family_id,study.source_family_relationship.related_to);
 assert.equal(study.source_family_relationship.same_game_roster_verified,false);
 assert.equal(study.source_family_relationship.not_independent_replication,true);
 assert.equal(study.selected_panel.selected_games,1651);
 assert.equal(families.families[0].documented_selected_games,1312);
});
test('Invalid synthetic frames, invented merchant fields, and impossible incidence counts fail closed',()=>{
 for(const x of [{appid:9876},{revenue_usd:100},{fixture_id:'real study'},{selected_games:0},
   {faded_games:1652},{comeback_games:1494},{major_update_comebacks:529},{quiet_months:0},{reported_quiet_comeback_rate_pct:101}])
  assert.throws(()=>audit({...f(),...x}));
 assert.throws(()=>audit([1651,1493,195]));
});
test('Public provenance and original 293 tasks remain intact',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),cmap=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,14);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(cmap.has(id),id);assert(cmap.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
