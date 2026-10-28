import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const file='ontology/itch-io/historical-itch-vs-steam-low-paid-game-outcomes-2018-2021.json';
test('Historical same-game paid unit reports preserve intervals and do not create representative market demand',()=>{
 const x=read(file),d=read('specimens/itch-io.json'),[a,b]=x.cases;
 assert.equal(x.cases.length,2);
 assert(x.source_ids.every(id=>d.evidence.some(z=>z.id===id)));
 assert.equal(a.itch_paid_units_cumulative_as_of_post,12);
 assert.equal(a.itch_january_plus_february_paid_units+a.itch_late_june_sale_paid_units+a.itch_other_period_paid_units_not_individually_dated,12);
 assert.equal(Object.values(a.steam_monthly_units).reduce((n,t)=>n+t,0),121);
 assert.equal(a.steam_units_jan16_through_jul5_2018,121);
 assert.equal(a.matched_release_age_promotion_and_exposure,false);
 assert.equal(b.itch_first_month_paid_units,0);
 assert.equal(b.itch_paid_units_as_of_post,1);
 assert.equal(b.itch_gross_usd_approx_as_of_post,3.99);
 assert.equal(b.steam_first_month_paid_units,410);
 assert.equal(b.itch_release_and_steam_first_month_aligned,false);
 assert.equal(b.itch_net_usd,null);
 assert.equal(x.inclusion.merchant_accounts_accessed,0);
 assert(Object.values(x.unknown).every(x=>x===null));
});
test('Original plan inventory is stable and only three incomplete tasks receive new evidence',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json'),s=read('specimens/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 for(const [id,score] of [['itch-io/market/estimate-paid-purchase-demand',70],['itch-io/competition/create-cross-platform-benchmarks',98],['itch-io/risk/study-sales-volatility',93]]){
  const t=p.detail_tasks.find(x=>x.id===id);assert(t);
  assert.equal(t.percent,score);assert.equal(t.status,'in_progress');
  for(const f of [file,'ontology/itch-io/historical-itch-vs-steam-low-paid-game-outcomes-2018-2021.md','tests/itch-historical-low-paid-crossstore-2018-2021.test.mjs'])assert(t.evidence.includes(f));
 }
 assert(s.claims.some(x=>x.id==='realm-2018-twelve-itch-one-hundred-twenty-one-steam-copies'));
 assert(s.claims.some(x=>x.id==='yerba-mate-2021-itch-zero-then-one'));
});
