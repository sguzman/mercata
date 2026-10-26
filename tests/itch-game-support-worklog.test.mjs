import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchGameSupportWorklog} from '../site/itch-game-support-worklog.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const event=(id,category,platform,minutes)=>({event_id:id,project_version:'v1.2.3',platform,category,minutes,issue_id:'example_issue',source_of_report:'synthetic_test',reported_at_utc:'2026-10-20T18:30:00Z',resolution_status:'resolved'});
test('Maintenance plan accepts synthetic release/bug/customer work without inventing labor rates',()=>{
 const x=auditItchGameSupportWorklog([event('1','bug_fix','linux',45),event('2','compatibility_regression','html5_desktop',30),event('3','buyer_support','linux',15)]);
 assert.equal(x.valid,true);assert.equal(x.logged_minutes,90);assert.equal(x.logged_hours,1.5);
 assert.equal(x.platform_minutes.linux,60);assert.equal(x.category_minutes.buyer_support,15);
 assert.equal(x.profit_after_labor,null);assert.equal(x.representative_market_maintenance_hours,null);assert.equal(x.unique_paid_buyers,null);
});
test('Duplicate, missing, noninteger or unsupported-platform events cannot fabricate hours',()=>{
 const one=event('1','bug_fix','linux',45);
 const samples=[[one,one],[{...one,event_id:'2',minutes:0.7}],[{...one,event_id:'2',platform:'unknown'}],[{...one,event_id:'2',project_version:null}]];
 for(const batch of samples){const x=auditItchGameSupportWorklog(batch);assert.equal(x.valid,false);assert.equal(x.logged_hours,null);}
});
test('Evidence-backed workload planning complete but zero real game sessions',()=>{
 const x=get('ontology/itch-io/game-patch-support-workload-2026.json'),d=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.real_bug_reports_collected,0);assert.equal(x.real_support_hours_logged,0);assert.equal(x.real_builds_exercised,0);
 assert.equal(x.unknown.typical_game_postlaunch_patch_hours,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/special-games/plan-release-maintenance-workload');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-game-support-worklog.test.mjs'));
});
