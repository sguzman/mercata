import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectEssayEvidence,assessEssayComparison} from '../site/video-essay-evidence-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YouTube related views and BFI selected video essay works are distinct original sources',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/video-essay-sample-observations-2024.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.frame_1.reported_view_events_strictly_greater_than,200000000);
 assert.equal(m.frame_2.voters,47);
 assert.equal(m.frame_2.nominations,256);
 assert.equal(m.frame_2.distinct_selected_video_essays,183);
 assert.equal(m.frame_2.youtube_published_essays_selected,70);
 assert.equal(m.frame_2.vimeo_published_essays_selected,56);
 assert.equal(m.frame_2.selected_youtube_mean_minutes,36);
 assert.equal(m.frame_2.selected_vimeo_mean_minutes,11);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('BFI selection mean runtime never becomes viewing time or ordinary creator earnings',async()=>{
 const m=await load('ontology/youtube/video-essay-sample-observations-2024.json');
 const v=selectEssayEvidence(m,'bfi_poll','selected_youtube_mean_minutes');
 assert.equal(v.valid,true);assert.equal(v.value,36);assert.equal(v.unique_people,null);
 const views=selectEssayEvidence(m,'youtube_views','reported_view_events_strictly_greater_than');
 assert.equal(views.valid,true);assert.equal(views.value,200000000);
 assert.equal(selectEssayEvidence(m,'youtube_views','selected_youtube_mean_minutes').valid,false);
 for(const claim of ['viewer_retention','creator_income','mean_creator_work_hours','creator_patron_conversion'])
  assert.equal(assessEssayComparison(m,{claim,first_source:'bfi_poll',second_source:'youtube_views'}).allowed,false);
 assert.equal(assessEssayComparison(m,{claim:'view_ownership',first_source:'bfi_poll',second_source:'youtube_views'}).allowed,false);
});
test('Selected support links cannot prove paid conversion',async()=>{
 const m=await load('ontology/youtube/video-essay-sample-observations-2024.json');
 const result=selectEssayEvidence(m,'bfi_poll','selected_youtube_essays_external_support_link_percent_strictly_greater_than');
 assert.equal(result.value,70);assert.equal(result.payment_conversion,null);
 assert.equal(m.frame_2.creator_net_payouts,null);
});
test('Research panel identifies curated format sample and unknown viewer retention',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderVideoEssayCohort'));
 assert(app.includes('video-essay-sample-observations-2024.json'));
 assert(app.includes('not a representative creator income or attention study'));
});
