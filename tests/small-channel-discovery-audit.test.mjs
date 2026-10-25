import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditDiscoveryMetric,classifyNewChannel} from '../site/small-channel-discovery-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Nonrandom vidIQ channel index frames cannot become Reach impressions',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/small-channel-discoverability-protocol.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(x=>d.evidence.some(e=>e.id===x)));
 assert.deepEqual(m.external_channel_observations.map(x=>x.indexed_channels),[61186246,32926088]);
 assert.equal(m.external_channel_observations[1].reached_1000_at_endpoint,500409);
 assert.equal(m.observed_authorized_channel_rows.length,0);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Owner-only impressions, CTR and creator receipts cannot be inferred from public channels',async()=>{
 const m=await load('ontology/youtube/small-channel-discoverability-protocol.json');
 for(const metric of ['thumbnail_impressions','impressions_ctr','traffic_source_type','estimated_creator_ad_revenue'])
  assert.equal(auditDiscoveryMetric(m,{source:'public_vendor_index',metric}).allowed,false);
 assert.equal(auditDiscoveryMetric(m,{source:'public_vendor_index',metric:'public_subscribers'}).allowed,true);
 const x=auditDiscoveryMetric(m,{source:'authorized_owner',metric:'impressions_ctr'});
 assert.equal(x.allowed,true);assert.equal(x.actual_value,null);assert.equal(x.creator_earnings,null);
 assert.equal(auditDiscoveryMetric(m,{source:'unknown',metric:'public_views'}).allowed,false);
});
test('Established small channels are not newly created just because they have few subscribers',async()=>{
 const m=await load('ontology/youtube/small-channel-discoverability-protocol.json');
 assert.equal(classifyNewChannel(m,{first_publication_age_days:20,subscribers_at_start:10}).stratum,'new_verified_entry');
 assert.equal(classifyNewChannel(m,{first_publication_age_days:500,subscribers_at_start:20}).stratum,'small_incumbent');
 assert.equal(classifyNewChannel(m,{first_publication_age_days:500,subscribers_at_start:5000}).stratum,'medium_incumbent');
 assert.equal(classifyNewChannel(m,{first_publication_age_days:null,subscribers_at_start:20}).valid,false);
});
test('Site separates owner-authorized reach from public vendor subscriber cohorts',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderSmallChannelDiscovery'));
 assert(app.includes('small-channel-discoverability-protocol.json'));
 assert(app.includes('not owner-only thumbnail impressions'));
});
