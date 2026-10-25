import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {compareLanguageIndexPeriods,auditLanguageMarketRegister} from '../site/language-market-compatibility.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const frame={query:'example',search_service:'youtube_search',comparison_panel:'joint',normalization_batch:'run_a',country:'MX',language:'es',definition_epoch:'fixed',metric:'google_trends_youtube_search_index',period_granularity:'calendar_month',sample_inclusion_rules:'same',shared_scale:true};
test('Relative index may change only in common normalized language and country frame',()=>{
 const a={...frame,period:'2025-01',index:20},b={...frame,period:'2026-01',index:40};
 assert.deepEqual(compareLanguageIndexPeriods(a,b),{valid:true,kind:'relative_index_point_change_not_search_volume_or_people',index_point_change:20,absolute_searches:null,unique_people:null,creator_income:null});
 const separate={...b,normalization_batch:'run_b'};assert.equal(compareLanguageIndexPeriods(a,separate).valid,false);
 const country={...b,country:'US'};assert.equal(compareLanguageIndexPeriods(a,country).valid,false);
});
test('Dated official audio-feature and country-ad-reach samples are not language users',async()=>{
 const [d,m,c,r]=await Promise.all(['ontology/youtube/language-market-comparability-2026.json','ontology/youtube/multilingual-distribution.json','ontology/youtube/country-ad-reach-comparisons.json','specimens/youtube.json'].map(read));
 const s=new Set(r.evidence.map(x=>x.id));assert.deepEqual(auditLanguageMarketRegister(d,m,c,s),{valid:true,errors:[]});
 assert(d.observations.every(x=>x.language===null&&x.realized_incremental_revenue===null));
});
test('Reject synthetic language growth derived from country planner figures',async()=>{
 const [d,m,c,r]=await Promise.all(['ontology/youtube/language-market-comparability-2026.json','ontology/youtube/multilingual-distribution.json','ontology/youtube/country-ad-reach-comparisons.json','specimens/youtube.json'].map(read));
 const e=structuredClone(d);e.unmeasured.language_market_annual_growth=12;
 assert(!auditLanguageMarketRegister(e,m,c,new Set(r.evidence.map(x=>x.id))).valid);
});
