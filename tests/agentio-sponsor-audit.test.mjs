import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateSponsorMetric,addLateViewShares,assessCausalSponsorshipLift} from '../site/agentio-sponsor-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Agentio paid integration source family is one underlying study with a defined selected frame',async()=>{
 const [m,d,f]=await Promise.all([load('ontology/youtube/agentio-sponsor-delivery-2026.json'),load('specimens/youtube.json'),load('ontology/youtube/source-families.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert(f.families.some(x=>x.id===m.shared_study_family&&x.relation==='same_underlying_survey_different_urls'));
 assert.equal(m.observation_period.aggregate_sample_integrations_strictly_greater_than,10000);
 assert.equal(m.selection.creator_population_approx_geographic_shares_percent.US,92);
 assert.equal(m.selection.random_sample_of_all_youtube_creators,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Late views are nested; late clicks are a different event unit',async()=>{
 const m=await load('ontology/youtube/agentio-sponsor-delivery-2026.json');
 assert.equal(validateSponsorMetric(m,'views_after_day_30','post30_view_share').value,38);
 assert.equal(validateSponsorMetric(m,'views_after_day_90','post90_view_share').value,27);
 assert.equal(validateSponsorMetric(m,'clicks_after_day_30','post30_click_share').value,30);
 assert.equal(addLateViewShares(m,['views_after_day_30','views_after_day_90']).allowed,false);
 assert.equal(validateSponsorMetric(m,'clicks_after_day_30','post30_view_share').allowed,false);
 assert.equal(validateSponsorMetric(m,'views_after_day_30','creator_profit').allowed,false);
});
test('Repeated deals are relative selected advertiser measures, not causal creator income',async()=>{
 const m=await load('ontology/youtube/agentio-sponsor-delivery-2026.json');
 assert.equal(validateSponsorMetric(m,'ctr_relative_eighth_placement','relative_eighth_sponsorship_ctr').value,1.8);
 assert.equal(validateSponsorMetric(m,'conversion_rate_relative_sixth_placement','relative_sixth_sponsorship_cvr').value,1.9);
 assert.equal(validateSponsorMetric(m,'advertiser_cumulative_cpm_decline_one_year','advertiser_cumulative_cpm_decline').value,54);
 assert.equal(validateSponsorMetric(m,'ctr_relative_eighth_placement','absolute_conversion_rate').allowed,false);
 assert.equal(assessCausalSponsorshipLift(m,{}).allowed,false);
});
test('Website displays actual sponsorship units with source limits',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderAgentioSponsorEvidence'));
 assert(app.includes('agentio-sponsor-delivery-2026.json'));
 assert(app.includes('not representative creator pay or verified incremental sales'));
});
