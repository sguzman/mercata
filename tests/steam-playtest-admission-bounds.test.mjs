import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundSyntheticPlaytestActivation as bound,syntheticDemoNotification as notify} from '../site/steam-playtest-admission-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-limited-playtest-admission-activation-and-demo-notification-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Missing grantee outcomes produce a logical interval, not a Steam income estimate',()=>{
 const v=bound({requests:1000,granted:300,activated:120,notActivated:50,unknownGranted:130});
 assert.equal(v.admitted_activation_min_fraction,0.4);assert.equal(v.admitted_activation_max_fraction,250/300);
 assert.equal(v.unadmitted,700);assert.equal(v.request_to_grant_fraction,0.3);
 assert.equal(v.real_game_purchase_conversion,null);assert.equal(v.developer_profit,null);
 assert.equal(v.random_sample_of_steam_users,false);
});
test('Fully missing, fully observed and no-grant frames are handled without fabricated outcomes',()=>{
 const a=bound({requests:4,granted:2,activated:0,notActivated:0,unknownGranted:2});
 assert.equal(a.admitted_activation_min_fraction,0);assert.equal(a.admitted_activation_max_fraction,1);
 const b=bound({requests:4,granted:2,activated:1,notActivated:1,unknownGranted:0});
 assert.equal(b.admitted_activation_min_fraction,0.5);assert.equal(b.admitted_activation_max_fraction,0.5);
 const c=bound({requests:4,granted:0,activated:0,notActivated:0,unknownGranted:0});
 assert.equal(c.admitted_activation_min_fraction,null);assert.equal(c.admitted_activation_max_fraction,null);
});
test('Invalid grantee partitions and externally selected keys fail closed',()=>{
 assert.throws(()=>bound({requests:10,granted:5,activated:2,notActivated:2,unknownGranted:2}),/partition/);
 assert.throws(()=>bound({requests:3,granted:5,activated:2,notActivated:2,unknownGranted:1}),/request frame/);
 assert.throws(()=>bound({requests:10,granted:5,activated:2,notActivated:2,unknownGranted:1,keyRecipientsIncluded:true}),/Outside-key/);
 assert.throws(()=>bound({requests:10,granted:-1,activated:0,notActivated:0,unknownGranted:0}),/Invalid/);
});
test('Demo notification can be triggered once within first 14 calendar days',()=>{
 assert.equal(notify({firstPlayableDate:'2026-11-01',checkDate:'2026-11-14'}).eligible,true);
 assert.equal(notify({firstPlayableDate:'2026-11-01',checkDate:'2026-11-15'}).eligible,false);
 assert.equal(notify({firstPlayableDate:'2026-11-01',checkDate:'2026-11-01',previouslyTriggered:true}).eligible,false);
 assert.equal(notify({firstPlayableDate:'2026-11-01',checkDate:'2026-10-31'}).eligible,false);
 assert.equal(notify({firstPlayableDate:'2026-11-01',checkDate:'2026-11-14'}).latest_eligible_date,'2026-11-14');
 assert.throws(()=>notify({firstPlayableDate:'2026-11-31',checkDate:'2026-12-01'}),/Invalid/);
});
test('Original source links and 293-task research inventory remain valid',()=>{
 const s=new Set(d.evidence.map(e=>e.id)),c=new Map(d.claims.map(e=>[e.id,e]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(sid=>s.has(sid)),id);}
 const a=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(a.length,293);assert.equal(p.progress_percent,Math.round(a.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(x.unknown).every(v=>v===null));
});
