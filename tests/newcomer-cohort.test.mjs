import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditCohortProtocol,assessAggregateNewcomerIncome} from '../scripts/newcomer-income-audit.mjs';
const read=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));

test('Newcomer protocol references registered sources without inventing population incomes',async()=>{
 const [protocol,dossier]=await Promise.all([
   read('ontology/youtube/newcomer-income-cohort.json'),read('specimens/youtube.json')
 ]);
 const audited=auditCohortProtocol(protocol,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(audited.structurally_valid,true,JSON.stringify(audited.errors));
 assert.equal(audited.release_ready,false);
 assert(Object.values(protocol.results).every(x=>x===null));
 assert(protocol.acceptance_gates.every(x=>x.pass===false));
});
const make=()=>({
 sample:{entrants_n:20,observed_income_n:17,missing_income_n:3,zero_income_n:9,nonmonetized_n:12,inactive_n:5},
 entry_window_start:'2025-01-01',entry_window_end:'2025-06-30',
 population_definition:'Synthetic consented first-time publisher cohort',
 recruitment_method:'Synthetic opt-in panel',source_ids:['synthetic-test-reference'],
 reporting_currency:'USD',income_basis:'native_revenue_before_costs',
 median_income:0,excludes_nonmonetized:false,excludes_inactive:false,
 claims_representative:false,probability_sampling:false,frame_coverage_verified:false,
 nonresponse_adjustment_documented:false,uncertainty_reported:false
});
test('Synthetic nonprobability cohort can be structurally valid without a population inference',()=>{
 const result=assessAggregateNewcomerIncome(make());
 assert.equal(result.structurally_valid,true,JSON.stringify(result.errors));
 assert.equal(result.population_inference_permitted,false);
});
test('Newcomer audit rejects unearned representative claims',()=>{
 const x=make();x.claims_representative=true;
 assert(assessAggregateNewcomerIncome(x).errors.some(e=>e.includes('representative')));
});
test('Newcomer audit rejects erased zero earners and mismatched response counts',()=>{
 const x=make();x.sample.observed_income_n=4;x.sample.zero_income_n=9;
 const result=assessAggregateNewcomerIncome(x);
 assert(result.errors.some(e=>e.includes('partition')));
 assert(result.errors.some(e=>e.includes('zero income')));
});
test('Newcomer audit rejects selection excluding the unsuccessful and person-level public rows',()=>{
 const x=make();x.excludes_nonmonetized=true;x.raw_person_level_rows=[{name:'synthetic'}];
 const result=assessAggregateNewcomerIncome(x);
 assert(result.errors.some(e=>e.includes('Survivor-only')));
 assert(result.errors.some(e=>e.includes('Individual creator')));
});
test('Newcomer audit rejects invalid money and missing methodology',()=>{
 const x=make();x.median_income=-1;x.reporting_currency=null;x.recruitment_method=null;
 const result=assessAggregateNewcomerIncome(x);
 assert(result.errors.some(e=>e.includes('median income')));
 assert(result.errors.some(e=>e.includes('Currency')));
 assert(result.errors.some(e=>e.includes('recruitment')));
});
test('Synthetic probability-sample gate requires coverage, nonresponse and uncertainty together',()=>{
 const x=make();x.probability_sampling=true;x.frame_coverage_verified=true;
 x.nonresponse_adjustment_documented=true;x.uncertainty_reported=true;x.claims_representative=true;
 const result=assessAggregateNewcomerIncome(x);
 assert.equal(result.structurally_valid,true,JSON.stringify(result.errors));
 assert.equal(result.population_inference_permitted,true);
});
