import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Access state and category-specific 2025 customer guarantee remain distinct',()=>{
 const x=get('ontology/itch-io/platform-game-availability-contingencies-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 const state=id=>x.events.find(e=>e.id===id);
 assert.equal(state('disable_new_downloads_and_purchases').prior_owner_file_access_documented,true);
 assert.equal(state('public_to_draft').project_page_access_disrupted_for_existing_buyers,true);
 assert.equal(state('uk_nsfc_geo_2025').permanent_guarantee,false);
 assert.equal(state('platform_outage_or_shutdown').reliable_future_retrieval_confirmed,false);
});
test('Contingency plan is complete as a plan but no game backup or buyer restoration has been tested',()=>{
 const x=get('ontology/itch-io/platform-game-availability-contingencies-2026.json'),p=get('plans/itch-io.json');
 const task=p.detail_tasks.find(t=>t.id==='itch-io/risk/plan-platform-availability-contingencies');
 assert.equal(task.percent,100);assert.equal(task.status,'complete');
 assert(task.evidence.includes('tests/itch-platform-availability-plan.test.mjs'));
 assert.equal(x.publisher_continuity_controls.length,5);
 assert.equal(x.actual_publisher_builds_backed_up,0);
 assert.equal(x.actual_owner_restoration_trials,0);
 assert.equal(x.actual_customer_access_checkouts,0);
 assert.equal(x.external_deployment_without_game_or_permission,false);
 assert.equal(x.service_uptime_prediction,null);
 assert.equal(x.paid_sales_or_income_impact,null);
});
