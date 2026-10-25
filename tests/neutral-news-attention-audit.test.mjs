import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateNewsEventFrame,assessNewsSurveyClaim,assessGoogleTrendsClaim} from '../site/neutral-news-attention-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Neutral news study grounds 2026 adult survey and registered official source IDs',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/neutral-news-attention-protocol-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(m.polls.sample_size,5166);
 assert.equal(m.polls.overall_2026_pct_us_adults,34);
 assert.equal(m.polls.yearly_series.find(x=>x.year===2025).value_pct,35);
 assert.equal(m.polls.party_subgroups[0].value_pct,35);
 assert.equal(m.polls.party_subgroups[1].value_pct,36);
 assert.equal(m.private_user_records_collected,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Balanced pre and post publication windows omit event day and do not prove effects',async()=>{
 const m=await load('ontology/youtube/neutral-news-attention-protocol-2026.json');
 const frame={eventDate:'2026-09-01',beforeDays:14,afterDays:14,query:'public event',regionCode:'US',relevanceLanguage:'en',snapshotMethod:'daily'};
 const valid=validateNewsEventFrame(m,frame);
 assert.equal(valid.valid,true);assert.equal(valid.preStart,'2026-08-18');assert.equal(valid.preEnd,'2026-08-31');
 assert.equal(valid.postStart,'2026-09-02');assert.equal(valid.postEnd,'2026-09-15');
 assert.equal(valid.sampledVideoObservations,0);assert.equal(valid.causalTrafficEffect,null);
 assert.equal(validateNewsEventFrame(m,{...frame,afterDays:7}).valid,false);
 assert.equal(validateNewsEventFrame(m,{...frame,infersViewerPoliticalIdentity:true}).valid,false);
 assert.equal(validateNewsEventFrame(m,{...frame,regionCode:''}).valid,false);
});
test('Survey party-specific rates are not the party composition of news viewers',async()=>{
 const m=await load('ontology/youtube/neutral-news-attention-protocol-2026.json');
 assert.equal(assessNewsSurveyClaim(m,'2026_US_adult_regular_youtube_news_share').denominator,'all_US_adults');
 const groups=assessNewsSurveyClaim(m,'2026_US_party_specific_regular_news_prevalence');
 assert.equal(groups.allowed,true);assert.equal(groups.channel_audience_party_composition,null);
 assert.equal(assessNewsSurveyClaim(m,'political_affiliation_of_specific_youtube_channel').allowed,false);
 assert.equal(assessGoogleTrendsClaim(m,'normalized_relative_google_search_index').absolute_searches,null);
 assert.equal(assessGoogleTrendsClaim(m,'number_of_youtube_news_viewers').allowed,false);
});
test('Public dossier renders neutral news protocol with no actual user profiling',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderNeutralNewsAttention'));
 assert(app.includes('neutral-news-attention-protocol-2026.json'));
 assert(app.includes('not any channel audience political affiliation'));
});
