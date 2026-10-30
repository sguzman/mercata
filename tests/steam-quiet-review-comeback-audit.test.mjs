import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {auditSyntheticQuietLaunchCohort as audit} from "../site/steam-quiet-review-comeback-audit.mjs";
const load=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const study=load("ontology/steam/steam-quiet-launch-yearly-review-comeback-selected-cohort-2026.json"),
 dossier=load("specimens/steam.json"),plan=load("plans/steam.json"),queue=load("queues/steam.json");
const input=()=>({fixture_id:"fixture-cohort",current_paid_indie_listings:12961,under10_reviews:7101,
 reviews10to99:4209,quiet_later_bigger_year:233,first_bigger_y2:130,first_bigger_y3:53,
 first_bigger_y4to6:50,at_risk_y2:4209,at_risk_y3:4079,
 still_listed_2026:true,includes_historically_delisted:false});
test("Current survivor-only 2020–2022 price-tagged cohort partitions without inventing sales",()=>{
 const s=audit(input());
 assert.equal(s.current_survivor_sample_count,12961);assert.equal(s.quiet_review_group_count,4209);
 assert.equal(s.remaining_highreview_listings,1651);
 assert.equal(s.fraction_ever_more_annual_reviews_in_survivors,233/4209);
 assert.equal(s.verified_paid_units,null);assert.equal(s.zero_paid_sale_fraction,null);
});
test("First larger-review-year hazards respect year-specific at-risk denominators",()=>{
 const s=audit(input());
 assert.equal(s.first_bigger_year2_hazard,130/4209);
 assert.equal(s.first_bigger_year3_hazard,53/4079);
 assert.equal(s.combined_year4_to6_first_improvements,50);
 assert.equal(s.representative_original_paid_release_recovery_rate,null);
});
test("Review-activity association never establishes causal update uplift or profit",()=>{
 const s=audit(input()),g=study.descriptive_groups;
 assert.equal(g.early_access_to_full_release.n+g.non_early_access_later_posts.n+g.non_early_access_no_later_posts.n,4209);
 assert.equal(s.causal_update_effect,null);assert.equal(s.actual_earnings_median,null);
 assert.equal(study.methodological_limits.annual_review_recovery_is_causal_sale_impact,false);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test("Invalid scopes, fabricated transaction columns, and bad denominator arithmetic fail closed",()=>{
 const x=input();
 for(const patch of [
  {current_paid_indie_listings:11000},{under10_reviews:-1},{reviews10to99:0.25},
  {quiet_later_bigger_year:234},{first_bigger_y4to6:51},{at_risk_y3:4209},
  {still_listed_2026:false},{includes_historically_delisted:true},{actual_paid_units:233}
 ])assert.throws(()=>audit({...x,...patch}));
 assert.throws(()=>audit([12961,4209,233]));
});
test("Study preserves original tasks, public source claim attribution, and null outcomes",()=>{
 const sids=new Set(dossier.evidence.map(x=>x.id)),c=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,1);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(sids.has(id));
 for(const id of study.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(s=>sids.has(s)));}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(Math.round(scores.reduce((a,b)=>a+b,0)/293),plan.progress_percent);
});
