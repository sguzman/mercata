import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const audit=get('ontology/steam/review-data-and-sales-estimation-2026.json'),specimen=get('specimens/steam.json');
const plan=get('plans/steam.json'),queue=get('queues/steam.json');
test('review study sources and bounded claims are uniquely traceable',()=>{
 const sourceIds=new Set(specimen.evidence.map(x=>x.id));
 const claimIds=new Set(specimen.claims.map(x=>x.id));
 assert.equal(sourceIds.size,specimen.evidence.length);
 assert.equal(claimIds.size,specimen.claims.length);
 assert.equal(audit.source_ids.length,8);
 assert.equal(audit.claim_ids.length,22);
 assert(audit.source_ids.every(id=>sourceIds.has(id)));
 assert(audit.claim_ids.every(id=>claimIds.has(id)));
 assert(specimen.claims.every(c=>c.source_ids.every(id=>sourceIds.has(id))));
});
test('Steam review endpoint uses latest documented origin and language filters without sales imputation',()=>{
 const a=audit.current_review_api;
 assert.equal(a.publisher_key_required_for_read,false);
 assert.equal(a.default_language,'english');
 assert.equal(a.default_purchase_type,'steam');
 assert.equal(a.purchase_type_enum.all,1);
 assert.equal(a.live_api_tested,false);
 assert.equal(a.public_paid_orders,null);
 assert.equal(audit.unknown.exact_zero_paid_order_fraction,null);
});
test('review-sales models are not merchant orders, and small-sale exclusion stays explicit',()=>{
 const g=audit.public_estimator_methods.find(x=>x.operator==='Gamalytic');
 assert.equal(g.validation_excluded_games_below_paid_units,1000);
 assert.equal(g.valid_for_zero_sales_population,null);
 const c=audit.historical_calibrations.find(x=>x.publisher==='GameDiscoverCo');
 assert.equal(c.sample_size,237);
 assert.equal(c.launch_2020_median_sales_per_review,38);
 assert(Object.values(audit.unknown).every(v=>v===null));
 assert(Object.values(audit.restrictions).every(v=>v===false));
});
test('task evidence and public rounded percentage retain 293-task scope',()=>{
 const tasks=[...plan.detail_tasks.map(x=>({id:x.id,p:x.percent,e:x.evidence})),...queue.queues.flatMap(g=>g.tasks.map(x=>({id:x.id,p:x.progress,e:x.evidence})))];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(t=>t.id)).size,293);
 assert.equal(plan.progress_percent,Math.round(tasks.reduce((a,t)=>a+t.p,0)/293));
 for(const t of tasks){assert(t.p>=0&&t.p<=100);if(t.p>0)assert(t.e.length>0,t.id);}
});
