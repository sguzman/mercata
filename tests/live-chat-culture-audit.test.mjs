import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getLiveChatObservation,assessLiveChatClaim,auditLiveChatInteraction,auditLiveChatEmotionDynamics} from '../site/live-chat-culture-audit.mjs';
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

test('Japanese-language selected VTuber messages and explicit-reference rates reconcile to the published study',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/live-chat-culture-observations-2025.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditLiveChatInteraction(m,known),{valid:true,errors:[]});
 assert.equal(m.interaction_paper.streams,10);
 assert.equal(m.interaction_paper.selected_chat_messages,64279);
 assert.equal(m.interaction_paper.excluded_paid_superchats,true);
 assert.deepEqual(m.interaction_paper.observations.map(x=>x.mean_reference_lag_seconds),[11,8,12,38,12,9,16,8,9,22]);
 assert.equal(m.interaction_paper.total_unique_people,null);
 assert.notEqual(m.interaction_paper.source_id,m.source_ids[0]);
});
test('VTuber live-chat audit rejects invented aggregate response odds, identifiers and incorrect per-stream counts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/live-chat-culture-observations-2025.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);
 a.interaction_paper.representative_responded_chat_fraction=0.05;
 assert(auditLiveChatInteraction(a,known).errors.includes('privacy or inference boundary violated'));
 const b=structuredClone(m);b.interaction_paper.observations[0].messages+=100;
 assert(auditLiveChatInteraction(b,known).errors.includes('per-stream messages inconsistent'));
 const c=structuredClone(m);c.interaction_paper.excluded_paid_superchats=false;
 assert(auditLiveChatInteraction(c,known).errors.includes('privacy or inference boundary violated'));
});

test('Published Hawkes emotion-label parameters retain selection, causality and bot caveats',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/live-chat-culture-observations-2025.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditLiveChatEmotionDynamics(m,known),{valid:true,errors:[]});
 assert.equal(m.paper.emotion_excitation_coefficients.joy,0.77);
 assert.equal(m.paper.emotion_excitation_coefficients.anger,0.26);
 assert.equal(m.paper.emotion_excitation_coefficients.exact_decay_time_seconds,null);
 const x=structuredClone(m);x.paper.emotion_excitation_coefficients.creator_revenue_correlation=1;
 assert(auditLiveChatEmotionDynamics(x,known).errors.some(e=>e.includes('Unsupported')));
 const y=structuredClone(m);y.paper.emotion_excitation_coefficients.causal_emotion_transmission_proven=true;
 assert(auditLiveChatEmotionDynamics(y,known).errors.some(e=>e.includes('Unsupported')));
});
