import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {evaluateHypotheticalSteamGame} from '../site/steam-hypothetical-break-even.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/synthetic-first-game-break-even-scenarios-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Synthetic cash and labor break-even are distinct and never observed outcomes',()=>{
 const z=evaluateHypotheticalSteamGame(x.example);
 assert.equal(z.break_even_gross_paid_orders_cash,1000);
 assert.equal(z.break_even_gross_paid_orders_including_labor,5410);
 assert.equal(z.modeled_cash_surplus_cents,0);
 assert.equal(z.actual_merchant_sales,null);assert.equal(z.actual_developer_profit,null);
});
test('No revenue margin cannot imply finite break-even',()=>{
 const a={...x.example,checkoutPriceCents:0};
 const z=evaluateHypotheticalSteamGame(a);
 assert.equal(z.break_even_gross_paid_orders_cash,null);
 assert.equal(z.break_even_gross_paid_orders_including_labor,null);
});
test('Refund, tax, share and cost assumptions are explicitly validated',()=>{
 for(const k of ['refundRateBps','salesTaxShareBps','platformShareBps','publisherRecoupShareBps'])assert.throws(()=>evaluateHypotheticalSteamGame({...x.example,[k]:-1}),TypeError);
 assert.throws(()=>evaluateHypotheticalSteamGame({...x.example,checkoutPriceCents:9.5}),TypeError);
 assert.throws(()=>evaluateHypotheticalSteamGame({...x.example,laborHours:-2}),TypeError);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Claims and sources link to existing Steam dossier; scope remains 293',()=>{
 const sources=new Set(d.evidence.map(z=>z.id));
 assert.equal(x.claim_ids.length,8);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const id of x.claim_ids){const c=d.claims.find(c=>c.id===id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
