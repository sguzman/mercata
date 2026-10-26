import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Cold-start observed views remain distinct from modeled earnings and time',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/first-upload-vlog-study-2026.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(x=>x.id===m.source_id));
 assert.equal(m.sampling.first_upload_cohort_channels,107);
 assert.equal(m.cold_start_public_views.below_1000_lifetime_views_percent,51.4);
 assert.equal(m.sampling.full_histories_videos,56419);
 assert.equal(m.earnings_value_model.modeled_not_paid,true);
 assert.equal(m.earnings_value_model.actual_earnings_usd,null);
 assert.equal(m.earnings_value_model.actual_labor_hours,null);
 assert.equal(m.population_comparison.vidiq_below_1000_cohort_same_population,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Published sensitivity brackets do not become actual payouts',async()=>{
 const m=await load('ontology/youtube/first-upload-vlog-study-2026.json');
 assert.deepEqual(m.modeled_sensitivity.map(x=>x.median_implied_value_usd),[0.7,1.61,2.81,9.08]);
 assert(m.modeled_sensitivity.every(x=>Number.isFinite(x.longform_rpm_usd)&&x.longform_rpm_usd>0));
 assert.equal(m.earnings_value_model.actual_cash_costs,null);
 assert.equal(m.earnings_value_model.verified_ypp_entry,null);
});

test('Exceptional gross estimates remain cross-platform editorial selections, not new-channel payouts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/first-upload-vlog-study-2026.json'),load('specimens/youtube.json')]);
 const x=m.exceptional_gross_earnings_cases,known=new Set(d.evidence.map(s=>s.id));
 assert(x.source_ids.length===2&&x.source_ids.every(id=>known.has(id)));
 assert.equal(x.latest.roster_n,50);
 assert.equal(x.latest.reported_aggregate_estimated_gross_usd_millions,1020);
 assert.deepEqual(x.latest.cases.map(c=>c.rank),[1,2,4]);
 assert.deepEqual(x.latest.cases.map(c=>c.estimated_gross_usd_millions),[300,65,38]);
 assert(x.latest.cases.every(c=>c.youtube_payout_usd===null&&c.net_profit_usd===null));
 assert.equal(x.previous.reported_aggregate_estimated_gross_usd_millions,853);
 assert.equal(x.previous.same_person_cohort_verified,false);
 assert.equal(x.all_creators_sampled,false);
 assert.equal(x.actual_new_creator_success_probability,null);
 assert.equal(x.can_pool_with_107_new_vlog_channels,false);
 assert.equal(x.year_over_year_same_creator_income_growth,null);
 assert.equal(x.net_creator_profit,null);
 assert.equal(x.documented_youtube_only_earnings,null);
 assert.equal(x.original_source_raw_earnings_data_independently_audited,false);
 assert(d.claims.some(c=>c.id==='forbes-2026-selected-crossplatform-exceptional-gross-estimates'&&c.source_ids.includes(x.latest.source_id)));
});
