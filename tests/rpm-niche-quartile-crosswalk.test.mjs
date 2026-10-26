import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditVisibleNicheScorecard} from '../site/niche-scorecard-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Native RPM quartiles exactly mirror the registered AIR sample',async()=>{
 const [m,a,d]=await Promise.all([load('ontology/youtube/rpm-niche-quartile-crosswalk-2026.json'),load('ontology/youtube/air-studio-benchmarks-2026.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(x=>x.id===m.source_id));
 const original=a.studies.find(x=>x.id==='monetized_rpm_sample_300');
 assert.equal(m.sample.channels,original.selected_channels_n);
 assert.equal(m.sample.channel_months,original.observed_channel_months);
 for(const x of m.niches){
  const o=original.niche_examples.find(y=>y.id===x.id);
  assert(o);assert.equal(x.median_rpm_usd,o.median_rpm_usd);
  assert.equal(x.p25_rpm_usd,o.p25_rpm_usd);
  assert.equal(x.p75_rpm_usd,o.p75_rpm_usd);
  assert.equal(x.small_n_warning,o.small_n_warning);
  assert.equal(x.reported_niche_sample_n,null);
 }
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Median-rate ratio is descriptive; quartiles overlap, profit unobserved',async()=>{
 const m=await load('ontology/youtube/rpm-niche-quartile-crosswalk-2026.json');
 assert.equal(m.pair_education_vs_gaming.ratio_of_sample_medians,4.9854);
 assert.equal(m.pair_education_vs_gaming.quartile_intervals_overlap,true);
 assert.equal(m.pair_education_vs_gaming.causal_earnings_effect,false);
 assert.equal(m.sample.zero_earners_included,false);
});

test('Visible multi-factor niche scorecard retains measured RPM only, never missing effort or profit',async()=>{
 const [rpm,opp,dossier]=await Promise.all([
  load('ontology/youtube/rpm-niche-quartile-crosswalk-2026.json'),
  load('ontology/youtube/opportunity-framework.json'),
  load('specimens/youtube.json')]);
 assert.deepEqual(auditVisibleNicheScorecard(rpm,opp,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(rpm.transparent_scorecard.required_axes_count,6);
 assert.equal(rpm.transparent_scorecard.observed_axes_count,1);
 assert.equal(rpm.transparent_scorecard.any_niche_rank,null);
 assert(rpm.transparent_scorecard.rows.every(x=>x.rankable===false&&x.missing_axes.length===5));
 assert.equal(opp.sample_niche_scorecard.observations.length,4);
});
test('Niche scorecard refuses fabricated costs or winner and detects original RPM drift',async()=>{
 const [rpm,opp,dossier]=await Promise.all([
  load('ontology/youtube/rpm-niche-quartile-crosswalk-2026.json'),
  load('ontology/youtube/opportunity-framework.json'),
  load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 const badRank=structuredClone(rpm);badRank.transparent_scorecard.any_niche_rank='education_science';
 assert(auditVisibleNicheScorecard(badRank,opp,ids).errors.includes('Unsupported overall niche rank or newcomer profit'));
 const badCost=structuredClone(rpm);badCost.transparent_scorecard.rows[0].unmeasured.creator_median_cash_cost_usd=23;
 assert(auditVisibleNicheScorecard(badCost,opp,ids).errors.includes('Missing niche dimensions concealed'));
 const badRpm=structuredClone(opp);badRpm.sample_niche_scorecard.observations[0].median_rpm_usd=999;
 assert(auditVisibleNicheScorecard(rpm,badRpm,ids).errors.includes('RPM provenance or percentiles drift'));
});
