import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const get=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Historic shock reported values and no unsupported profit claims',async()=>{
 const [m,d]=await Promise.all([get('ontology/youtube/patreon-revenue-shock-2015.json'),get('specimens/youtube.json')]);
 const sources=new Set(d.evidence.map(x=>x.id));
 assert.equal(m.kind,'historical_patreon_subscription_shock_natural_experiment');
 assert(m.source_ids.every(x=>sources.has(x)));
 assert.equal(m.shock.reported_change_percent,-33.59);
 assert.equal(m.shock.control_adjusted_effect_same_estimate,false);
 assert.equal(m.results[0].reported_effect_percent,-7.7);
 assert.equal(m.results[0].duration_post_event_months_reported,7);
 assert.equal(m.results[0].actual_creator_net_profit,null);
 assert.equal(m.results[3].metric,'duration_at_least_10_minutes_historical_ad_break_proxy');
 assert.equal(m.study_population.all_youtube_channels_representative,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Sponsor/affiliate responses describe incidence, not cash earnings',async()=>{
 const m=await get('ontology/youtube/patreon-revenue-shock-2015.json');
 assert.equal(m.results.find(x=>x.id==='affiliate_links').effect_size_percent,null);
 assert.equal(m.results.find(x=>x.id==='sponsorship').effect_size_percent,null);
 assert.equal(m.heterogeneity[0].incremental_sponsor_cash,null);
 assert.equal(m.heterogeneity[1].incremental_affiliate_cash,null);
 assert.equal(m.identification.parallel_trends_universally_proven,false);
});
