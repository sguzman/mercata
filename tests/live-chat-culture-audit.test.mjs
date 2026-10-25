import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getLiveChatObservation,assessLiveChatClaim} from '../site/live-chat-culture-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Two historical study frames are nested messages, not people or incomes',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/live-chat-culture-observations-2025.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(getLiveChatObservation(m,'initial','messages').value,673551);
 assert.equal(getLiveChatObservation(m,'initial','videos').value,1957);
 assert.equal(getLiveChatObservation(m,'final','messages').value,92412);
 assert.equal(getLiveChatObservation(m,'final','videos').value,397);
 assert.equal(m.paper.final_model_total_video_hours,780);
 assert.equal(m.paper.reported_topical_categories,27);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Observation-only model cannot be used for economic or demographic causal claims',async()=>{
 const m=await load('ontology/youtube/live-chat-culture-observations-2025.json');
 assert.equal(assessLiveChatClaim(m,'selected_model_peer_intensity').allowed,true);
 assert.equal(assessLiveChatClaim(m,'selected_model_peer_intensity').verified_creator_profit,null);
 for(const claim of ['all_youtube_chatters','all_youtube_messages','people_with_emotion','causal_peer_profit','creator_cash_profit','political_affiliation'])
   assert.equal(assessLiveChatClaim(m,claim).allowed,false);
 assert.equal(getLiveChatObservation(m,'global','messages').valid,false);
});
test('Top Chat, Live Chat and replay have separately documented visibility limits',async()=>{
 const m=await load('ontology/youtube/live-chat-culture-observations-2025.json');
 assert.deepEqual(m.platform.chat_modes.map(x=>x.id),['top_chat','live_chat']);
 assert.equal(m.platform.chat_modes[0].filtered,true);
 assert.equal(m.platform.chat_modes[1].filtered,false);
 assert.equal(m.platform.replay.edited_stream_replay_available,false);
 assert.equal(m.platform.replay.live_polls_in_replay,false);
 assert.equal(m.platform.individual_user_archives_collected,false);
});
test('Website presents selected emotion-study data with limits',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderLiveChatCultureStudy'));
 assert(app.includes('live-chat-culture-observations-2025.json'));
 assert(app.includes('not verified creator earnings'));
});
