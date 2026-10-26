import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('The three external PC stores have source-verified and non-equivalent onboarding',()=>{
 const x=load('ontology/itch-io/neighbor-game-store-entry-frames-2026.json');
 const d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.comparators.find(x=>x.id==='steam').upfront_usd,100);
 assert.equal(x.comparators.find(x=>x.id==='steam').fee_recoup_threshold_adjusted_gross_usd,1000);
 assert.equal(x.comparators.find(x=>x.id==='epic').upfront_usd,100);
 assert.equal(x.comparators.find(x=>x.id==='gog').upfront_usd,null);
 assert.equal(x.comparators.find(x=>x.id==='creator_owned_direct_site').hosting_cost_usd,null);
});
test('Cross-store entry comparison never pretends to know seller income or actual customers',()=>{
 const x=load('ontology/itch-io/neighbor-game-store-entry-frames-2026.json');
 assert.equal(x.comparison_protocol.observed_buyer_population,null);
 assert.equal(x.comparison_protocol.mean_creator_income_by_store,null);
 assert.equal(x.comparison_protocol.causal_store_sales_advantage,null);
 assert.equal(x.comparison_protocol.store_census_of_sellers,null);
 const p=load('plans/itch-io.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/identity/define-neighboring-stores');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-neighbor-store-frames.test.mjs'));
 assert.equal(p.total_tracked_tasks,244);
});
