import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditZeroMedianCompatibility} from '../site/itch-zero-median-identifiability.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const base={gameRecordCount:690,reportedZeroPercentNearestWhole:45,reportedMedianUsd:0,
 assumeNonnegativeReceipts:true,assumeSameRevenueBasis:true,assumeMedianExactZero:true};
test('690 volunteer entries with 45% exact-zero cannot have exact-zero same-measure median under assumptions',()=>{
 const a=auditZeroMedianCompatibility(base),x=get('ontology/itch-io/community-analytics-sample-2026.json');
 assert.equal(a.possibleExactZeroRecordCountMin,308);assert.equal(a.possibleExactZeroRecordCountMax,313);
 assert.equal(a.minimumExactZeroRecordsForExactZeroMedianOfNonnegativeAmounts,346);
 assert.equal(a.coexistenceUnderStatedAssumptions,false);
 assert.equal(a.arithmeticContradictionConfirmedInUnderlyingData,false);
 assert.equal(a.marketwideZeroEarnerShare,null);
 assert.deepEqual(x.sample_interpretation.zero_median_arithmetic_audit.possible_exact_zero_record_counts_if_percentage_rounded,[308,313]);
 assert.equal(x.sample_interpretation.explanation_verified,null);
});
test('Possible compatible medians remain possible under other supplied sample fractions',()=>{
 const a=auditZeroMedianCompatibility({...base,gameRecordCount:5,reportedZeroPercentNearestWhole:60});
 assert.equal(a.minimumExactZeroRecordsForExactZeroMedianOfNonnegativeAmounts,3);
 assert.equal(a.possibleExactZeroRecordCountMin,3);assert.equal(a.possibleExactZeroRecordCountMax,3);
 assert.equal(a.coexistenceUnderStatedAssumptions,true);
});
test('If the source median is rounded or definitions differ, mathematical contradiction is unknown',()=>{
 for(const x of [
 {...base,assumeMedianExactZero:false},
 {...base,assumeSameRevenueBasis:false},
 {...base,assumeNonnegativeReceipts:false}
 ]){const a=auditZeroMedianCompatibility(x);assert.equal(a.coexistenceUnderStatedAssumptions,null);}
});
test('No personal fields or invalid aggregate percentages accepted; unknown population median preserved',()=>{
 for(const x of [
 {...base,username:'not-permitted'}, {...base,gameRecordCount:0},
 {...base,gameRecordCount:2.5}, {...base,reportedZeroPercentNearestWhole:-1},
 {...base,reportedZeroPercentNearestWhole:101}, {...base,assumeMedianExactZero:null}
 ])assert.throws(()=>auditZeroMedianCompatibility(x),TypeError);
 const p=get('plans/itch-io.json'),task=p.detail_tasks.find(x=>x.id==='itch-io/income/estimate-median-seller-income');
 assert(task.evidence.includes('site/itch-zero-median-identifiability.mjs'));
 assert(task.evidence.includes('tests/itch-zero-median-identifiability.test.mjs'));
 assert.equal(task.percent,54);
});
