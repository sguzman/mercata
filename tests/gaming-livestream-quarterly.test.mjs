import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Gaming quarter periods and same-family sources remain distinct',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/gaming-livestream-quarterly-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 assert(m.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(m.gaming.map(x=>x.watch_hours_billion),[2.19,2.22,1.79]);
 assert.deepEqual(m.gaming.map(x=>x.channels_million),[1.11,1.07,0.878]);
 assert.equal(m.independent_samples,1);
 assert.equal(m.general_live_q2.identical_to_gaming,false);
 assert.equal(m.general_live_q2.verified_disjoint_category_boundaries,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});

test('Streams Charts Q3 is a separate vendor sample rather than a fourth Stream Hatchet quarter',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/gaming-livestream-quarterly-2026.json'),load('specimens/youtube.json')]);
 const s=m.independent_vendor_q3;
 assert(d.evidence.some(x=>x.id===s.source_id));
 assert.equal(m.gaming.length,3);
 assert.equal(m.independent_samples,1);
 assert.equal(m.separately_reported_vendor_families,2);
 assert.equal(s.gaming_watch_hours_billion_approx,1.98);
 assert.equal(s.all_youtube_live_watch_hours_billion_approx,13.62);
 assert.equal(s.gaming_share_youtube_live_hours_q2_percent_same_vendor,11.3);
 assert.equal(s.gaming_share_youtube_live_hours_q3_percent_same_vendor,14.5);
 assert.equal(s.cross_vendor_stream_hatchet_q2_absolute_comparison_allowed,false);
 assert.equal(m.cross_vendor_combined_quarterly_growth_percent,null);
 assert.equal(s.unique_viewers,null);
 assert.equal(s.creator_net_income,null);
});
