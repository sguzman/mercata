import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Unexecuted commercial strategy experiments do not fabricate outcomes or account actions',()=>{
 const p=read('ontology/itch-io/commercial-strategy-protocol-2026.json');
 const d=read('specimens/itch-io.json');
 assert.equal(p.experiments.length,7);
 assert.equal(p.current_experiment_count,0);
 assert.equal(p.real_seller_results,null);
 assert(p.source_ids.every(s=>d.evidence.some(x=>x.id===s)));
 for(const e of p.experiments){
  assert.equal(e.status,'not_started');
  assert.equal(e.owner_authorized_seller_data_collected,false);
  for(const k of ['cash_spent_usd','settled_orders','net_profit_usd','result','causal_effect'])assert.equal(e[k],null);
 }
 assert.equal(p.common_measurement_contract.stop_conditions.approved_by_owner,false);
});
