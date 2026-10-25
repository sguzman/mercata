import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessAIVideoSurveyClaim,combineNestedSavedTimeCategories} from '../site/adobe-ai-production-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Adobe survey is a vendor-run cross-platform Prolific sample, not YouTube-only',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/adobe-ai-production-survey-2026.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(x=>x.id===m.source_id));
 assert.equal(m.survey.n,384);
 assert.equal(m.survey.recruitment,'Prolific');
 assert.equal(m.survey.youtube_only_probability_sample,false);
 assert.equal(m.survey.team_size_share_percent.solo,86);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Self-reported outcomes keep exact relevant subgroup denominators',async()=>{
 const m=await load('ontology/youtube/adobe-ai-production-survey-2026.json');
 assert.equal(assessAIVideoSurveyClaim(m,'weekly_ai_video','ai_users_only').value_percent,41);
 assert.equal(assessAIVideoSurveyClaim(m,'weekly_ai_video','surveyed_us_video_creators').allowed,false);
 assert.equal(assessAIVideoSurveyClaim(m,'youtube_poster_ai_use','youtube_posting_subsample').value_percent,74);
 assert.equal(assessAIVideoSurveyClaim(m,'youtube_poster_ai_use','all_youtube_creators').allowed,false);
 assert.equal(assessAIVideoSurveyClaim(m,'more_brand_deals','respondents_with_past_brand_deals').value_percent,24);
 assert.equal(assessAIVideoSurveyClaim(m,'more_brand_deals','all_creators').allowed,false);
});
test('Nested self-reported saving categories do not establish instrumented time or profit',async()=>{
 const m=await load('ontology/youtube/adobe-ai-production-survey-2026.json');
 assert.equal(assessAIVideoSurveyClaim(m,'reported_saved_over_30_minutes','surveyed_us_video_creators').value_percent,56);
 assert.equal(assessAIVideoSurveyClaim(m,'reported_saved_over_4_hours','surveyed_us_video_creators').value_percent,10);
 assert.equal(combineNestedSavedTimeCategories(m).allowed,false);
 assert.equal(assessAIVideoSurveyClaim(m,'measured_hours_saved','surveyed_us_video_creators').allowed,false);
 assert.equal(assessAIVideoSurveyClaim(m,'reported_saved_over_30_minutes','surveyed_us_video_creators').net_creator_profit,null);
});
test('Website presents respondent data, not verified causal creator savings',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderAdobeAIProductionSurvey'));
 assert(app.includes('adobe-ai-production-survey-2026.json'));
 assert(app.includes('not measured creator profit or causal savings'));
});
