import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Distinct provider channel coverage and 30-day tier units remain explicit',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-index-comparison-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 assert(m.source_ids.every(x=>ids.has(x)));
 assert.equal(m.creatordb.indexed_channels_at_least_1000_subscribers,2153140);
 assert.equal(m.comparison_to_vidiq.vidiq_cumulative_1000plus_subscriber_channels,24813187);
 assert.equal(m.comparison_to_vidiq.source_coverage_equivalent,false);
 assert.equal(m.comparison_to_vidiq.interpretable_as_platform_growth_between_months,false);
 assert.deepEqual(m.creatordb.engagement_and_growth_tiers.map(x=>x.median_engagement_percent),[3.2,3.1,2.5]);
 assert.deepEqual(m.creatordb.engagement_and_growth_tiers.map(x=>x.median_30d_subscriber_growth_percent),[0.7,0.7,0.7]);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Cumulative milestone counts are nested rather than additive creator samples',async()=>{
 const m=await load('ontology/youtube/creator-index-comparison-2026.json');
 const rows=m.creatordb.cumulative_subscriber_thresholds;
 assert(rows.every((x,i)=>i===0||x.channel_count<=rows[i-1].channel_count));
 assert.equal(rows[0].channel_count,2153140);
 assert.equal(rows[rows.length-1].channel_count,17);
});
