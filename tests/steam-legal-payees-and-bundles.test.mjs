import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/legal-partners-bundle-payouts-and-free-licenses-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Co-development editing is not transfer of payment and tax entity',()=>{
 assert.equal(x.app_sharing.changes_payee,false);
 assert.equal(x.app_sharing.finance_view_automatic,false);
 assert.equal(x.legal_entity.sole_proprietor_allowed,true);
 assert.equal(x.legal_entity.universal_minimum_age_from_sources,null);
});
test('Bundled purchases are package-level and Free to Play remains free licensing',()=>{
 assert.equal(x.collaborative_bundles.pays_each_partner_for_paid_package,true);
 assert.equal(x.collaborative_bundles.recharges_existing_owned_package,false);
 assert.equal(x.collaborative_bundles.custom_steam_split_of_bundle_payments,false);
 assert.equal(x.free_to_play.base_license_is_paid_order,false);
 assert.equal(x.unknown.net_publisher_profit,null);
});
test('Cited sources and original 293 tasks are preserved',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,18);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const values=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
});
