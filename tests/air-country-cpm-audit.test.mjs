import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readCountryAdCPM,compareCountryAdCPM,inferCreatorCountryIncome} from '../site/air-country-cpm-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('AIR country CPM sample is original vendor viewer-country ad-impression pricing, not owner income',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/air-2025-viewer-cpm-countries.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(x=>x.id===m.source_ids[0]));
 assert.equal(m.study.reported_client_channels_lower_bound,3000);
 assert.equal(m.study.advertiser_cpm_is_creator_rpm,false);
 assert.equal(m.study.creator_residence_country_observed,false);
 assert.equal(m.observations.length,10);
 assert.equal(m.inferred_creator_rpm,null);
 assert.equal(m.typical_creator_monthly_income_by_residence,null);
});
test('One can compare only explicitly observed 2025 sample impression prices',async()=>{
 const m=await load('ontology/youtube/air-2025-viewer-cpm-countries.json');
 assert.equal(readCountryAdCPM(m,'US').value,14.67);
 assert.equal(readCountryAdCPM(m,'GB').value,8.91);
 assert.equal(readCountryAdCPM(m,'IN').value,0.74);
 assert.equal(readCountryAdCPM(m,'MX').supported,false);
 assert.equal(readCountryAdCPM(m,'MX').value,null);
 assert.equal(readCountryAdCPM(m,'US','creator_rpm').supported,false);
 const c=compareCountryAdCPM(m,'US','IN');
 assert.equal(c.supported,true);assert(c.price_ratio>19 && c.price_ratio<21);
 assert.equal(c.creator_earnings_ratio,null);
 assert.equal(compareCountryAdCPM(m,'US','MX').supported,false);
});
test('CPM cannot establish creator residence earnings, payout rate or local purchasing power',async()=>{
 const m=await load('ontology/youtube/air-2025-viewer-cpm-countries.json');
 assert.equal(inferCreatorCountryIncome(m,{creator_country:'US'}).allowed,false);
 assert.equal(inferCreatorCountryIncome(m,{creator_country:'IN'}).median_creator_income,null);
 assert.equal(m.verified_net_creator_profit,null);
 assert.equal(m.downloaded_creator_analytics,false);
});
test('Public site labels selected CPM as not creator take-home earnings',async()=>{
 const src=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(src.includes('renderAIRCountryAdvertiserCPM'));
 assert(src.includes('air-2025-viewer-cpm-countries.json'));
 assert(src.includes('not creator RPM or resident income'));
});
