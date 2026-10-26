import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Six-year self-report keeps downloads, paying people, gross revenue and loss separate',()=>{
 const x=get('ontology/itch-io/six-year-low-return-cancellation-2026.json');
 const d=get('specimens/itch-io.json');
 const ids=new Set(d.evidence.map(x=>x.id));
 assert(x.source_ids.every(id=>ids.has(id)));
 assert.equal(x.game_downloads_reported,11200);
 assert.equal(x.paid_people_reported,48);
 assert.equal(x.gross_receipts_usd_reported,199.50);
 assert.equal(x.gross_receipts_before_marketplace_fees,true);
 assert.equal(x.monthly_revenue_exceeded_monthly_costs_reported,false);
 assert.equal(x.download_events_matched_to_paying_people,false);
 for(const field of ['mandatory_paid_game_at_listing','paid_orders','unique_downloaders','valid_paid_conversion_rate','net_cash_receipts_usd','owner_profit_usd','development_hours','generalizable_zero_sale_rate'])
  assert.equal(x[field],null,field);
 assert.equal(d.claims.some(c=>c.source_ids.includes(x.source_ids[0])),true);
});
