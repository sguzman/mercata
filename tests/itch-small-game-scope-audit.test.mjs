import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchSmallGameScope} from '../site/itch-small-game-scope-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const make=(id,min,completed=true)=>({session_id:id,build_id:'b1',device:'desktop',input:'keyboard_mouse',completed,source_verified:true,play_duration_minutes:min});
test('A synthetic completed same-build short-game QA sample reports descriptive run duration and mechanic count, not sales',()=>{
 const a=auditItchSmallGameScope({mechanics:['explore','solve'],runs:[make('a',5),make('b',12),make('c',20)],buildId:'b1'});
 assert.equal(a.valid,true);assert.equal(a.declared_core_mechanic_count,2);
 assert.deepEqual(a.descriptive_duration_minutes,{minimum:5,median:12,maximum:20});
 assert.equal(a.proposed_scope_5_to_30_minute_median_met,true);
 assert.equal(a.real_game_purchase_count,null);
});
test('Mixed build and duplicate QA data cannot certify game scope; no runs means unknown median',()=>{
 assert.equal(auditItchSmallGameScope({mechanics:['explore'],runs:[make('a',6),make('a',9)],buildId:'b1'}).valid,false);
 assert.equal(auditItchSmallGameScope({mechanics:['explore'],runs:[{...make('x',8),build_id:'b2'}],buildId:'b1'}).valid,false);
 assert.equal(auditItchSmallGameScope({mechanics:['explore'],runs:[],buildId:'b1'}).descriptive_duration_minutes,null);
});
test('Existing definition task measures a hypothetical scope, never invented released-game metrics',()=>{
 const x=read('ontology/itch-io/short-2d-game-scope-and-playtime-measurement-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(v=>v.id));assert(x.source_ids.every(v=>sources.has(v)));
 assert.equal(x.scope.planned_distinct_core_mechanics_max,2);
 assert.equal(x.scope.planned_complete_play_minutes_max,30);
 assert.equal(x.unknown.actual_fully_played_game_sessions,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/special-games/define-small-game-scope');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/short-2d-game-scope-and-playtime-measurement-2026.json','ontology/itch-io/short-2d-game-scope-and-playtime-measurement-2026.md','site/itch-small-game-scope-audit.mjs','tests/itch-small-game-scope-audit.test.mjs'])assert(t.evidence.includes(f));
});
