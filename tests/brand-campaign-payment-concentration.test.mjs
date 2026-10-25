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
