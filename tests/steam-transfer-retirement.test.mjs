import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=j('ontology/steam/app-transfer-reporting-and-retirement-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('prior payment histories do not become zero after transfer',()=>{
 assert.equal(x.transfer.receiving_partner_prior_payment_reports_default,false);
 assert.equal(x.transfer.wishlist_history_follows_appid,true);
 assert.equal(x.transfer.publisher_api_keys_move,false);
 assert.equal(x.unknown.paid_orders_before_transfer,null);
});
test('retirement preserves buyer library access while server service is not guaranteed',()=>{
 assert.equal(x.retirement.existing_customer_libraries_keep_title,true);
 assert.equal(x.retirement.ongoing_multiplayer_service_guaranteed,false);
 assert.equal(x.retirement.f2p_requested_notice_days,90);
 assert.equal(x.unknown.actual_shutdown_cost,null);
});
test('official sources, bounded claims and fixed score denominator',()=>{
 const sourceIDs=new Set(d.evidence.map(s=>s.id)),claimIDs=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,15);
 assert(x.source_ids.every(id=>sourceIDs.has(id)));
 for(const id of x.claim_ids){assert(claimIDs.has(id));assert(claimIDs.get(id).source_ids.every(s=>sourceIDs.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert.equal(x.no_account_access,true);assert.equal(x.no_sales_data,true);
});
