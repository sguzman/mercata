import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Web game dev survey 2025 zero incomes never converted to itch.io income',()=>{
 const c=read('ontology/itch-io/web-developer-survey-crosswalk-2026.json');
 const d=read('specimens/itch-io.json');
 assert.deepEqual(c.years.map(x=>x.survey_submissions),[620,445]);
 assert.deepEqual(c.years.map(x=>x.zero_game_development_income_percent),[58.2,63]);
 assert.equal(c.years[1].publishing_question_n,439);
 assert.equal(c.years[1].income_question_n,null);
 assert.equal(c.between_samples_change_interpretable_as_population_trend,false);
 assert.equal(c.itch_io_only_earnings_observed,false);
 assert(Object.values(c.unobserved).every(v=>v===null));
 assert(c.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
});
