import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditItchTaskScores} from '../scripts/itch-task-score-audit.mjs';
import {alignItchLiveEvidenceProgress} from '../scripts/align-itch-io-research-progress.mjs';
const str=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const run=(mutate=()=>{})=>{
 const p=JSON.parse(str('plans/itch-io.json')),q=JSON.parse(str('queues/itch-io.json')),
  s=JSON.parse(str('ontology/itch-io/research-synthesis-2026.json')),
  md=str('ontology/itch-io/research-synthesis-2026.md');
 mutate(p,q,s);return {source:{p,q,s,md},result:alignItchLiveEvidenceProgress(p,q,s,md)};
};
test('Automatic live alignment exactly reproduces already published values with no historical rewrite',()=>{
 const {source:{p,q,s,md},result:r}=run();
 assert.deepEqual(r.plan,p);assert.deepEqual(r.synthesis,s);assert.equal(r.markdown,md);
 assert.equal(r.synthesis.source_records,s.source_records);
 assert.equal(r.synthesis.claims,s.claims);
 assert.equal(r.score,r.plan.progress_percent?auditItchTaskScores(r.plan,q,r.synthesis).exact_percent:0);
});
test('One evidence-earned task point updates the exact mean, workstreams and markdown together',()=>{
 const {source:{p,q,s},result:r}=run(p=>{const t=p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-paid-purchase-demand');t.percent++;});
 const a=auditItchTaskScores(r.plan,q,r.synthesis);
 assert.equal(a.six_decimal_percent,r.synthesis.latest_evidence_summary.task_mean_exact_percent);
 assert.equal(r.score,(q.queues.flatMap(w=>w.tasks).reduce((n,t)=>n+t.progress,0)+r.plan.detail_tasks.reduce((n,t)=>n+t.percent,0))/244);
 assert.equal(r.score.toFixed(2),r.synthesis.latest_evidence_summary.task_mean_exact_percent.toFixed(2));
 assert(r.markdown.includes(r.score.toFixed(2)+'% exact, '+r.rounded+'% rounded'));
 assert.equal(r.synthesis.source_records,s.source_records);
 assert.equal(r.synthesis.claims,s.claims);
 assert.notEqual(r.plan.detail_tasks.find(t=>t.id==='itch-io/market/estimate-paid-purchase-demand').percent,p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-paid-purchase-demand').percent);
});
test('Malformed score, duplicate inventory and missing current markdown anchor fail closed',()=>{
 assert.throws(()=>run(p=>p.detail_tasks[0].percent=101),/Invalid task score/);
 assert.throws(()=>run(p=>p.detail_tasks.push({...p.detail_tasks[0]})),/fixed 244/);
 const p=JSON.parse(str('plans/itch-io.json')),q=JSON.parse(str('queues/itch-io.json')),
  s=JSON.parse(str('ontology/itch-io/research-synthesis-2026.json'));
 assert.throws(()=>alignItchLiveEvidenceProgress(p,q,s,'No current score anchor'),/exactly one/);
});
