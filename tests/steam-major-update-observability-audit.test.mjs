import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {auditSyntheticSteamMajorUpdateCohort as audit} from "../site/steam-major-update-observability-audit.mjs";
const load=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const study=load("ontology/steam/steam-major-update-review-months-vs-visibility-rounds-2026.json"),
 dossier=load("specimens/steam.json"),plan=load("plans/steam.json"),queue=load("queues/steam.json");
const fixture=()=>({fixture_id:"fixture-selected-events",total_games:1312,
 no_major_month:665,one_major_month:281,two_major_month:132,three_or_four_major_month:131,five_plus_major_month:103,
 observed_major_months:520,reported_unique_games_later:375,reported_unique_games_earlier:311,
 selected_firstyear_review_floor:100,same_underlying_cohort:true});
test("Five Major Update announcement-month bins partition the selected 1312 games",()=>{
 const r=audit(fixture());
 assert.equal(r.selected_cohort_games,1312);
 assert.equal(r.games_with_no_major_month,665);
 assert.equal(r.games_with_at_most_one_major_month,946);
 assert.equal(r.independently_sampled_datasets,1);
});
test("The two different unique-game denominators remain unresolved",()=>{
 const r=audit(fixture());
 assert.equal(r.observed_announcement_months,520);
 assert.equal(r.earlier_article_contributing_games,311);
 assert.equal(r.later_article_contributing_games,375);
 assert.equal(r.contributors_identified_under_one_common_eligibility_rule,null);
 assert.equal(study.post_yearone_comparison.resolved_same_eligibility_contributor_game_count,null);
});
test("Announcements are not round activations, causal lifts, paid sales or profit",()=>{
 const r=audit(fixture());
 for(const x of ["actual_round_activations","rounds_remaining","causal_review_lift","paid_sale_lift","after_cost_income"])
  assert.equal(r[x],null,x);
 assert.equal(study.official_steamworks_rounds.missing_major_update_post_proves_unused_rounds,false);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test("Malformed partitions, missing provenance flags and real-life extras fail closed",()=>{
 for(const patch of [{no_major_month:666},{five_plus_major_month:-1},{one_major_month:1.2},
  {reported_unique_games_later:525},{same_underlying_cohort:false},
  {selected_firstyear_review_floor:0},{actual_rounds_remaining:5}])
  assert.throws(()=>audit({...fixture(),...patch}));
 assert.throws(()=>audit([1312,520]));
});
test("Related sources and original 293 tasks maintain their references",()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)), claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>ids.has(x)),id);}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(x=>x.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
