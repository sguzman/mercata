import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticVerifiedReportingWindows as audit} from '../site/steam-verified-reporting-span-guard.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const data=load('ontology/steam/steam-gameselo-verified-partial-reporting-vs-modelled-lifetime-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({fixture_id:'fixture-merchant-window-coverage',full_merchant_history_verified:false,
 matched_complete_paid_launch_frame:false,windows:data.partial_public_windows.rows.map((row,i)=>({
 id:'fixture-game-'+i,first_date:row.first,last_date:row.last,reported_days:row.reported_days}))});
test('Four published window lengths do not imply full contiguous calendar coverage',()=>{
 const result=audit(fixture());
 assert.equal(result.reported_window_count,4);
 assert.deepEqual(result.windows.map(w=>w.inclusive_calendar_span_days),[69,77,73,76]);
 assert.deepEqual(result.windows.map(w=>w.unreported_calendar_days_in_span),[40,51,47,54]);
 for(const w of result.windows){assert.equal(w.unreported_calendar_day_revenue_usd,null);
 assert.equal(w.complete_firstyear_revenue_usd,null);}
});
test('Operator verification cannot imply independent bank records or representative income',()=>{
 const result=audit(fixture());
 for(const k of ['verified_account_lifetime_revenue_usd','actual_legal_publisher_bank_deposits_usd',
 'representative_median_paid_game_revenue_usd','exact_zero_paid_sale_fraction'])assert.equal(result[k],null);
 assert.equal(result.an_operator_verified_badge_is_an_independent_account_audit,false);
 assert(Object.values(data.unknown).every(v=>v===null));
});
test('Reject invalid calendars, impossible periods, and unauthorized reporting/account columns',()=>{
 const base=fixture(),mutants=[
 {windows:[{...base.windows[0],reported_days:70}]},
 {windows:[{...base.windows[0],reported_days:0}]},
 {windows:[{...base.windows[0],first_date:'2026-02-30'}]},
 {windows:[{...base.windows[0],last_date:'2026-08-05'}]},
 {windows:[base.windows[0],base.windows[0]]},
 {windows:[{...base.windows[0],account_id:'secret'}]},
 {full_merchant_history_verified:true},
 {matched_complete_paid_launch_frame:true},
 {real_reported_money_usd:999}
 ];
 for(const x of mutants)assert.throws(()=>audit({...base,...x}));
 assert.throws(()=>audit([69,29]));
});
test('Public sources, claim references and all 293 original tasks remain consistent',()=>{
 const sourceIds=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(data.source_ids.length,4);assert.equal(data.claim_ids.length,10);
 for(const id of data.source_ids)assert(sourceIds.has(id),id);
 for(const id of data.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(k=>sourceIds.has(k)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
