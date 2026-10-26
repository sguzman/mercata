import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditChannelCohorts} from '../site/channel-cohort-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Vendor-indexed cohorts reconcile exactly and remain separate source frames',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditChannelCohorts(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(m.datasets[2].bins.reduce((sum,x)=>sum+x.reached_1000_at_end,0),500409);
});
test('Rejects claims that milestone groups are new creator YPP cohorts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 m.datasets[2].ypp_approvals_verified=500409;m.datasets[2].new_entrants_only=true;
 m.datasets[0].milestones[0].channels=999999999;
 m.unmeasured.net_profit=25;
 const result=auditChannelCohorts(m,new Set(d.evidence.map(x=>x.id)));
 assert.equal(result.valid,false);
 assert(result.errors.includes('invented cohort type or monetization'));
 assert(result.errors.includes('invalid cumulative milestones'));
 assert(result.errors.includes('unmeasured results invented'));
});
test('Published 360-day subgroup bin estimates are conditional observations only',async()=>{
 const m=await load('ontology/youtube/channel-cohort-observations-2026.json');
 assert.equal(m.datasets[2].window_days,360);
 assert.equal(m.datasets[2].bins[3].reported_percent,30.77);
 assert.equal(m.datasets[2].actual_upload_events_observed,false);
 assert(m.prohibited_interpretations.some(x=>x.includes('causes')));
});

test('Two distinct newer/mature niche vendor frames remain conditional and cannot be pooled',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 const x=m.niche_maturity_contrasts;
 assert.equal(x.tubeai.eligible_indexed_10k_channels,122341);
 assert.equal(x.tubeai.selected_band.newer.channels+x.tubeai.selected_band.older.channels,80139);
 assert.equal(x.tubeai.niches.find(n=>n.id==='gaming').published_newer_share_percent,13.7);
 assert.equal(x.vidiq.indexed_channels,36163);
 assert.deepEqual(x.vidiq.niches.map(n=>n.endpoint_1k),[718,1102,4977]);
 assert.equal(x.cross_dataset.probability_an_newcomer_reaches_10k,null);
 assert.equal(x.cross_dataset.sampling_frames_equivalent,false);
 assert.deepEqual(auditChannelCohorts(m,new Set(d.evidence.map(s=>s.id))),{valid:true,errors:[]});
});
test('Niche maturity audit rejects fabricated newcomer odds or misreported conditional denominators',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(s=>s.id));
 const a=structuredClone(m);
 a.niche_maturity_contrasts.tubeai.niches[0].newer_10k_active_channels=1000;
 assert(auditChannelCohorts(a,known).errors.includes('invalid conditional niche composition'));
 const b=structuredClone(m);
 b.niche_maturity_contrasts.vidiq.niches[1].endpoint_1k=800;
 assert(auditChannelCohorts(b,known).errors.includes('newer gaming endpoint count/rate mismatch'));
 const c=structuredClone(m);
 c.niche_maturity_contrasts.cross_dataset.probability_an_newcomer_reaches_10k=0.25;
 assert(auditChannelCohorts(c,known).errors.includes('incompatible vendor frames conflated'));
});

test('2019 size-tier model keeps historical estimated annual means separate from current paid-channel cohorts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 const old=m.historical_2019_modeled_ad_income,src=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditChannelCohorts(m,src),{valid:true,errors:[]});
 assert.equal(old.original_channel_sample_observation_year,2019);
 assert.equal(old.sampled_channels_total_observed_sum,36142711);
 assert.deepEqual(old.tiers.map(t=>t.modeled_mean_annual_ad_income_usd),[null,295,2058,16346,165892,1707446]);
 assert.deepEqual(old.tiers.map(t=>t.sampled_channels),[31727531,3491938,769472,138284,14969,517]);
 assert.equal(old.tiers[0].assigned_creator_payout_share_percent,0);
 assert.equal(old.tiers[0].modeled_mean_annual_ad_income_usd,null);
 assert(old.tiers.every(t=>t.native_ypp_actual_payouts_observed===false));
 assert.equal(old.comparability.median_earnings_observed,null);
 assert.equal(old.comparability.compare_directly_to_2026_vidiq_channel_index,false);
 const a=structuredClone(m);a.historical_2019_modeled_ad_income.tiers[1].modeled_mean_annual_ad_income_usd=29500;
 assert(auditChannelCohorts(a,src).errors.includes('historical publisher modeled bins misquoted or observed income invented'));
 const b=structuredClone(m);b.historical_2019_modeled_ad_income.comparability.compare_directly_to_2026_air_rpm_channels=true;
 assert(auditChannelCohorts(b,src).errors.includes('incompatible historical means treated as current earnings'));
});
