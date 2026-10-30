import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {auditSyntheticFirstGameDisclosure as audit} from "../site/steam-firstgame-selfreport-guard.mjs";
const load=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const study=load("ontology/steam/steam-hell-forge-low-gross-firstgame-labor-2026.json"),
 dossier=load("specimens/steam.json"),plan=load("plans/steam.json"),queue=load("queues/steam.json");
const fixture=()=>({fixture_id:"fixture-hellforge-arithmetic",cumulative_gross_usd_cents:150000,
 cumulative_reported_copies:450,firstmonth_reviews:20,cumulative_window:"through_publication",review_window:"first_month"});
test("Author-described gross and May copies cannot be reconciled as a March review ratio",()=>{
 const z=audit(fixture());assert.equal(z.reported_gross_usd,1500);
 assert.equal(z.reported_copies,450);
 assert(Math.abs(z.approximate_gross_per_reported_copy_usd-1500/450)<1e-12);
 assert.equal(z.review_and_sale_windows_match,false);
 assert.equal(z.reviews_per_reported_copy_if_windows_match,null);
 assert.equal(z.gross_per_unit_is_author_income,false);
});
test("No personal profit, payee share, wage or Steam population estimate is invented",()=>{
 const z=audit(fixture());
 for(const k of ["signed_publisher_share","reported_bank_deposit","after_cost_profit","verified_work_hours",
  "hourly_wage","population_developer_median","observed_zero_sale_fraction"])assert.equal(z[k],null,k);
 assert.equal(study.public_store.store_listing_corrobates_sales,false);
 assert.equal(study.public_store.legal_payee_identified,false);
 assert(Object.values(study.outcome_bounds).every(x=>x===null));
});
test("Window-consistent synthetic review ratio is explicitly conditional, not a platform coefficient",()=>{
 const z=audit({...fixture(),review_window:"through_publication"});
 assert.equal(z.reviews_per_reported_copy_if_windows_match,20/450);
 assert.equal(z.population_developer_median,null);
});
test("Invalid synthetic inputs and real account identifiers fail closed",()=>{
 for(const bad of [
 {...fixture(),account_id:"personal"}, {...fixture(),developer_cash_usd:1500},
 {...fixture(),cumulative_gross_usd_cents:-1}, {...fixture(),cumulative_reported_copies:1.5},
 {...fixture(),cumulative_window:"since_never"},{...fixture(),review_window:"2026-04-01"},
 {...fixture(),firstmonth_reviews:Number.MAX_SAFE_INTEGER+1}, [1500,450,20]
 ])assert.throws(()=>audit(bad));
});
test("Two registered public references and unchanged 293 task identities are source linked",()=>{
 const sids=new Set(dossier.evidence.map(x=>x.id)), claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(sids.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sids.has(s)),id);}
 const a=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(q=>q.tasks.map(x=>x.progress))];
 assert.equal(a.length,293);assert.equal(plan.progress_percent,Math.round(a.reduce((x,y)=>x+y,0)/293));
});
