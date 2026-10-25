import test from 'node:test';
import assert from 'node:assert/strict';
import {auditCreatorHourlyCohort as audit} from '../site/creator-hourly-audit.mjs';
const row=(token,gross_cents,labor_hours,cash_costs_cents=0)=>({token,attempted:true,gross_cents,refund_cents:0,fees_cents:0,cash_costs_cents,labor_hours,historical_sunk_hours:10});
const input={origin:'synthetic_fixture',privacy_safe_aggregation:true,cohort_frame:'synthetic complete attempt cohort',period_start:'2026-01-01',period_end:'2026-03-31',records:[row('a',0,10,500),row('b',10000,20,1000),row('c',20000,40)]};
test('Zero-income and negative-profit attempts contribute to descriptive rates',()=>{
 const x=audit(input);assert.equal(x.status,'descriptive_cohort_only');
 assert.equal(x.zero_receipt_creators,1);assert.equal(x.unpaid_attempts_with_labor,1);
 assert.equal(x.hourly_usd.q25,-.5);assert.equal(x.hourly_usd.median,4.5);
 assert.equal(x.hourly_usd.q75,5);assert.equal(x.observed,false);
 assert.equal(x.past_sunk_hours_excluded_from_current_denominator,true);
});
test('Unknown receipts are not zero and zero-hour people have no hourly rate',()=>{
 const x=audit({...input,records:[...input.records,row('d',null,5),row('e',300,0)]});
 assert.equal(x.status,'incomplete_accounting');assert.equal(x.missing_receipt_records,1);
 assert.equal(x.zero_hour_exclusions,1);assert.equal(x.hourly_sample_n,3);
});
test('Bad account source, duplicate participants and malformed money are rejected',()=>{
 assert.equal(audit({...input,origin:'public_comments'}).status,'invalid');
 assert.equal(audit({...input,records:[row('a',0,1),row('a',10,2)]}).status,'invalid');
 assert.equal(audit({...input,records:[row('a',-10,2)]}).status,'invalid');
});

test('Refunds for prior-period transactions can exceed new receipts and yield negative cash',()=>{
 const x=audit({...input,records:[{...row('carryover',0,5),refund_cents:1000}]});
 assert.equal(x.status,'descriptive_cohort_only');
 assert.equal(x.hourly_usd.median,-2);
 assert.equal(x.zero_receipt_creators,1);
});
test('Incomplete accounting never claims a full-cohort hourly distribution',()=>{
 const x=audit({...input,records:[...input.records,row('missing',null,20)]});
 assert.equal(x.partial_records_limit_inference,true);
 assert.equal(x.complete_cohort_hourly_usd,null);
 assert.equal(x.hourly_sample_n,3);
 const complete=audit(input);
 assert.deepEqual(complete.complete_cohort_hourly_usd,complete.hourly_usd);
});
test('Malformed dates, impossible date order and unsafe cent sums are rejected',()=>{
 for(const date of ['not-a-date','2026-02-30','2026-00-01'])assert.equal(audit({...input,period_start:date}).status,'invalid');
 assert.equal(audit({...input,period_start:'2026-04-01'}).status,'invalid');
 const rowTooLarge={...row('huge',0,1),fees_cents:Number.MAX_SAFE_INTEGER,cash_costs_cents:1000000000000000};
 assert.equal(audit({...input,records:[rowTooLarge]}).status,'invalid');
});

test('The research contract exposes no observed creator outcomes and retains public source IDs',async()=>{
 const {readFile}=await import('node:fs/promises');
 const load=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
 const [model,dossier]=await Promise.all([load('ontology/youtube/hourly-income-accounting.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'creator_hourly_income_cohort_accounting');
 assert(model.source_ids.every(x=>ids.has(x)));
 assert.equal(model.observed_cohort_median_net_hourly,null);
 assert.equal(model.observed_creator_data.length,0);
 assert(Object.values(model.unknowns).every(x=>x===null));
});
