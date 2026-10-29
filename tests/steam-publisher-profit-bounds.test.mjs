import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundPublisherAfterCostProfitShare as bound} from '../site/steam-publisher-profit-bounds.mjs';
const json=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=json('ontology/steam/publisher-profitability-partial-identification-2026.json'),d=json('specimens/steam.json'),p=json('plans/steam.json'),q=json('queues/steam.json');
const att={permissioned_financial_reporting:true,all_partner_contracts_and_title_transfers_reconciled:true,all_development_support_and_overhead_costs_reconciled:true,labor_and_opportunity_costs_reconciled:true,common_horizon_and_currency_reconciled:true};
test('Five-publisher bounded sign proportion with missing costs does not invent individual profit',()=>{
 const r=bound({eligiblePublisherCount:5,frameComplete:true,records:[
  {studyId:'SYN-1',ledger_status:'complete_reconciled',after_cost_profit_sign:'positive',...att},
  {studyId:'SYN-2',ledger_status:'complete_reconciled',after_cost_profit_sign:'negative',...att},
  {studyId:'SYN-3',ledger_status:'partial'},
  {studyId:'SYN-4',ledger_status:'missing'}
 ]});
 assert.equal(r.positive_share_lower_bound,0.2);assert.equal(r.positive_share_upper_bound,0.8);
 assert.equal(r.unresolved_profit_sign,3);assert.equal(r.exact_positive_share,null);
 assert.equal(r.median_profit_dollars,null);
});
test('All verified means exact sign share, with zero profit excluded from positive',()=>{
 const rows=[{studyId:'SYN-1',ledger_status:'complete_reconciled',after_cost_profit_sign:'positive',...att},
 {studyId:'SYN-2',ledger_status:'complete_reconciled',after_cost_profit_sign:'zero',...att},
 {studyId:'SYN-3',ledger_status:'complete_reconciled',after_cost_profit_sign:'negative',...att}];
 const r=bound({eligiblePublisherCount:3,records:rows,frameComplete:true});
 assert.equal(r.exact_positive_share,1/3);assert.equal(r.observed_complete_zero,1);
 assert.equal(r.mean_profit_dollars,null);assert.equal(r.actual_publisher_profitability_estimate,null);
});
test('Partial positive Steam cash cannot identify after-labor profit sign',()=>{
 assert.throws(()=>bound({eligiblePublisherCount:1,frameComplete:true,records:[{studyId:'SYN-1',ledger_status:'partial',after_cost_profit_sign:'positive'}]}),/Incomplete cost/);
 assert.throws(()=>bound({eligiblePublisherCount:1,frameComplete:true,records:[{studyId:'SYN-1',ledger_status:'complete_reconciled',after_cost_profit_sign:'positive'}]}),/attestations/);
 assert.equal(bound({eligiblePublisherCount:1}).positive_share_lower_bound,null);
});
test('Duplicate persons, malformed inputs and incomplete frame are not publishable',()=>{
 assert.throws(()=>bound({eligiblePublisherCount:1,records:[{studyId:'SYN-1'},{studyId:'SYN-2'}]}),/frame/);
 assert.throws(()=>bound({eligiblePublisherCount:2,records:[{studyId:'SYN-1',ledger_status:'missing'},{studyId:'SYN-1',ledger_status:'missing'}]}),/Unique/);
 assert.throws(()=>bound({eligiblePublisherCount:1,records:[{studyId:'person@example.com',ledger_status:'missing'}]}),/synthetic/);
 assert.equal(bound({eligiblePublisherCount:3,frameComplete:false}).positive_share_upper_bound,null);
});
test('No publisher records collected; source/claim joins and fixed Steam inventory remain intact',()=>{
 assert.equal(x.zero_actual_verified_publisher_cost_ledgers,true);
 assert(Object.values(x.unknown).every(v=>v===null));
 const s=new Set(d.evidence.map(e=>e.id)),c=new Map(d.claims.map(t=>[t.id,t]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,7);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(j=>s.has(j)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
