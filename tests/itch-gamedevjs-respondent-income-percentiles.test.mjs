import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Gamedev.js self-selected response brackets cannot become an itch.io seller income distribution',()=>{
 const x=get('ontology/itch-io/gamedevjs-2025-income-respondent-percentile-bounds.json'),s=get('specimens/itch-io.json'),q=get('queues/itch-io.json'),p=get('plans/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.total_submissions,445);assert.equal(x.income_question_responses,435);
 assert.equal(x.bins.length,8);assert.equal(x.bins.at(-1).cumulative_rounded_percent,100);
 assert.equal(x.survey_zero_income_percent,63);
 assert.equal(x.survey_under_1000_cumulative_percent,78.4);
 const named=Object.fromEntries(x.bounded_quantiles.map(z=>[z.quantile,z]));
 assert.equal(named[0.1].exact_respondent_value_usd,0);assert.equal(named[0.25].exact_respondent_value_usd,0);
 assert.equal(named[0.5].exact_respondent_value_usd,0);assert.equal(named[0.75].respondent_income_bracket,'positive_income_below_1000');
 assert.equal(named[0.9].respondent_income_bracket,'21000_to_50000');
 assert.equal(x.independent_publishing_question.intersection_with_income_question_verified,null);
 assert(Object.values(x.cannot_use_for).every(Boolean));
 assert(Object.values(x.unobserved).every(z=>z===null));
 for(const id of ['income/zeros','income/tails']){
  const t=q.queues.flatMap(z=>z.tasks).find(z=>z.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const path of ['ontology/itch-io/gamedevjs-2025-income-respondent-percentile-bounds.json','ontology/itch-io/gamedevjs-2025-income-respondent-percentile-bounds.md','tests/itch-gamedevjs-respondent-income-percentiles.test.mjs'])assert(t.evidence.includes(path));
 }
 const bounded=p.detail_tasks.find(t=>t.id==='itch-io/income/seek-zero-earner-fraction');
 assert.equal(bounded.percent,100);assert.equal(bounded.status,'complete');
 const existing=q.queues.flatMap(z=>z.tasks).find(z=>z.id==='income/median');
 assert(existing.progress<100); // The itch-specific median is not observed.
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(z=>z.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
