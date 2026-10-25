import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessVirtualWorshipClaim,compareTwoSurveys} from '../site/virtual-worship-boundary-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Pew 2023-24 worship question reports online OR television and no YouTube users',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/virtual-worship-not-youtube-audience-2025.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.survey.respondents,36908);assert.equal(m.survey.monthly_or_more_pct,23);
 assert.equal(m.survey.weekly_or_more_pct,16);assert.equal(m.survey.explicitly_measures_youtube,false);
 assert(Object.values(m.unknown).every(x=>x===null));
});
test('Broad worship participation and YouTube ever-use samples cannot be multiplied into YouTube worship share',async()=>{
 const m=await load('ontology/youtube/virtual-worship-not-youtube-audience-2025.json');
 assert.equal(assessVirtualWorshipClaim(m,'US_adults_monthly_online_or_TV_services').value_pct,23);
 assert.equal(assessVirtualWorshipClaim(m,'US_adults_monthly_online_or_TV_services').youtube_pct,null);
 for(const c of ['share_watching_religious_services_on_youtube','religion_of_youtube_commenter','religious_creator_cash_profit'])
  assert.equal(assessVirtualWorshipClaim(m,c).allowed,false);
 assert.equal(compareTwoSurveys(m,{mode:'joint_youtube_and_religious_video_users'}).allowed,false);
});
test('Site includes clear broad survey and YouTube noninference',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderVirtualWorshipBoundary'));
 assert(app.includes('virtual-worship-not-youtube-audience-2025.json'));
 assert(app.includes('not specifically YouTube religious audiences'));
});
