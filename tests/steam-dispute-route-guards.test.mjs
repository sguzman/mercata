import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifySyntheticSteamRightsDisputeRoutes as classify} from '../site/steam-dispute-route-guards.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/steam-copyright-complaint-counter-notice-and-remedy-boundaries-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Only a qualifying US statutory route has the conditional 10 to 14 day framework',()=>{
 const r=classify(['copyright_notice','qualifying_512g_counter_notice','trademark_complaint','steamworks_support_ticket','store_build_review_rejection','voluntary_app_retirement'].map((route,i)=>({fixture_id:'fixture-'+i,route})));
 assert.equal(r.scenarios.length,6);
 assert.deepEqual(r.scenarios[1].conditional_us_business_day_range,[10,14]);
 for(const [i,s] of r.scenarios.entries()){if(i!==1)assert.equal(s.conditional_us_business_day_range,null);assert.equal(s.guaranteed_game_reinstatement,false);assert.equal(s.reported_store_sales,null);}
 assert.equal(r.actual_successful_appeal_rate,null);assert.equal(r.actual_income_loss,null);
});
test('Copyright claimant warnings and counter-notice identity do not promise a publisher appeal',()=>{
 assert.equal(x.public_routes.rights_holder_copyright_notice.notice_data_may_be_disclosed,true);
 assert.equal(x.public_routes.statutory_counter_notification.court_action_exception,true);
 assert.equal(x.public_routes.statutory_counter_notification.identity_and_jurisdiction_required,true);
 assert.equal(x.public_routes.statutory_counter_notification.automatic_game_reinstatement,false);
 assert.equal(x.public_routes.partner_support_ticket.independent_tribunal_promised,false);
 assert.equal(x.public_routes.ordinary_store_review_rejection.means_rights_holder_dmca_notice,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Private account identifiers and fabricated remedies are rejected',()=>{
 assert.throws(()=>classify([{}]),/synthetic/);
 assert.throws(()=>classify([{fixture_id:'user-123',route:'copyright_notice'}]),/synthetic/);
 assert.throws(()=>classify([{fixture_id:'fixture-a',route:'copyright_notice'},{fixture_id:'fixture-a',route:'trademark_complaint'}]),/Duplicate/);
 assert.throws(()=>classify([{fixture_id:'fixture-a',route:'guaranteed_reinstatement'}]),/Unrecognized/);
 assert.equal(classify([]).actual_platform_dispute_rate,null);
});
test('Every dated public policy claim joins valid sources and the fixed 293 research tasks',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,13);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((s,x)=>s+x,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/rights/document-dispute-enforcement-and-appeals').evidence.includes('ontology/steam/steam-copyright-complaint-counter-notice-and-remedy-boundaries-2026.json'));
});
