import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessPodcastPublicationRoute,inferPodcastPublicationEarnings} from '../site/podcast-publication-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Six routes cite real Studio and YouTube Music publication evidence',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/podcast-publication-routes-2026.json'),read('specimens/youtube.json')]);
 assert.equal(m.routes.length,6);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(m.routes.every(x=>x.source_ids.every(id=>d.evidence.some(y=>y.id===id))));
 assert.equal(m.actual_podcast_episode_corpus.length,0);
 assert(Object.values(m.unavailable_measurements).every(x=>x===null));
});
test('Direct video episode and conditional RSS conversion are not the same uploader',async()=>{
 const m=await read('ontology/youtube/podcast-publication-routes-2026.json');
 assert.equal(assessPodcastPublicationRoute(m,'studio_existing_video_episode',{channel_allowed:true,video_file_ready:true,creator_owns_episode:true}).status,'passes_documented_publishing_gates');
 assert.equal(assessPodcastPublicationRoute(m,'studio_existing_video_episode',{channel_allowed:true,video_file_ready:false,creator_owns_episode:true}).status,'blocked_by_documented_gate');
 const rss={rss_region_supported:true,feed_authorized:true,rss_owner_email_access:true,advanced_features_granted:false,identity_verified_for_rss:true};
 assert.equal(assessPodcastPublicationRoute(m,'rss_auto_image_video',rss).status,'passes_documented_publishing_gates');
 assert.equal(assessPodcastPublicationRoute(m,'rss_auto_image_video',{...rss,rss_region_supported:false}).status,'blocked_by_documented_gate');
 assert.equal(assessPodcastPublicationRoute(m,'rss_auto_image_video',{...rss,identity_verified_for_rss:false}).status,'blocked_by_documented_gate');
 assert.equal(assessPodcastPublicationRoute(m,'rss_auto_image_video',{...rss,identity_verified_for_rss:undefined}).status,'unknown');
});
test('Copyright and metadata gate does not grant rights or creator earnings',async()=>{
 const m=await read('ontology/youtube/podcast-publication-routes-2026.json');
 assert.equal(assessPodcastPublicationRoute(m,'copyright_and_disclosures',{rights_cleared:false,embedded_promotions_disclosed_if_present:true}).status,'blocked_by_documented_gate');
 assert.equal(assessPodcastPublicationRoute(m,'copyright_and_disclosures',{rights_cleared:true,embedded_promotions_disclosed_if_present:true}).creator_earnings,null);
 assert.equal(inferPodcastPublicationEarnings(m).allowed,false);
});
test('Site labels podcast RSS and studio video as separate publication paths',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderPodcastPublicationRoutes'));
 assert(a.includes('podcast-publication-routes-2026.json'));
 assert(a.includes('not automatic creator payouts or outside podcast syndication'));
});
