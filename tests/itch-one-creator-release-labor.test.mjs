import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('One creator report distinguishes observed approximate Godot export time from unknown total upload/QA labor',()=>{
 const x=get('ontology/itch-io/one-creator-multiplatform-deployment-work-2022.json'),d=get('specimens/itch-io.json');
 assert.equal(x.developer_post_date,'2022-08-16');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.observations.manual_platform_exports_and_uploads_duration,'a few hours');
 assert.equal(x.observations.manual_release_minutes_precise,null);
 assert.equal(x.observations.scripted_engine_export_approx_minutes,2);
 assert.equal(x.observations.scripted_total_release_upload_qa_minutes,null);
 assert.equal(x.observations.steam_store_live_on_report_date_verified,false);
 assert.equal(x.distinctions.engine_export_duration_not_end_to_end_publishing_duration,true);
 assert(Object.values(x.unobserved).every(v=>v===null));
});
test('Maintenance task remains incomplete after one reported historical build-time case',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(q=>q.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/risk/measure-engine-and-dependency-maintenance');
 assert(t.percent>=88&&t.percent<=100);
 assert.equal(t.status,t.percent===100?'complete':'in_progress');
 for(const path of ['ontology/itch-io/one-creator-multiplatform-deployment-work-2022.json','ontology/itch-io/one-creator-multiplatform-deployment-work-2022.md','tests/itch-one-creator-release-labor.test.mjs'])assert(t.evidence.includes(path));
});
