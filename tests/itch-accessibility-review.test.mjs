import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditAccessibilityRelease} from '../site/itch-accessibility-review.mjs';
const matrix=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/accessibility-release-qa-matrix-2026.json',import.meta.url),'utf8'));
test('plan covers fourteen named features but cannot certify without build evidence',()=>{
 const output=auditAccessibilityRelease(matrix,[]);
 assert.equal(matrix.checks.length,14);
 assert.equal(output.plan_complete,true);assert.equal(output.build_test_review_complete,false);
 assert.equal(output.unknown_profit,null);assert.equal(output.unknown_customer_demand,null);
 assert.equal(matrix.actual_game_provided,false);
});
test('unverified and unjustified exclusions do not pass game QA',()=>{
 const rows=matrix.checks.map(x=>({id:x.id,outcome:'unverified'}));
 assert.equal(auditAccessibilityRelease(matrix,rows).build_test_review_complete,false);
 const fake=rows.map(x=>({...x,outcome:'not_applicable'}));
 assert.equal(auditAccessibilityRelease(matrix,fake).build_test_review_complete,false);
});
test('only traceable per-build observations can fulfill an actual assessment',()=>{
 const incomplete=matrix.checks.map(x=>({id:x.id,outcome:'passed',build_id:'v1',device_or_browser:'Linux keyboard',reproduction_steps:'Open settings, exercise feature',test_hours:null}));
 assert.equal(auditAccessibilityRelease(matrix,incomplete).build_test_review_complete,false);
 const checked=incomplete.map(x=>({...x,test_hours:0.25}));
 assert.equal(auditAccessibilityRelease(matrix,checked).build_test_review_complete,true);
 assert.equal(auditAccessibilityRelease(matrix,checked).certification_granted,false);
});
test('source record and plan do not invent real accessibility test results',()=>{
 const d=JSON.parse(fs.readFileSync(new URL('../specimens/itch-io.json',import.meta.url),'utf8'));
 assert(matrix.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(matrix.tests_completed,0);assert.equal(matrix.game_sale_lift_from_accessibility,null);
});
