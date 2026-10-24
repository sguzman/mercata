import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Publishing cadence niche medians retain quartiles and independent channel frames',async()=>{
 const [model,dossier]=await Promise.all([
  read('ontology/youtube/publishing-cadence-evidence.json'),read('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'bounded_publishing_cadence_peer_research');
 assert.equal(model.datasets.length,2);
 assert(model.datasets.every(x=>x.source_ids.every(id=>ids.has(id))));
 const air=model.datasets.find(x=>x.id==='air-282-2026');
 assert.equal(air.reported_sample_channels,282);
 assert.equal(air.niche_size_groups.length,14);
 assert(air.niche_size_groups.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(air.niche_size_groups.every(x=>x.respondent_channels_n===null));
 assert(air.niche_size_groups.every(x=>x.p25_uploads_month<=x.median_uploads_month&&x.median_uploads_month<=x.p75_uploads_month));
 assert.deepEqual(air.niche_size_groups.filter(x=>x.id==='gaming_small').map(x=>[x.median_uploads_month,x.p25_uploads_month,x.p75_uploads_month,x.coefficient_of_variation]),[[3,2,8,0.592]]);
 assert.deepEqual(air.niche_size_groups.filter(x=>x.id==='education_medium').map(x=>[x.median_uploads_month,x.p25_uploads_month,x.p75_uploads_month]),[[26,13,31]]);
 assert.equal(air.calendar_observation_period,null);
 assert.equal(air.unmeasured.unmonetized_channel_frequency,null);
 const vidiq=model.datasets.find(x=>x.id==='vidiq-2026');
 assert.equal(vidiq.reported_sample_channels,10210278);
 assert.equal(vidiq.subscriber_min_inclusive,1000);
 assert.equal(vidiq.cadence_tiers.length,5);
 assert.equal(vidiq.cadence_tiers.reduce((a,x)=>a+x.channels,0),vidiq.reported_sample_channels);
 assert.equal(vidiq.cadence_tiers.find(x=>x.id==='less_than_1').median_monthly_views_growth_percent,0.53);
 assert.equal(vidiq.cadence_tiers.find(x=>x.id==='12_or_more').median_monthly_views_growth_percent,2.18);
 assert.equal(vidiq.causal_effect_estimate,null);
 assert.equal(vidiq.niche_level_medians,null);
 assert.equal(model.cross_study_comparability.can_pool_channels,false);
 assert.equal(model.cross_study_comparability.can_estimate_marginal_revenue_from_frequency,false);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});
