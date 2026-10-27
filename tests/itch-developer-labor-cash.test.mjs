import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analyzeReportedCashAndLabor} from '../site/itch-case-labor-analysis.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Developer cash surplus minus hypothetical known labor does not become actual hourly earnings',()=>{
 const d=read('ontology/itch-io/developer-labor-and-small-game-cash-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const x=analyzeReportedCashAndLabor(d.hypothetical_aracore_sensitivity);
 assert.equal(x.reportedCashSurplus,5);assert.equal(x.knownDevelopmentHours,1500);
 assert.equal(x.cashSurplusPerKnownDevHour,5/1500);
 assert.equal(x.illustrativeRows.find(t=>t.hypotheticalHourlyRate===10).conditionalBalanceAfterKnownDevLabor,-14995);
 assert.equal(x.illustrativeRows.find(t=>t.hypotheticalHourlyRate===20).conditionalBalanceAfterKnownDevLabor,-29995);
 assert(x.illustrativeRows.every(t=>t.fullyCostedProfit===null));
 assert.equal(x.actualHourlyWage,null);assert.equal(x.marketMedian,null);
 assert.throws(()=>analyzeReportedCashAndLabor({...d.hypothetical_aracore_sensitivity,knownDevelopmentHours:-1}),TypeError);
 assert(Object.values(d.unobserved).every(x=>x===null));
 for(const id of ['income/hours','special-games/special-4']){
  const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/developer-labor-and-small-game-cash-2026.json','ontology/itch-io/developer-labor-and-small-game-cash-2026.md','site/itch-case-labor-analysis.mjs','tests/itch-developer-labor-cash.test.mjs'])assert(t.evidence.includes(f));
 }
 for(const id of ['itch-io/economics/budget-development-inputs','itch-io/economics/budget-creator-labor']){
  const t=p.detail_tasks.find(x=>x.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['ontology/itch-io/developer-labor-and-small-game-cash-2026.json','ontology/itch-io/developer-labor-and-small-game-cash-2026.md','site/itch-case-labor-analysis.mjs','tests/itch-developer-labor-cash.test.mjs'])assert(t.evidence.includes(f));
 }
 const scope=p.detail_tasks.find(x=>x.id==='itch-io/special-games/define-small-game-scope');
 assert.equal(scope.percent,100);assert.equal(scope.status,'complete');
 assert.equal(d.small_game_actual_measurement.measured_player_completion_times,null);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
