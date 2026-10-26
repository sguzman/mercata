import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('CreatorIQ payment segments reconcile without inventing YouTube salary population',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/brand-campaign-payment-concentration-2026.json'),load('specimens/youtube.json')]);
 const registered=new Set(d.evidence.map(s=>s.id));
 assert(m.source_ids.every(id=>registered.has(id)));
 const campaign=m.datasets[0];
 assert.equal(campaign.creator_payment_fraction.reduce((a,x)=>a+x.percent_of_recipients,0),100);
 assert.equal(campaign.creator_payment_fraction.reduce((a,x)=>a+x.share_of_paid_amount_percent,0),100);
 assert.equal(campaign.nonpaid_creators_included,false);
 assert.equal(campaign.youtube_only_payment_records,false);
 assert.equal(m.datasets[2].denominators_compatible,false);
 assert.equal(m.datasets[3].add_survey_and_payee_populations,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Cumulative top 10 and top 1 shares refer only to commercial payee records',async()=>{
 const m=await load('ontology/youtube/brand-campaign-payment-concentration-2026.json');
 assert.deepEqual(m.datasets[1].periods.map(x=>x.top_10_share_percent),[53,60,62]);
 assert.deepEqual(m.datasets[1].periods.map(x=>x.top_1_share_percent),[15,18,21]);
 assert.equal(m.datasets[1].same_population_cohort_verified,false);
});

test('Kolect agreed fees use five disjoint current follower bands and within-tier quartiles',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/brand-campaign-payment-concentration-2026.json'),load('specimens/youtube.json')]);
 const x=m.youtube_agreed_fee_tiers,ids=new Set(d.evidence.map(s=>s.id));
 assert(ids.has(x.source_id)&&m.source_ids.includes(x.source_id));
 assert.equal(x.platform,'YouTube');
 assert.equal(x.exact_youtube_tier_denominators,null);
 assert.equal(x.creator_fee_settled_or_paid_verified,false);
 assert.equal(x.brand_approved_closed_percent_of_all_platform_agreed,32);
 assert.equal(x.selected_youtube_all_tier_median_agreed_creator_fee_usd,600);
 assert.deepEqual(x.tiers.map(t=>t.median_agreed_creator_fee_usd),[300,500,800,1100,1800]);
 assert.deepEqual(x.tiers.map(t=>t.p25_fee_usd),[150,300,488,633,1175]);
 assert.deepEqual(x.tiers.map(t=>t.p75_fee_usd),[500,800,1430,1994,4000]);
 assert(x.tiers.every((t,i)=>t.p25_fee_usd<=t.median_agreed_creator_fee_usd && t.median_agreed_creator_fee_usd<=t.p75_fee_usd &&
  (i===0?t.followers_min_inclusive===0:t.followers_min_inclusive===x.tiers[i-1].followers_max_exclusive)));
 assert.equal(x.tiers.at(-1).followers_max_exclusive,null);
 assert.equal(x.annual_creator_income_by_follower_tier,null);
 assert.equal(x.individual_net_profit,null);
 assert.equal(x.all_new_youtube_creators_sampled,false);
 assert.equal(x.within_niche_paid_rate,null);
 assert.equal(x.causal_effect_of_more_followers,null);
 assert(d.claims.some(c=>c.id==='kolect-youtube-2026-selected-contract-fee-by-followers'&&c.source_ids.includes(x.source_id)));
});
