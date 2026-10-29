import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamUpdateRound as audit} from '../site/steam-update-visibility-round-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-update-visibility-round-cap-and-seasonal-blackouts-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Winter Sale days consume the nominal 30 day round without promising impressions',()=>{
 const r=audit({startDate:'2026-12-10',saleBlackouts:[{startDate:'2026-12-17',endInclusive:'2027-01-04'}],launchVisibilityConcluded:true});
 assert.equal(r.nominal_end_exclusive,'2027-01-09');
 assert.equal(r.nominal_calendar_days,30);
 assert.equal(r.assumed_sale_blackout_days,19);
 assert.equal(r.potential_nonblackout_calendar_days_at_most,11);
 assert.equal(r.date_and_initial_allotment_gate_passed,true);
 assert.equal(r.actual_homepage_days,null);assert.equal(r.actual_incremental_sales,null);
 assert.equal(r.expected_impressions,null);assert.equal(r.profit_from_round,null);
});
test('Overlapping sale ranges are unioned, not double-counted',()=>{
 const r=audit({startDate:'2026-12-10',saleBlackouts:[{startDate:'2026-12-17',endInclusive:'2027-01-04'},{startDate:'2026-12-23',endInclusive:'2026-12-30'}],launchVisibilityConcluded:true});
 assert.equal(r.assumed_sale_blackout_days,19);assert.equal(r.potential_nonblackout_calendar_days_at_most,11);
});
test('Round allotment and Early Access launch gates do not invent account eligibility',()=>{
 const base={startDate:'2026-11-01',launchVisibilityConcluded:true};
 assert.equal(audit({...base,initialRoundsUsed:5}).date_and_initial_allotment_gate_passed,false);
 assert.equal(audit({...base,launchVisibilityConcluded:false}).date_and_initial_allotment_gate_passed,false);
 assert.equal(audit({...base,isEarlyAccess:true,daysSinceEarlyAccessLaunch:13}).date_and_initial_allotment_gate_passed,false);
 assert.equal(audit({...base,isEarlyAccess:true,daysSinceEarlyAccessLaunch:14}).date_and_initial_allotment_gate_passed,true);
 assert.equal(audit({...base,initialRoundsUsed:4}).initial_rounds_remaining,1);
});
test('Date-only scenarios reject invalid dates, impossible periods and fake eligibility',()=>{
 assert.throws(()=>audit({startDate:'2026-02-30'}),/Invalid/);
 assert.throws(()=>audit({startDate:'2026-11-01',initialRoundsUsed:6}),/Initial/);
 assert.throws(()=>audit({startDate:'2026-11-01',isEarlyAccess:true}),/Early Access age/);
 assert.throws(()=>audit({startDate:'2026-11-01',saleBlackouts:[{startDate:'2026-12-10',endInclusive:'2026-12-01'}]}),/before start/);
 assert.throws(()=>audit({startDate:'2026-11-01',launchVisibilityConcluded:'yes'}),/Boolean/);
});
test('Claims are sourced and original 293 tasks and all actual income unknowns are retained',()=>{
 const sources=new Set(d.evidence.map(a=>a.id)),claims=new Map(d.claims.map(a=>[a.id,a]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(x.unknown).every(x=>x===null));
 assert(p.detail_tasks.find(t=>t.id==='steam/discovery/study-updates-and-revived-interest').evidence.includes('ontology/steam/steam-update-visibility-round-cap-and-seasonal-blackouts-2026.json'));
});
