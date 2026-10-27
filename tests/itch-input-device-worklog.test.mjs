import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditInputDeviceWorklog} from '../site/itch-input-device-worklog.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const make=(id,device,input,minutes)=>({session_id:id,build_version:'v0.1',issue_code:'fixture',device,input,kind:'compatibility_qa',outcome:'pass',minutes,recorded_at_utc:'2026-10-27T12:00:00Z'});
test('Device worklog totals a synthetic session once and only values labor when rate specified',()=>{
 const events=[make('one','desktop','gamepad',30),make('two','phone','touchscreen',60)];
 const x=auditInputDeviceWorklog(events);assert.equal(x.valid,true);assert.equal(x.documented_input_minutes,90);
 assert.equal(x.minutes_by_device.phone,60);assert.equal(x.minutes_by_input.gamepad,30);
 assert.equal(x.valued_labor_usd,null);assert.equal(x.representative_device_qa_cost_usd,null);
 const v=auditInputDeviceWorklog(events,{usdPerHour:16});assert.equal(v.valued_labor_usd,24);assert.equal(v.device_valuation_usd.phone,16);
});
test('Duplicate sessions cannot inflate cost and empty observations remain unknown',()=>{
 const x=make('same','desktop','gamepad',30);
 assert.equal(auditInputDeviceWorklog([x,{...x,device:'phone',input:'touchscreen'}]).valid,false);
 assert.equal(auditInputDeviceWorklog([]).documented_input_minutes,null);
 assert.equal(auditInputDeviceWorklog([{...x,minutes:0.5}]).valid,false);
 assert.equal(auditInputDeviceWorklog([{...x,recorded_at_utc:'invalid'}]).valid,false);
 assert.throws(()=>auditInputDeviceWorklog([],{usdPerHour:-2}),TypeError);
});
test('Device method remains incomplete without real executed game QA',()=>{
 const x=read('ontology/itch-io/input-method-qa-effort-ledger-2026.json'),p=read('plans/itch-io.json'),s=read('specimens/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(x.source_ids.every(id=>ids.has(id)));
 assert.equal(x.actual_device_tests_run,0);assert.equal(x.tested_game_available,false);
 assert.equal(x.state.incremental_touch_labor_cost_usd,null);
 const task=p.detail_tasks.find(t=>t.id==='itch-io/special-games/study-touch-and-controller-input');
 assert(task.percent<100);assert.equal(task.status,'in_progress');
 for(let f of ['ontology/itch-io/input-method-qa-effort-ledger-2026.json','ontology/itch-io/input-method-qa-effort-ledger-2026.md','site/itch-input-device-worklog.mjs','tests/itch-input-device-worklog.test.mjs'])assert(task.evidence.includes(f));
});
