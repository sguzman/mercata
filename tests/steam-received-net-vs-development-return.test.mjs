import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-historical-received-net-versus-development-return-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('2019 first-game cross-store financial totals reconcile without mixing channels',()=>{
 const c=x.cases[0],r=c.reported,v=c.reconstruction;
 assert.equal(r.steam_units+r.gog_units,r.all_units);
 assert.equal(r.steam_gross_usd+r.gog_gross_usd,r.all_gross_usd);
 assert.equal(r.steam_author_received_net_usd+r.gog_author_received_net_usd,v.by_store_reported_net_sum_usd);
 assert.equal(v.by_store_reported_net_sum_usd-r.all_author_received_net_usd,v.reported_net_headline_shortfall_usd);
 assert.equal(v.reported_net_headline_shortfall_usd,20);
 assert.match(v.net_headline_reconciliation_status,/unresolved/);
 assert.equal(r.steam_feb_net_usd+r.steam_mar_net_usd,v.feb_mar_net_subtotal_usd);
 assert.equal(r.steam_author_received_net_usd-v.feb_mar_net_subtotal_usd,v.feb_mar_net_rounding_difference_vs_reported_steam_net_usd);
 assert.equal(r.steam_feb_gross_usd+r.steam_mar_gross_usd+r.steam_apr_gross_usd,v.three_month_gross_subtotal_usd);
 assert.equal(r.steam_gross_usd-v.three_month_gross_subtotal_usd,v.overall_minus_monthly_gross_gap_usd);
 assert.equal(v.april_estimated_net_not_part_of_confirmed_bank_remittance,true);
});
test('2020 development-month author earnings are not an audited salary or full tax profit',()=>{
 const c=x.cases[1];
 assert.equal(c.reported.steam_gross_usd_approx,400000);
 assert.equal(c.reported.equivalent_full_time_development_months,30);
 assert.equal(c.reported.author_claimed_monthly_after_expenses_before_personal_tax_usd_more_than,7000);
 assert.equal(c.actual_bank_receipts_verified,false);
 assert.equal(c.after_personal_income_tax_usd,null);
 assert.equal(c.author_earnings_is_not_salary_benchmark,true);
});
test('Source-claim joins and original Steam 293 tasks verified',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(id=>s.has(id)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
