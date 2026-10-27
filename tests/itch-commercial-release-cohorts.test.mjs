import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifyItchCommercialReleaseCohort} from '../site/itch-commercial-release-cohorts.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const win={startUtc:'2026-10-01T00:00:00Z',endUtc:'2026-11-01T00:00:00Z'};
const row=(id,time,kind,paid=true)=>({project_id:id,observation_utc:time,first_public_utc:time,observation_kind:kind,is_game:true,initial_positive_price_verified:paid,source_evidence_verified:true});
test('Only documented first public games with initial positive price count as paid launches',()=>{
 const rows=[row('a','2026-10-10T00:00:00Z','first_public'),row('b','2026-10-11T00:00:00Z','first_public',false),row('c','2026-10-12T00:00:00Z','update'),row('d','2026-10-12T00:00:00Z','price_conversion'),row('e','2026-10-12T00:00:00Z','feed_resighting')];
 const res=classifyItchCommercialReleaseCohort(rows,win);
 assert.equal(res.valid,true);
 assert.deepEqual([res.classification_counts.new_paid,res.classification_counts.new_free,res.classification_counts.updates,res.classification_counts.price_conversions,res.classification_counts.feed_resightings],[1,1,1,1,1]);
 assert.equal(res.settled_game_orders,null);assert.equal(res.global_first_time_paid_game_launch_rate,null);
});
test('Unverified initial offer cannot become verified commercial release; duplicate project IDs rejected',()=>{
 const a=row('a','2026-10-10T00:00:00Z','first_public');
 assert.equal(classifyItchCommercialReleaseCohort([{...a,source_evidence_verified:false}],win).classification_counts.unverified,1);
 assert.equal(classifyItchCommercialReleaseCohort([a,a],win).valid,false);
 assert.equal(classifyItchCommercialReleaseCohort([],win).observed_verified_first_paid_game_pages,null);
 assert.throws(()=>classifyItchCommercialReleaseCohort([a],{startUtc:'nonsense',endUtc:win.endUtc}),TypeError);
});
test('Cohort protocol advances fixed tasks without claiming measured release populations',()=>{
 const x=get('ontology/itch-io/commercial-first-release-cohort-qualification-2026.json'),s=get('specimens/itch-io.json'),p=get('plans/itch-io.json');
 const src=new Set(s.evidence.map(e=>e.id));assert(x.source_ids.every(id=>src.has(id)));
 assert.equal(x.actual_observations.actual_verified_first_commercial_game_releases,null);
 for(const id of ['itch-io/market/count-new-commercial-releases','itch-io/competition/measure-release-frequency']){
  const t=p.detail_tasks.find(t=>t.id===id);assert(t.percent<100);assert.equal(t.status,'in_progress');
  for(const f of ['ontology/itch-io/commercial-first-release-cohort-qualification-2026.json','ontology/itch-io/commercial-first-release-cohort-qualification-2026.md','site/itch-commercial-release-cohorts.mjs','tests/itch-commercial-release-cohorts.test.mjs'])assert(t.evidence.includes(f));
 }
});

test('A release discovered days later in the same fixed cohort is still a first release',()=>{
 const later={...row('later','2026-10-05T12:00:00Z','first_public'),first_public_utc:'2026-10-02T08:00:00Z'};
 const res=classifyItchCommercialReleaseCohort([later],win);
 assert.equal(res.valid,true);assert.equal(res.classification_counts.new_paid,1);
 assert.equal(res.global_first_time_paid_game_launch_rate,null);
});
test('First publications outside the window or after observation cannot count',()=>{
 const observation='2026-10-05T12:00:00Z';
 for(const first of ['2026-09-30T23:59:59Z','2026-10-06T12:00:00Z']){
  const r={...row('a',observation,'first_public'),first_public_utc:first};
  const result=classifyItchCommercialReleaseCohort([r],win);
  assert.equal(result.classification_counts.new_paid,0);
  assert.equal(result.classification_counts.unverified,1);
 }
});
test('Unverified updates and malformed UTC calendar dates never become counted launches',()=>{
 const unverifiedUpdate={...row('update','2026-10-05T12:00:00Z','update'),source_evidence_verified:false};
 const res=classifyItchCommercialReleaseCohort([unverifiedUpdate],win);
 assert.equal(res.classification_counts.updates,0);
 assert.equal(res.classification_counts.unverified,1);
 assert.equal(classifyItchCommercialReleaseCohort([row('bad','2026-02-30T00:00:00Z','first_public')],win).valid,false);
 assert.throws(()=>classifyItchCommercialReleaseCohort([],{startUtc:'2026-02-30T00:00:00Z',endUtc:win.endUtc}),TypeError);
});
