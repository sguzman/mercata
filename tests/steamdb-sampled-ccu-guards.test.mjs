import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamDbCcu as audit} from '../site/steamdb-sampled-ccu-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steamdb-public-signal-capture-and-merchant-revenue-boundaries-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const data=[{fixture_id:'fixture-a',at_utc:'2026-10-29T10:00:00Z',concurrent_players:20},{fixture_id:'fixture-b',at_utc:'2026-10-29T10:05:00Z',concurrent_players:30},{fixture_id:'fixture-c',at_utc:'2026-10-29T10:10:00Z',concurrent_players:25}];
test('A five-minute snapshot peak is not a game owner count or paid-unit estimate',()=>{
 const r=audit({samples:data,declaredPollMinutes:5});
 assert.equal(r.observed_snapshot_max,30);assert.equal(r.maximum_sample_gap_minutes,5);
 assert.equal(r.observed_gap_exceeds_declared_poll,false);
 for(const k of ['true_continuous_time_peak','unique_players','actual_paid_orders','net_revenue_usd','developer_profit_usd'])assert.equal(r[k],null);
});
test('Gaps beyond stated poll intervals are flagged; Advance Access remains unobserved',()=>{
 const arr=[data[0],data[2]],r=audit({samples:arr,declaredPollMinutes:5,advanceAccessUnobservable:true});
 assert.equal(r.maximum_sample_gap_minutes,10);assert.equal(r.observed_gap_exceeds_declared_poll,true);
 assert.equal(r.advance_access_coverage_attested,false);
 assert.equal(r.true_continuous_time_peak,null);
});
test('Invalid timestamps, disordered samples and unsafe CCU values are rejected',()=>{
 assert.throws(()=>audit({samples:[]}),/Nonempty/);
 assert.throws(()=>audit({samples:data,declaredPollMinutes:3}),/five or ten/);
 assert.throws(()=>audit({samples:[data[1],data[0]]}),/time ordered/);
 assert.throws(()=>audit({samples:[{...data[0],concurrent_players:-1}]}),/Invalid concurrent/);
 assert.throws(()=>audit({samples:[{...data[0],at_utc:'2026-02-30T10:00:00Z'}]}),/Invalid snapshot/);
 assert.throws(()=>audit({samples:[{...data[0],fixture_id:'account-123'}]}),/synthetic/);
});
test('Provider access and catalog caveats remain categorical not invented outcomes',()=>{
 assert.equal(x.source_methods.open_bulk_api_available,false);
 assert.equal(x.source_methods.scraping_without_permission_allowed,false);
 assert.equal(x.interpretation.missing_advance_access_ccu_is_not_zero_players,true);
 assert.equal(x.interpretation.public_sampled_ccu_peak_is_not_continuous_peak,true);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Public source links, claims and original 293 tasks stay intact',()=>{
 const ids=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(ids.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(y=>ids.has(y)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/income/evaluate-steamdb-coverage-and-limitations').evidence.includes('ontology/steam/steamdb-public-signal-capture-and-merchant-revenue-boundaries-2026.json'));
});
