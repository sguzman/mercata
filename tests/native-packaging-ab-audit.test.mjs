import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessPackagingTest,interpretPackagingResult,auditExternalPackagingRotations} from '../site/native-packaging-ab-audit.mjs';
const load=async file=>JSON.parse(await readFile(new URL('../'+file,import.meta.url),'utf8'));
test('Native concurrent tests have source evidence, watch-time outcomes and no measured sales',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/native-packaging-ab-tests.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.maximum_variants,3);assert.equal(m.expected_resolution_max_days,14);
 assert.equal(m.outcome_metric,'watch_time_share');assert.equal(m.outcome_is_clickthrough_rate,false);
 assert.equal(m.measured_experiment_results.length,0);
 assert.deepEqual(m.outcomes.map(x=>x.id),['winner','performed_same','inconclusive']);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Eligibility separates true desktop concurrent tests from Shorts and restricted uploads',async()=>{
 const m=await load('ontology/youtube/native-packaging-ab-tests.json');
 const base={mode:'thumbnail_only',variantCount:3,desktop:true,advancedFeatures:true,videoKind:'long_form'};
 assert.equal(assessPackagingTest(m,base).eligible,true);
 assert.equal(assessPackagingTest(m,{...base,videoKind:'live_archive'}).eligible,true);
 assert.equal(assessPackagingTest(m,{...base,videoKind:'shorts'}).eligible,false);
 assert.equal(assessPackagingTest(m,{...base,conditions:['made_for_kids']}).eligible,false);
 assert.equal(assessPackagingTest(m,{...base,conditions:['private']}).eligible,false);
 assert.equal(assessPackagingTest(m,{...base,advancedFeatures:false}).eligible,false);
 assert.equal(assessPackagingTest(m,{...base,variantCount:4}).eligible,false);
 assert.equal(assessPackagingTest(m,{...base,mode:'traffic_purchase'}).eligible,false);
});
test('Watch-time winner is not purchase conversion or revenue uplift',async()=>{
 const m=await load('ontology/youtube/native-packaging-ab-tests.json');
 for(const id of ['winner','performed_same','inconclusive']){
  const x=interpretPackagingResult(m,{outcome:id,claimedMetric:'watch_time_share'});
  assert.equal(x.valid,true);assert.equal(x.verified_buyer_conversion,null);assert.equal(x.verified_revenue_gain,null);
  assert.equal(x.has_clear_winner,id==='winner');
 }
 assert.equal(interpretPackagingResult(m,{outcome:'winner',claimedMetric:'clickthrough_rate'}).valid,false);
 assert.equal(interpretPackagingResult(m,{outcome:'real_profit_winner'}).valid,false);
});
test('Research site publishes the observed product rules and research unknowns',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderNativePackagingAB'));
 assert(app.includes('native-packaging-ab-tests.json'));
 assert(app.includes('watch-time share, not click-through rate'));
});

test('External selected thumbnail rotations reconcile and cannot be called verified native test wins',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/native-packaging-ab-tests.json'),load('specimens/youtube.json')]);
 const x=m.external_rotation_observation;
 assert.deepEqual(auditExternalPackagingRotations(m,new Set(d.evidence.map(s=>s.id))),{valid:true,errors:[]});
 assert.equal(x.detected_rotation_video_objects,460);
 assert.equal(x.observed_week_one_edited_video_objects,75998);
 assert.equal(x.settled_rotations,442);
 assert.deepEqual([x.settled_final_original_version,x.settled_final_changed_version],[201,241]);
 assert.equal(x.actual_youtube_studio_winner_labels,null);
 assert.equal(x.ctr_change,null);
 assert.equal(x.causal_effect_of_running_test,null);
 assert.equal(m.measured_experiment_results.length,0);
});
test('External rotation count and original-version survival cannot become a native winner claim',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/native-packaging-ab-tests.json'),load('specimens/youtube.json')]);
 const sources=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.external_rotation_observation.settled_final_original_version=210;
 assert(auditExternalPackagingRotations(a,sources).errors.includes('rotation count denominators do not reconcile'));
 const b=structuredClone(m);b.external_rotation_observation.actual_youtube_studio_winner_labels={original:201};
 assert(auditExternalPackagingRotations(b,sources).errors.includes('externally displayed variant misrepresented as verified native or causal result'));
 const c=structuredClone(m);c.external_rotation_observation.causal_effect_of_running_test=0.2;
 assert(auditExternalPackagingRotations(c,sources).errors.includes('externally displayed variant misrepresented as verified native or causal result'));
});
