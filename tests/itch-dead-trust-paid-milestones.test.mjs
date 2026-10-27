import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Second-game copy milestones remain thresholds rather than paid-order revenue',()=>{
 const c=read('ontology/itch-io/dead-trust-paid-release-milestones-2025-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 assert(c.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.deepEqual(c.reports.map(x=>x.safe_minimum_copies),[150,300]);
 assert(c.reports.every(x=>x.exact_copies===null&&x.verified_itch_paid_orders===null&&x.refund_adjusted_copies===null));
 assert.equal(c.interpretation.incremental_sold_copies_between_posts,null);
 assert.equal(c.interpretation.store_scope_explicitly_itch_only,false);
 assert.equal(c.interpretation.comparable_paid_game_7_30_90_365_day_horizons,false);
 assert(Object.values(c.unknown).every(v=>v===null));
 assert.equal(c.game.historical_realized_price_usd,null);
 for(const id of ['itch-io/market/estimate-paid-purchase-demand','itch-io/sales/measure-long-tail-income']){
  const t=p.detail_tasks.find(x=>x.id===id);
  assert(t&&t.status==='in_progress'&&t.percent<100);
  for(const artifact of ['ontology/itch-io/dead-trust-paid-release-milestones-2025-2026.json','ontology/itch-io/dead-trust-paid-release-milestones-2025-2026.md','tests/itch-dead-trust-paid-milestones.test.mjs'])assert(t.evidence.includes(artifact));
 }
 assert.equal(p.total_tracked_tasks,244);
});
test('New register citations preserve independently bounded disclosures',()=>{
 const s=read('specimens/itch-io.json');
 for(const id of ["dead-trust-second-game-and-launch-2025","dead-trust-150-threshold-not-full-week-ledger-2025","dead-trust-300-threshold-jan2026","dead-trust-offer-change-not-revenue-2025-2026","dead-trust-thresholds-not-net-unit-increment"]){
  const claim=s.claims.find(x=>x.id===id);
  assert(claim&&claim.source_ids.every(k=>s.evidence.some(e=>e.id===k)));
  assert(claim.limitations.length>30);
 }
});
