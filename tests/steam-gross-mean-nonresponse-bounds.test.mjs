import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundSyntheticSteamGrossMean as bound} from '../site/steam-gross-mean-nonresponse-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const o=(id,amount,h=30)=>({fixture_id:'fixture-'+id,horizon_days:h,gross_usd_cents:amount,coverage:'complete_reconciled'});
const m=(id,cap=null,verified=false,h=30)=>({fixture_id:'fixture-'+id,horizon_days:h,verified_upper_cap_usd_cents:cap,cap_verified:verified});
test('A synthetic complete five-game population point-identifies its gross mean',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,observed:[o('a',0),o('b',1000),o('c',2000),o('d',5000),o('e',10000)]});
 assert.equal(a.lower_mean_gross_usd_cents,3600);assert.equal(a.upper_mean_gross_usd_cents,3600);assert.equal(a.point_identified,true);assert.equal(a.publisher_profit_mean,null);
});
test('Two missing gross outcomes leave an unbounded upper despite positive observations',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,observed:[o('a',1000),o('b',2000),o('c',3000)],missing:[m('d'),m('e')]});
 assert.equal(a.lower_mean_gross_usd_cents,1200);assert.equal(a.upper_mean_gross_usd_cents,null);assert.equal(a.upper_unbounded,true);assert.equal(a.unknown_upper_caps,2);
});
test('Independently verified upper caps produce conditional finite bounds',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:90,cohortFrameVerified:true,observed:[o('a',1000,90),o('b',2000,90),o('c',3000,90)],missing:[m('d',5000,true,90),m('e',7000,true,90)]});
 assert.equal(a.lower_mean_gross_usd_cents,1200);assert.equal(a.upper_mean_gross_usd_cents,3600);assert.equal(a.point_identified,false);assert.equal(a.actual_platform_mean_gross,null);
});
test('Incomplete frames and unsafe imputations fail closed',()=>{
 const args={eligibleFrameSize:2,horizonDays:365,observed:[o('a',200,365)],missing:[m('b',null,false,365)]};
 assert.equal(bound(args).lower_mean_gross_usd_cents,null);assert.equal(bound(args).upper_mean_gross_usd_cents,null);
 assert.throws(()=>bound({...args,cohortFrameVerified:true,missing:[m('b',500,false,365)]}),/verification/);
 assert.throws(()=>bound({...args,observed:[{...o('a',200,365),coverage:'partial'}]}),/Partial/);
 assert.throws(()=>bound({...args,missing:[m('b',null,false,30)]}),/Mixed/);
 assert.throws(()=>bound({...args,missing:[m('a',null,false,365)]}),/Unique/);
 assert.throws(()=>bound({...args,observed:[o('a',-1,365)]}),/Nonnegative/);
 assert.throws(()=>bound({...args,eligibleFrameSize:3}),/reconcile/);
});
test('Public-source claims preserve 293 Steam tasks and real economy remains unmeasured',()=>{
 const s=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>s.has(z)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/income/estimate-fixed-horizon-mean-gross-revenue').evidence.includes('ontology/steam/steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json'));
 assert(Object.values(x.unknown).every(v=>v===null));
});
