import test from 'node:test';
import assert from 'node:assert/strict';
import {assessViewComparison,VIEW_BREAK_DATE,MEASUREMENT_KINDS} from '../site/metric-compatibility.mjs';

test('August 24 2026 is the first-frame public-view break',()=>{
  assert.equal(VIEW_BREAK_DATE,'2026-08-24');
  assert.equal(MEASUREMENT_KINDS.length,7);
  const result=assessViewComparison({date:'2026-08-23',metric:'public_view'},{date:'2026-08-24',metric:'public_view'});
  assert.equal(result.status,'definition_conflict');
  assert.equal(result.compatible,false);
  assert(result.reason.includes('no universal conversion factor'));
});
test('Same-definition public views have structural rather than statistical comparability',()=>{
  const before=assessViewComparison({date:'2026-08-20',metric:'public_view'},{date:'2026-08-22',metric:'public_view'});
  const after=assessViewComparison({date:'2026-08-24',metric:'public_view'},{date:'2026-09-01',metric:'public_view'});
  assert.equal(before.status,'structurally_comparable');
  assert.equal(after.status,'structurally_comparable');
  assert(after.reason.includes('sampling method'));
});
test('Other measures across the break require method and policy review',()=>{
  for(const m of MEASUREMENT_KINDS.filter(x=>x.id!=='public_view')){
    const r=assessViewComparison({date:'2026-08-01',metric:m.id},{date:'2026-09-01',metric:m.id});
    assert.equal(r.status,'requires_method_review');
    assert.equal(r.compatible,false);
  }
});
test('Different metrics and nonexistent dates are never silently coerced',()=>{
  assert.equal(assessViewComparison({date:'2026-10-01',metric:'public_view'},{date:'2026-10-02',metric:'engaged_view'}).status,'definition_conflict');
  for(const bad of ['','2026-02-30','2026-13-01','2026/08/24',null]){
    assert.equal(assessViewComparison({date:bad,metric:'public_view'},{date:'2026-09-01',metric:'public_view'}).status,'insufficient_metadata');
  }
  assert.equal(assessViewComparison({date:'2026-09-01',metric:'unknown'},{date:'2026-09-01',metric:'public_view'}).compatible,false);
});
