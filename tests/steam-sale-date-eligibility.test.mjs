import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {calendarDiscountEligibility as check} from '../site/steam-sale-date-eligibility.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/steam-sale-calendar-release-cooldown-eligibility-2026.json'),p=get('plans/steam.json'),q=get('queues/steam.json'),d=get('specimens/steam.json');
const winter={saleStart:'2026-12-17',saleEnd:'2027-01-04'};
test('Thirty-day launch gate can allow late winter entry',()=>{
 const late=check({...winter,releaseDate:'2026-12-01'});
 assert.equal(late.earliest_possible_discount_date,'2026-12-31');
 assert.equal(late.eligible_from_sale_start,false);
 const early=check({...winter,releaseDate:'2026-11-01'});
 assert.equal(early.eligible_from_sale_start,true);
 assert.equal(early.earliest_possible_discount_date,'2026-12-17');
});
test('New game or recent price increase cannot use seasonal exception to evade waiting',()=>{
 assert.equal(check({...winter,releaseDate:'2026-12-20'}).regular_discount_possible_sometime_during_sale,false);
 const price=check({...winter,releaseDate:'2026-10-01',priceIncreaseDate:'2026-12-01'});
 assert.equal(price.earliest_possible_discount_date,'2026-12-31');
 const more=check({...winter,releaseDate:'2026-10-01',priceIncreaseDate:'2026-12-20'});
 assert.equal(more.earliest_possible_discount_date,null);
 assert.equal(more.causal_event_uplift,null);
});
test('Malformed dates and reversed ranges are not valid',()=>{
 assert.throws(()=>check({...winter,releaseDate:'2026-02-30'}),/Invalid calendar/);
 assert.throws(()=>check({saleStart:'2027-01-04',saleEnd:'2026-12-17',releaseDate:'2026-11-01'}),/before it starts/);
 assert.throws(()=>check({...winter,releaseDate:'2026-11-01',priceIncreaseDate:'2027-02-01'}),/after evaluated sale/);
});
test('Official citation joins and 293 tracked tasks stay intact',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(id=>s.has(id)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
