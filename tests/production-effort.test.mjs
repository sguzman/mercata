import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditProductionEffort,assessStageHours} from '../scripts/production-effort-audit.mjs';
const read=async file=>JSON.parse(await readFile(new URL('../'+file,import.meta.url),'utf8'));

test('Every production workflow maps to verified sources and original cost ontology',async()=>{
 const [data,costs,dossier]=await Promise.all([
  read('ontology/youtube/production-effort-comparison.json'),
  read('ontology/youtube/production-costs.json'),
  read('specimens/youtube.json')
 ]);
 const result=auditProductionEffort(data,costs,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(result.valid,true,JSON.stringify(result.errors));
 assert.equal(data.workflows.length,6);
 assert.equal(data.paired_comparisons.length,3);
 assert.equal(data.reporting_basis,'per attempted project and per completed project separately');
 assert(Object.values(data.results).every(v=>v===null));
 assert(data.workflows.some(x=>x.id==='animated_explainer' && x.required_stage_ids.includes('art_animation')));
 assert(data.workflows.some(x=>x.id==='live_educational_session' && x.required_stage_ids.includes('community_moderation')));
});
test('Unobserved educational versus entertainment effect sizes cannot be asserted',async()=>{
 const [data,costs,dossier]=await Promise.all([
  read('ontology/youtube/production-effort-comparison.json'),
  read('ontology/youtube/production-costs.json'),
  read('specimens/youtube.json')
 ]);
 data.paired_comparisons[0].expected_direction='education_more_expensive';
 data.workflows[0].measured_median_labor_hours=12;
 const result=auditProductionEffort(data,costs,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(result.valid,false);
 assert(result.errors.some(x=>x.includes('Unobserved format contrast')));
 assert(result.errors.some(x=>x.includes('Unmeasured workload')));
});
test('Production stages cannot be counted twice or treated as observed prices',()=>{
 assert.deepEqual(assessStageHours([{stage_id:'research_ideation',hours:2},{stage_id:'editing_accessibility',hours:3}]).total_hours,5);
 assert.equal(assessStageHours([{stage_id:'research_ideation',hours:2},{stage_id:'research_ideation',hours:5}]).status,'invalid');
 assert.equal(assessStageHours([{stage_id:'research_ideation',hours:-1}]).status,'invalid');
 assert.equal(assessStageHours([{stage_id:'research_ideation',hours:Infinity}]).status,'invalid');
 assert.equal(assessStageHours([]).status,'invalid');
});
