import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getSelectedRPMMonth,validateNestedChannelRevenueShares,inferGlobalCreatorEarnings} from '../site/air-300-concentration-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('AIR October study is explicitly registered as overlapping same 300-channel underlying sample',async()=>{
 const [m,d,f]=await Promise.all([load('ontology/youtube/air-300-revenue-concentration-2026.json'),load('specimens/youtube.json'),load('ontology/youtube/source-families.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert(f.families.some(x=>x.id===m.shared_underlying_study_family&&x.relation==='same_underlying_survey_different_urls'));
 assert.equal(m.sample.total_channels,300);
 assert.equal(m.sample.monetized_channel_months,3595);
 assert.equal(m.sample.includes_unmonetized_creators,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Cumulative top revenue shares are nested and not additive',async()=>{
 const m=await load('ontology/youtube/air-300-revenue-concentration-2026.json');
 const x=validateNestedChannelRevenueShares(m);
 assert.equal(x.valid,true);
 assert.equal(x.top_10_percent,58);
 assert.equal(x.top_25_percent,82);
 assert.equal(x.top_50_percent,96);
 assert.equal(x.bottom_50_percent,4);
 assert.equal(x.may_sum_nested_top_groups,false);
 assert.equal(x.all_creator_earnings_share,null);
});
test('Monthly sample medians and owner size RPM never imply forecast or income per hour',async()=>{
 const m=await load('ontology/youtube/air-300-revenue-concentration-2026.json');
 assert.equal(getSelectedRPMMonth(m,1).value,1.56);
 assert.equal(getSelectedRPMMonth(m,11).value,2.35);
 assert.equal(getSelectedRPMMonth(m,11).predicts_future,false);
 assert.equal(getSelectedRPMMonth(m,0).supported,false);
 assert.equal(m.subscriber_size_rpm.groups[0].median_rpm_usd,2.14);
 assert.equal(m.subscriber_size_rpm.groups[1].median_rpm_usd,2.04);
 assert.equal(inferGlobalCreatorEarnings(m).allowed,false);
 assert.equal(inferGlobalCreatorEarnings(m).zero_earner_fraction,null);
});
test('Website reports select cohort nested income and incomplete creator accounts',async()=>{
 const s=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(s.includes('renderAIRRevenueConcentration'));
 assert(s.includes('air-300-revenue-concentration-2026.json'));
 assert(s.includes('not global creator profit or zero earner prevalence'));
});
