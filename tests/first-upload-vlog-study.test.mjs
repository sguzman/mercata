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
