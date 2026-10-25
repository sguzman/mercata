import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectSurveyResponses,assessCreatorIncomeInference} from '../site/oxford-creator-impact-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Oxford 2026 country response frames are attributed, separate and non-additive',async()=>{
  const [m,d]=await Promise.all([load('ontology/youtube/oxford-creator-impact-2026.json'),load('specimens/youtube.json')]);
  assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
  assert.equal(m.survey.fielded_from,'2026-01');
  assert.equal(m.survey.fielded_to,'2026-03');
  assert.equal(m.survey.response_counts.length,12);
  assert.deepEqual(selectSurveyResponses(m,'creator',['US']),{count:6100,unit:'survey_responses',frame:'creator',jurisdictions:['US'],population_estimate:null,earnings_distribution:null});
  assert.equal(selectSurveyResponses(m,'creator',['BR','US']).count,11300);
  assert.equal(selectSurveyResponses(m,'user',['IN']).count,3000);
  assert.throws(()=>selectSurveyResponses(m,'creator',['EU27','FR']),/Overlapping/);
  assert.throws(()=>selectSurveyResponses(m,'business',['DE','EU27']),/Overlapping/);
  assert.throws(()=>selectSurveyResponses(m,'creator',['BR','BR']),/distinct/);
  assert.throws(()=>selectSurveyResponses(m,'payout',['US']),/Unknown/);
  assert.equal(m.survey.creator_sample_is_representative_of_all_creators,false);
  assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Macroeconomic GDP and conditional work hours cannot become median creator income',async()=>{
  const m=await load('ontology/youtube/oxford-creator-impact-2026.json');
  assert.equal(m.economic_impact.us_2025.gdp_contribution_lower_bound_billion,60);
  assert.equal(m.economic_impact.us_2025.fte_jobs_lower_bound,540000);
  assert.equal(m.economic_impact.us_2025.bounds,'strict_lower');
  assert.equal(m.economic_impact.fte_min_weekly_creator_hours,8);
  assert.equal(m.economic_impact.impact_is_individual_income,false);
  for(const candidate of [{unit:'gdp'},{unit:'fte'},{unit:'survey_responses'},
    {unit:'verified_creator_cash_income',representative_all_creator_sampling:false,actual_creator_receipts:true,known_zero_earner_denominator:true}]) {
    assert.equal(assessCreatorIncomeInference(m,candidate).allowed,false);
  }
  assert.equal(assessCreatorIncomeInference(m,{unit:'verified_creator_cash_income',representative_all_creator_sampling:true,actual_creator_receipts:true,known_zero_earner_denominator:true}).allowed,true);
});
test('Site exposes the observed survey frames with explicit measurement boundary',async()=>{
  const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
  assert(app.includes('renderOxfordCreatorImpact'));
  assert(app.includes('oxford-creator-impact-2026.json'));
  assert(app.includes('Creator responses:'));
  assert(app.includes('EU27 includes France and Germany'));
});
