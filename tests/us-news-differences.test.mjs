import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {summarizeSurveyDifferences,auditNewsPeriodSummary} from '../site/us-news-differences.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const files=['ontology/youtube/us-news-reported-change-2026.json','ontology/youtube/us-news-demographic-crosswalk.json','ontology/youtube/neutral-news-attention-protocol-2026.json','specimens/youtube.json'];
test('Seven Pew points show changes but provide no statistical significance or real viewer counts',async()=>{
 const [s,x,n,d]=await Promise.all(files.map(load));
 assert.deepEqual(auditNewsPeriodSummary(s,x,n,new Set(d.evidence.map(y=>y.id))),{valid:true,errors:[]});
 const r=summarizeSurveyDifferences(s.series.map(y=>({year:y.year,value_pct:y.regular_youtube_news_percent_of_all_us_adults})));
 assert.equal(r.change_full_period_pp,11);
 assert.equal(r.latest_change_pp,-1);
 assert.equal(r.unique_youtube_viewers,null);
 assert(r.differences.every(y=>y.statistically_significant===null));
});
test('Survey change math refuses missing years, invalid rates and invented significance',async()=>{
 assert.throws(()=>summarizeSurveyDifferences([{year:2020,value_pct:23},{year:2022,value_pct:25}]),/consecutive/);
 assert.throws(()=>summarizeSurveyDifferences([{year:2020,value_pct:23},{year:2021,value_pct:101}]),/Invalid/);
 const [s,x,n,d]=await Promise.all(files.map(load)),ids=new Set(d.evidence.map(y=>y.id));
 const z=structuredClone(s);z.series.at(-1).statistically_significant_vs_prior_year=true;assert(!auditNewsPeriodSummary(z,x,n,ids).valid);
 const y=structuredClone(s);y.series[2].regular_youtube_news_percent_of_all_us_adults=30;assert(!auditNewsPeriodSummary(y,x,n,ids).valid);
});
