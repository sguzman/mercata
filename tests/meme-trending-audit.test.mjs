import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {summarizeHistoricalTrendingEntries,checkMemeSurveyClaim} from '../site/meme-trending-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Archive and NRG survey disclose separate populations and dates',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/meme-trending-observability-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.archive.countries,104);
 assert.equal(m.archive.snapshots,446971);
 assert.equal(m.archive.unique_video_ids,726627);
 assert.equal(m.archive.total_video_entries,78400000);
 assert.equal(m.survey.online_age_14_29_sample_size,496);
 assert.equal(m.survey.observation.find(x=>x.id==='memes_perceived_widely_known').percent,78);
 assert.equal(m.measured_meme_video_counts,null);
});
test('Duplicate appearances across snapshots and countries are not unique videos or people',async()=>{
 const m=await load('ontology/youtube/meme-trending-observability-2026.json');
 const frame={surface:'historical_curated_trending',window_start:m.archive.captured_from,window_end:m.archive.captured_through};
 const result=summarizeHistoricalTrendingEntries([
 {video_id:'VID1',country:'US',snapshot_id:'S1',rank:1},
 {video_id:'VID1',country:'GB',snapshot_id:'S1',rank:2},
 {video_id:'VID2',country:'US',snapshot_id:'S2',rank:1}
 ],frame);
 assert.equal(result.valid,true);assert.equal(result.ranked_entries,3);
 assert.equal(result.unique_videos,2);assert.equal(result.unique_viewers,null);
 assert.equal(result.meme_classified_video_count,null);
 assert.equal(summarizeHistoricalTrendingEntries([{video_id:'VID1',country:'US',snapshot_id:'S1',rank:1},{video_id:'VID2',country:'US',snapshot_id:'S1',rank:1}],frame).valid,false);
 assert.equal(summarizeHistoricalTrendingEntries([], {...frame,window_start:'2026-01-01'}).valid,false);
});
test('Memes perceived as mainstream are not observed meme viewer shares or sales',async()=>{
 const m=await load('ontology/youtube/meme-trending-observability-2026.json');
 const x=checkMemeSurveyClaim(m,'memes_perceived_widely_known','percent_of_respondents_answering_named_question');
 assert.equal(x.allowed,true);assert.equal(x.percentage,78);assert.equal(x.total_global_viewers,null);
 assert.equal(checkMemeSurveyClaim(m,'memes_perceived_widely_known','actual_meme_watching_rate').allowed,false);
 assert.equal(checkMemeSurveyClaim(m,'watched_fandom_lore_explainers','combined_niche_viewer_population').allowed,false);
});
test('Website labels historical and selected survey populations',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderMemeTrendingEvidence'));
 assert(a.includes('meme-trending-observability-2026.json'));
 assert(a.includes('not individual viewers or measured creator earnings'));
});
