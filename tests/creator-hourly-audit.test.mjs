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
