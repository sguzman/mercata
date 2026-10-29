import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-three-title-studio-and-firstyear-gross-net-selfreports-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Three distinct games remain one studio case with two non-additive currency units',()=>{
 const a=x.cases[0],t=a.titles;
 assert.equal(t.length,3);
 assert.equal(t.reduce((n,z)=>n+z.gross_usd,0),a.sum_title_values.gross_usd);
 assert.equal(t.reduce((n,z)=>n+z.net_after_author_tax_fx_eur,0),a.sum_title_values.net_after_author_tax_fx_eur);
 assert.equal(a.sum_title_values.gross_usd,354957);
 assert.equal(a.sum_title_values.net_after_author_tax_fx_eur,84682);
 assert.equal(a.bank_receipts_authenticated,false);
});
test('As-of observation dates do not silently pair revised units with older revenue',()=>{
 const a=x.cases[0];assert(a.contains_later_observation_as_of>a.article_published_at);
 const third=a.titles[2];
 assert.equal(third.total_units_as_of,'2026-09-08');
 assert.equal(third.later_units_as_of,'2026-09-28');
 assert.equal(third.first_month_net_units,null);
 assert(third.later_units_count>third.total_net_units);
});
test('One-year first-game net label is not audited payout or after-cost profit',()=>{
 const b=x.cases[1],r=b.reported;
 assert.equal(r.copies_sold,1674);assert.equal(r.refunds,220);
 assert.equal(r.gross_usd,14992);assert.equal(r.net_label_usd,11888);
 assert(Math.abs(r.refunds/r.copies_sold-0.1314)<0.0001);
 assert.equal(b.steam_platform_fee_explicitly_in_net_label,false);
 assert.equal(b.bank_receipts_authenticated,false);
 assert.equal(b.developer_after_cost_profit_usd,null);
});
test('Official source joins and fixed 293 Steam task inventory preserved',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,11);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const values=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
});
